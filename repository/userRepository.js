import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

/**
 * Nem törölt (aktív) felhasználók lekérdezése az adatbázisból.
 */
export async function findAll() {
  return await User.findAll({
    where: {
      deleted: false,
    },
  });
}

/**
 * Felhasználó keresése azonosító (ID) alapján.
 */
export async function findById(id) {
  return await User.findByPk(id);
}

/**
 * Felhasználó keresése email cím alapján.
 */
export async function findByEmail(email) {
  console.log(`[REPOSITORY] findByEmail -> SQL: keresés email alapján: "${email}"`);
  const user = await User.findOne({ where: { email } });
  console.log(`[REPOSITORY] findByEmail -> Eredmény: ${user ? `Találat (ID=${user.id})` : 'Nincs találat (szabad email)'}`);
  return user;
}

/**
 * Felhasználó keresése email és jelszó alapján (bejelentkezéshez, csak aktív felhasználók).
 * A jelszó egyezést bcrypt segítségével vizsgálja.
 */
export async function findByCredentials(email, password) {
  console.log(`[REPOSITORY] findByCredentials -> SQL: keresés hitelesítő adatok alapján: "${email}" (deleted=false)`);
  const user = await User.findOne({ where: { email, deleted: false } });
  if (!user) {
    console.log(`[REPOSITORY] findByCredentials -> Nincs ilyen aktív felhasználó az adatbázisban`);
    return null;
  }

  let isMatch = false;
  if (user.password && user.password.startsWith('$2')) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    isMatch = user.password === password;
  }

  console.log(`[REPOSITORY] findByCredentials -> Jelszó ellenőrzés eredménye: ${isMatch ? 'SIKERES egyezés' : 'HIBÁS jelszó'}`);
  return isMatch ? user : null;
}

/**
 * Új felhasználó létrehozása az adatbázisban.
 */
export async function create(userData) {
  console.log(`[REPOSITORY] create -> SQL: új User rekord beszúrása: email="${userData.email}"`);
  const created = await User.create(userData);
  console.log(`[REPOSITORY] create -> Beszúrva! Új rekord ID=${created.id}`);
  return created;
}

/**
 * Felhasználó logikai törlése (deleted = true).
 */
export async function softDelete(id) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  user.deleted = true;
  await user.save();
  return user;
}

/**
 * Felhasználó keresése az utolsó token alapján (csak aktív, nem törölt felhasználók).
 */
export async function findByToken(token) {
  console.log(`[REPOSITORY] findByToken -> SQL: SELECT * FROM Users WHERE token = "${token}" AND deleted = false`);
  const user = await User.findOne({ where: { token, deleted: false } });
  console.log(`[REPOSITORY] findByToken -> Eredmény: ${user ? `Találat! (ID=${user.id}, Email="${user.email}", tokenExpiresAt: ${user.tokenExpiresAt})` : 'NINCS találat az adatbázisban'}`);
  return user;
}

/**
 * Felhasználó utolsó tokenjének és lejárati idejének frissítése az adatbázisban.
 */
export async function updateToken(id, token, tokenExpiresAt) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  user.token = token;
  user.tokenExpiresAt = tokenExpiresAt;
  await user.save();
  return user;
}

export default {
  findAll,
  findById,
  findByEmail,
  findByCredentials,
  findByToken,
  updateToken,
  create,
  softDelete,
};
