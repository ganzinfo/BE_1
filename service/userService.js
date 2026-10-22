import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as userRepository from '../repository/userRepository.js';

// Alapértelmezett token érvényességi idő percben megadva (pl. 15 perc)
export const TOKEN_EXPIRATION_MINUTES = Number(process.env.TOKEN_EXPIRATION_MINUTES) || 3;

// In-memory tokentároló az aktív bejelentkezések gyors eléréséhez
const activeTokens = new Map();

/**
 * Összes felhasználó lekérdezése (üzleti logika).
 */
export async function getAllUsers() {
  return await userRepository.findAll();
}

/**
 * Felhasználó keresése azonosító alapján.
 */
export async function getUserById(id) {
  return await userRepository.findById(id);
}

/**
 * Bejelentkezés és token kiállítás.
 * Validálja a megadott adatokat, ellenőrzi a felhasználó hitelesítő adatait és bcrypt jelszavát.
 * Sikeres azonosítás esetén tokent generál a megadott érvényességi idővel (percben),
 * és az utolsó tokent a lejárati idejével együtt elmenti a User táblába.
 */
export async function login(email, password, expirationMinutes = TOKEN_EXPIRATION_MINUTES) {
  if (!email || !password) {
    const error = new Error('Az email és jelszó megadása kötelező.');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findByCredentials(email, password);
  if (!user) {
    const error = new Error('Hibás email cím vagy jelszó.');
    error.statusCode = 401;
    throw error;
  }

  // Ha a felhasználó jelszava korábbról még nem bcrypt formátumú volt, frissítjük
  if (user.password && !user.password.startsWith('$2')) {
    user.password = await bcrypt.hash(password, 10);
  }

  // Érvényességi idő percben és lejárati dátum kiszámítása
  const validityMinutes = Number(expirationMinutes) > 0 ? Number(expirationMinutes) : TOKEN_EXPIRATION_MINUTES;
  const token = crypto.randomUUID();
  const tokenExpiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

  // Az utolsó token és a lejárati idő tárolása a User táblában
  user.token = token;
  user.tokenExpiresAt = tokenExpiresAt;
  await user.save();

  // In-memory gyorsítótár frissítése
  activeTokens.set(token, {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
    tokenExpiresAt,
  });

  return {
    message: 'Sikeres bejelentkezés!',
    token,
    isAdmin: user.isAdmin,
    expiresInMinutes: validityMinutes,
    tokenExpiresAt,
  };
}

/**
 * Token érvényességének ellenőrzése.
 * Ellenőrzi a tokent az adatbázisban (és a gyorsítótárban), valamint megvizsgálja,
 * hogy nem járt-e le az érvényességi ideje.
 * Visszaadja a felhasználó adatait, vagy null-t, ha a token érvénytelen vagy lejárt.
 */
export async function verifyToken(token) {
  if (!token) {
    return null;
  }

  const now = new Date();

  // 1. Ellenőrzés az in-memory memóriatárból
  if (activeTokens.has(token)) {
    const session = activeTokens.get(token);
    if (session.tokenExpiresAt && new Date(session.tokenExpiresAt) <= now) {
      activeTokens.delete(token);
      return null; // A token lejárt
    }
    return session;
  }

  // 2. Ha memóriában nem található (pl. szerver újraindult), ellenőrizzük az adatbázisban az utolsó elmentett tokent
  const user = await userRepository.findByToken(token);
  if (!user || user.deleted) {
    return null;
  }

  // Megvizsgáljuk, hogy lejárt-e a token
  if (user.tokenExpiresAt && new Date(user.tokenExpiresAt) <= now) {
    return null; // A token lejárt
  }

  const session = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
    tokenExpiresAt: user.tokenExpiresAt,
  };
  activeTokens.set(token, session);

  return session;
}

/**
 * Új felhasználó létrehozása (üzleti logika).
 * Ellenőrzi a kötelező mezőket és az email egyediségét, majd a repository-n keresztül létrehozza a rekordot.
 */
export async function createUser(userData) {
  const { firstName, lastName, email, birthYear, password, isAdmin, admin } = userData;

  if (!firstName || !lastName || !email || !birthYear) {
    const error = new Error('A firstName, lastName, email és birthYear megadása kötelező.');
    error.statusCode = 400;
    throw error;
  }

  // Ellenőrizzük, hogy létezik-e már felhasználó ezzel az email címmel
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('Ezzel az email címmel már létezik felhasználó.');
    error.statusCode = 409;
    throw error;
  }

  // Jelszó hashelése bcrypt segítségével (ha nincs megadva, az alapértelmezett 'password123'-at hasheljük)
  const plainPassword = password || 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Admin jogosultság beállítása (ha nincs megadva, alapértelmezetten false)
  const userIsAdmin = isAdmin !== undefined ? Boolean(isAdmin) : (admin !== undefined ? Boolean(admin) : false);

  return await userRepository.create({
    firstName,
    lastName,
    email,
    birthYear,
    password: hashedPassword,
    isAdmin: userIsAdmin,
  });
}

/**
 * Felhasználó logikai törlése azonosító alapján (üzleti logika).
 * Ellenőrzi a felhasználó létezését, és ha még nem volt törölve, beállítja a deleted flaget true-ra.
 */
export async function deleteUser(id) {
  if (!id) {
    const error = new Error('A felhasználó azonosítójának (ID) megadása kötelező.');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('A megadott azonosítójú felhasználó nem található.');
    error.statusCode = 404;
    throw error;
  }

  if (user.deleted) {
    const error = new Error('A felhasználó már korábban törölve lett.');
    error.statusCode = 400;
    throw error;
  }

  await userRepository.softDelete(id);

  return {
    message: 'Felhasználó sikeresen inaktiválva (logikailag törölve)!',
    id: Number(id),
  };
}

export default {
  TOKEN_EXPIRATION_MINUTES,
  getAllUsers,
  getUserById,
  login,
  verifyToken,
  createUser,
  deleteUser,
};

