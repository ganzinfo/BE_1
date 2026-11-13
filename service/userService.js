import crypto from 'crypto';
import bcrypt from 'bcrypt';
import validator from 'validator';
import * as userRepository from '../repository/userRepository.js';
import * as adminRepository from '../repository/adminRepository.js';

// Alapértelmezett token érvényességi idő percben megadva (pl. 15 perc)
export const TOKEN_EXPIRATION_MINUTES = Number(process.env.TOKEN_EXPIRATION_MINUTES) || 20;

// In-memory tokentároló az aktív bejelentkezések gyors eléréséhez
const activeTokens = new Map();

/**
 * Visszaadja a megadott dátumot a helyi időzóna szerint formázott szövegként (YYYY-MM-DD HH:mm:ss).
 * A JavaScript beépített Date metódusai (getFullYear, getHours, stb.) automatikusan a helyi időzónát
 * és az aktuális téli / nyári időszámítást (daylight saving time, CET / CEST) alkalmazzák.
 */
export function getLocalDateTime(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const pad = (num) => String(num).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Helyi idő stringet alakít át Date objektummá a helyi időzóna és a téli/nyári időszámítás szerint.
 * A Date(year, monthIndex, day, hours, minutes, seconds) konstruktor a helyi időzóna és az adott
 * időpontra érvényes téli/nyári időszámítás szerint állítja elő a pillanatot.
 */
export function parseLocalDateTime(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;

  // Ha a szöveg végén explicit időzóna eltérés található (pl. +00:00 vagy Z), azt a new Date közvetlenül kezeli
  if (typeof dateStr === 'string' && (dateStr.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateStr))) {
    return new Date(dateStr);
  }

  // Helyi idő string (pl. 'YYYY-MM-DD HH:mm:ss' vagy 'YYYY-MM-DDTHH:mm:ss')
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    const [, year, month, day, hours, minutes, seconds] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
  }
  return new Date(dateStr);
}

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
 * Validálja a megadott adatokat, ellenőrzi, hogy az azonosító email vagy nem email (felhasználónév).
 * - Ha email: a Users táblában keresi a felhasználót és ellenőrzi a jelszó hash-t.
 * - Ha nem email: az Admins táblában keresi az admint (username alapján) és ellenőrzi a jelszó hash-t.
 * Sikeres azonosítás esetén tokent generál a megadott érvényességi idővel (percben),
 * és az utolsó tokent a lejárati idejével együtt elmenti az adott rekordba.
 */
