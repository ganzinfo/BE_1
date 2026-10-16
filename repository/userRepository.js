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
  return await User.findOne({ where: { email } });
}

/**
 * Felhasználó keresése email és jelszó alapján (bejelentkezéshez, csak aktív felhasználók).
 */
export async function findByCredentials(email, password) {
  return await User.findOne({ where: { email, password, deleted: false } });
}

/**
 * Új felhasználó létrehozása az adatbázisban.
 */
export async function create(userData) {
  return await User.create(userData);
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

export default {
  findAll,
  findById,
  findByEmail,
  findByCredentials,
  create,
  softDelete,
};
