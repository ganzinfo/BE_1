import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin.js';

/**
 * Nem törölt (aktív) adminisztrátorok lekérdezése az adatbázisból.
 */
export async function findAll() {
  return await Admin.findAll({
    where: {
      deleted: false,
    },
  });
}

/**
 * Adminisztrátor keresése azonosító (ID) alapján.
 */
export async function findById(id) {
  return await Admin.findByPk(id);
}

/**
 * Adminisztrátor keresése felhasználónév (username) alapján.
 */
export async function findByUsername(username) {
  console.log(`[ADMIN REPOSITORY] findByUsername -> SQL: keresés username alapján: "${username}"`);
  const admin = await Admin.findOne({ where: { username, deleted: false } });
  console.log(`[ADMIN REPOSITORY] findByUsername -> Eredmény: ${admin ? `Találat (ID=${admin.id})` : 'Nincs találat'}`);
  return admin;
}

/**
 * Adminisztrátor keresése email cím alapján.
 */
export async function findByEmail(email) {
  console.log(`[ADMIN REPOSITORY] findByEmail -> SQL: keresés email alapján: "${email}"`);
  const admin = await Admin.findOne({ where: { email, deleted: false } });
  console.log(`[ADMIN REPOSITORY] findByEmail -> Eredmény: ${admin ? `Találat (ID=${admin.id})` : 'Nincs találat'}`);
  return admin;
}

/**
 * Adminisztrátor keresése felhasználónév és jelszó alapján (bejelentkezéshez).
 * A jelszó egyezést bcrypt segítségével vizsgálja.
 */
export async function findByCredentials(username, password) {
  console.log(`[ADMIN REPOSITORY] findByCredentials -> SQL: keresés hitelesítő adatok alapján: username="${username}" (deleted=false)`);
  const admin = await Admin.findOne({ where: { username, deleted: false } });
  if (!admin) {
    console.log(`[ADMIN REPOSITORY] findByCredentials -> Nincs ilyen aktív admin az adatbázisban`);
    return null;
  }

  let isMatch = false;
  if (admin.password && admin.password.startsWith('$2')) {
    isMatch = await bcrypt.compare(password, admin.password);
  } else {
    isMatch = admin.password === password;
  }

  console.log(`[ADMIN REPOSITORY] findByCredentials -> Jelszó ellenőrzés eredménye: ${isMatch ? 'SIKERES egyezés' : 'HIBÁS jelszó'}`);
  return isMatch ? admin : null;
}

/**
 * Adminisztrátor keresése token alapján (csak aktív, nem törölt adminok).
 */
export async function findByToken(token) {
  console.log(`[ADMIN REPOSITORY] findByToken -> SQL: SELECT * FROM Admins WHERE token = "${token}" AND deleted = false`);
  const admin = await Admin.findOne({ where: { token, deleted: false } });
  console.log(`[ADMIN REPOSITORY] findByToken -> Eredmény: ${admin ? `Találat! (ID=${admin.id}, Username="${admin.username}", tokenExpiresAt: ${admin.tokenExpiresAt})` : 'NINCS találat az adatbázisban'}`);
  return admin;
}

/**
 * Admin token és lejárati idő frissítése az adatbázisban.
 */
export async function updateToken(id, token, tokenExpiresAt) {
  const admin = await Admin.findByPk(id);
  if (!admin) {
    return null;
  }
  admin.token = token;
  admin.tokenExpiresAt = tokenExpiresAt;
  await admin.save();
  return admin;
}

/**
 * Új adminisztrátor létrehozása az adatbázisban.
 */
export async function create(adminData) {
  console.log(`[ADMIN REPOSITORY] create -> SQL: új Admin rekord beszúrása: username="${adminData.username}"`);
  const created = await Admin.create(adminData);
  console.log(`[ADMIN REPOSITORY] create -> Beszúrva! Új admin ID=${created.id}`);
  return created;
}

export default {
  findAll,
  findById,
  findByUsername,
  findByEmail,
  findByCredentials,
  findByToken,
  updateToken,
  create,
};