export async function login(identifier, password, expirationMinutes = TOKEN_EXPIRATION_MINUTES) {
  console.log(`[SERVICE] login -> Bejelentkezési folyamat indítása: azonosító="${identifier}"`);
  if (!identifier || !password) {
    const error = new Error('Az azonosító (email vagy felhasználónév) és jelszó megadása kötelező.');
    error.statusCode = 400;
    throw error;
  }

  const trimmedIdentifier = String(identifier).trim();
  const isEmail = validator.isEmail(trimmedIdentifier);
  console.log(`[SERVICE] login -> Azonosító típusának ellenőrzése: "${trimmedIdentifier}" -> ${isEmail ? 'EMAIL cím (keresés a Users táblában)' : 'NEM email / felhasználónév (keresés az Admins táblában)'}`);

  let account = null;
  let isAdmin = false;

  if (isEmail) {
    console.log(`[SERVICE] login -> userRepository.findByCredentials hívása email="${trimmedIdentifier}" címre...`);
    account = await userRepository.findByCredentials(trimmedIdentifier, password);
    // A feladat szerint a users táblában marad az admin flag, de nem használjuk
    isAdmin = false;
    if (!account) {
      console.log(`[SERVICE] login -> Sikertelen hitelesítés a Users táblában: hibás email vagy jelszó`);
      const error = new Error('Hibás email cím vagy jelszó.');
      error.statusCode = 401;
      throw error;
    }
  } else {
    console.log(`[SERVICE] login -> adminRepository.findByCredentials hívása username="${trimmedIdentifier}" névre...`);
    account = await adminRepository.findByCredentials(trimmedIdentifier, password);
    isAdmin = true;
    if (!account) {
      console.log(`[SERVICE] login -> Sikertelen hitelesítés az Admins táblában: hibás felhasználónév vagy jelszó`);
      const error = new Error('Hibás felhasználónév vagy jelszó.');
      error.statusCode = 401;
      throw error;
    }
  }

  // Ha a felhasználó vagy admin jelszava korábbról még nem bcrypt formátumú volt, frissítjük
  if (account.password && !account.password.startsWith('$2')) {
    account.password = await bcrypt.hash(password, 10);
  }

  // Érvényességi idő percben és lejárati dátum kiszámítása a helyi időzónában (téli/nyári időszámítással)
  const validityMinutes = Number(expirationMinutes) > 0 ? Number(expirationMinutes) : TOKEN_EXPIRATION_MINUTES;
  const token = crypto.randomUUID();
  const expiresDate = new Date(Date.now() + validityMinutes * 60 * 1000);
  const tokenExpiresAt = getLocalDateTime(expiresDate);

  // Az utolsó token és a lejárati idő tárolása az adatbázisban a helyi időzóna szerint
  account.token = token;
  account.tokenExpiresAt = tokenExpiresAt;
  await account.save();
  console.log(`[SERVICE] login -> Új token elmentve az adatbázisba (${isAdmin ? 'Admin' : 'User'}): "${token}", lejár: ${tokenExpiresAt} (${validityMinutes} perc)`);

  // In-memory gyorsítótár frissítése
  activeTokens.set(token, {
    id: account.id,
    username: account.username || null,
    email: account.email,
    isAdmin,
    role: isAdmin ? 'admin' : 'user',
    tokenExpiresAt,
  });
  console.log(`[SERVICE] login -> In-memory gyorsítótár (activeTokens) frissítve`);

  return {
    message: 'Sikeres bejelentkezés!',
    token,
    isAdmin,
    role: isAdmin ? 'admin' : 'user',
    username: account.username || undefined,
    email: account.email,
    expiresInMinutes: validityMinutes,
    tokenExpiresAt,
  };
}

/**
 * Token érvényességének ellenőrzése.
 * Ellenőrzi a tokent az adatbázisban (és a gyorsítótárban), valamint megvizsgálja a helyi időzóna
 * (téli / nyári időszámítás) szerint, hogy nem járt-e le az érvényességi ideje.
 * Visszaadja a felhasználó/admin adatait, vagy null-t, ha a token érvénytelen vagy lejárt.
 */
