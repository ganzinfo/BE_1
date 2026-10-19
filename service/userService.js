import crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as userRepository from '../repository/userRepository.js';

// In-memory tokentároló az aktív bejelentkezésekhez
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
 * Validálja a megadott adatokat, ellenőrzi a felhasználó hitelesítő adatait és bcrypt jelszavát a repository-n keresztül,
 * majd sikeres egyezés esetén tokent generál és tárol.
 */
export async function login(email, password) {
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
    await user.save();
  }

  const token = crypto.randomUUID();
  activeTokens.set(token, { id: user.id, email: user.email });

  return {
    message: 'Sikeres bejelentkezés!',
    token,
  };
}

/**
 * Token érvényességének ellenőrzése.
 * Visszaadja a bejelentkezett felhasználó adatait, vagy null-t, ha a token érvénytelen.
 */
export function verifyToken(token) {
  if (!token || !activeTokens.has(token)) {
    return null;
  }
  return activeTokens.get(token);
}

/**
 * Új felhasználó létrehozása (üzleti logika).
 * Ellenőrzi a kötelező mezőket és az email egyediségét, majd a repository-n keresztül létrehozza a rekordot.
 */
export async function createUser(userData) {
  const { firstName, lastName, email, birthYear, password } = userData;

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

  return await userRepository.create({
    firstName,
    lastName,
    email,
    birthYear,
    password: hashedPassword,
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
  getAllUsers,
  getUserById,
  login,
  verifyToken,
  createUser,
  deleteUser,
};
