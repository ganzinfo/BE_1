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
  return await User.findOne({ where: { email } });
}

/**
 * Felhasználó keresése email és jelszó alapján (bejelentkezéshez, csak aktív felhasználók).
 * A jelszó egyezést bcrypt segítségével vizsgálja.
 */
export async function findByCredentials(email, password) {
  const user = await User.findOne({ where: { email, deleted: false } });
  if (!user) {
    return null;
  }

  let isMatch = false;
  if (user.password && user.password.startsWith('$2')) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    isMatch = user.password === password;
  }

  return isMatch ? user : null;
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