export async function verifyToken(token) {
  console.log(`[SERVICE] verifyToken -> Token vizsgálatának kezdete: "${token || '(üres)'}"`);
  if (!token) {
    console.log(`[SERVICE] verifyToken -> Nincs megadva token! null értékkel térünk vissza`);
    return null;
  }

  const now = new Date();

  // 1. Ellenőrzés az in-memory memóriatárból
  if (activeTokens.has(token)) {
    console.log(`[SERVICE] verifyToken -> [1. LÉPÉS] Token megtalálva az in-memory gyorsítótárban`);
    const session = activeTokens.get(token);
    const expiresDate = parseLocalDateTime(session.tokenExpiresAt);
    console.log(`[SERVICE] verifyToken -> Gyorsítótár lejárata: ${session.tokenExpiresAt}, Aktuális idő: ${getLocalDateTime(now)}`);
    if (expiresDate && expiresDate <= now) {
      console.log(`[SERVICE] verifyToken -> A memóriában lévő token LEJÁRT! Törlés a memóriából.`);
      activeTokens.delete(token);
      return null; // A token lejárt
    }
    console.log(`[SERVICE] verifyToken -> Memóriában lévő token ÉRVÉNYES! Azonosító: ID=${session.id}, Email="${session.email}", isAdmin=${session.isAdmin}`);
    return session;
  }

  // 2. Ha memóriában nem található (pl. szerver újraindult), ellenőrizzük az adatbázisban
  console.log(`[SERVICE] verifyToken -> [2. LÉPÉS] Token nincs a memóriában, keresés az adatbázisban...`);
  let account = await userRepository.findByToken(token);
  let isAdmin = false;

  if (account && !account.deleted) {
    isAdmin = false;
  } else {
    // Keresés az Admins táblában
    account = await adminRepository.findByToken(token);
    if (account && !account.deleted) {
      isAdmin = true;
    }
  }

  if (!account || account.deleted) {
    console.log(`[SERVICE] verifyToken -> Az adatbázisban SEM található aktív felhasználó vagy admin ezzel a tokennel: "${token}"`);
    return null;
  }

  // Megvizsgáljuk, hogy lejárt-e a token a helyi időzóna alapján
  console.log(`[SERVICE] verifyToken -> Rekord megtalálva a DB-ben: ID=${account.id}, Email="${account.email}", isAdmin=${isAdmin}, Lejárat: ${account.tokenExpiresAt}`);
  const userExpiresDate = parseLocalDateTime(account.tokenExpiresAt);
  console.log(`[SERVICE] verifyToken -> DB lejárati idő: ${account.tokenExpiresAt}, Aktuális idő: ${getLocalDateTime(now)}`);
  if (userExpiresDate && userExpiresDate <= now) {
    console.log(`[SERVICE] verifyToken -> Az adatbázisban tárolt token LEJÁRT!`);
    return null; // A token lejárt
  }

  console.log(`[SERVICE] verifyToken -> Az adatbázisban lévő token ÉRVÉNYES! Visszatöltés az in-memory memóriatárba.`);
  const session = {
    id: account.id,
    username: account.username || null,
    email: account.email,
    isAdmin,
    role: isAdmin ? 'admin' : 'user',
    tokenExpiresAt: account.tokenExpiresAt,
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
  console.log(`[SERVICE] createUser -> Új felhasználó létrehozása indul: email="${email}", név="${firstName} ${lastName}", birthYear=${birthYear}`);

  if (!firstName || !lastName || !email || !birthYear) {
    console.log(`[SERVICE] createUser -> HIBA: Hiányzó kötelező mezők!`);
    const error = new Error('A firstName, lastName, email és birthYear megadása kötelező.');
    error.statusCode = 400;
    throw error;
  }

  // Ellenőrizzük, hogy létezik-e már felhasználó ezzel az email címmel
  console.log(`[SERVICE] createUser -> userRepository.findByEmail hívása email="${email}" címre...`);
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    console.log(`[SERVICE] createUser -> HIBA: Ezzel az email címmel már létezik felhasználó (ID=${existingUser.id})!`);
    const error = new Error('Ezzel az email címmel már létezik felhasználó.');
    error.statusCode = 409;
    throw error;
  }

  // Jelszó hashelése bcrypt segítségével (ha nincs megadva, az alapértelmezett 'password123'-at hasheljük)
  const plainPassword = password || 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Admin jogosultság beállítása (ha nincs megadva, alapértelmezetten false)
  const userIsAdmin = isAdmin !== undefined ? Boolean(isAdmin) : (admin !== undefined ? Boolean(admin) : false);

  console.log(`[SERVICE] createUser -> userRepository.create hívása...`);
  const createdUser = await userRepository.create({
    firstName,
    lastName,
    email,
    birthYear,
    password: hashedPassword,
    isAdmin: userIsAdmin,
  });

  console.log(`[SERVICE] createUser -> SIKERES létrehozás! Új felhasználó ID=${createdUser.id}, Email="${createdUser.email}"`);
  return createdUser;
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
  getLocalDateTime,
  parseLocalDateTime,
};

