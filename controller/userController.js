import * as userService from '../service/userService.js';

/**
 * Felhasználó bejelentkeztetése.
 * Kinyeri az adatokat a kérés törzséből (req.body), meghívja a service réteget,
 * és visszaküldi a választ vagy a megfelelő HTTP hibakódot.
 */
export async function login(req, res) {
  try {
    const { email, password, expirationMinutes } = req.body;
    const result = await userService.login(email, password, expirationMinutes);
    res.json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.statusCode ? error.message : 'Hiba történt a bejelentkezés során.';
    res.status(status).json({ error: message });
  }
}

/**
 * Összes felhasználó lekérdezése HTTP végponton keresztül.
 */
export async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült lekérni a felhasználókat.' });
  }
}

/**
 * Autentikációs middleware a bejelentkezett felhasználók (user jog) ellenőrzésére.
 */
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader || req.headers['token'] || req.query.token;

  const user = await userService.verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Hozzáférés megtagadva! Érvénytelen vagy lejárt token.' });
  }

  req.user = user;
  next();
}

/**
 * Autentikációs middleware az adminisztrátori jogosultság (admin jog) ellenőrzésére.
 */
export async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader || req.headers['token'] || req.query.token;

  const user = await userService.verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Hozzáférés megtagadva! Érvénytelen vagy lejárt token.' });
  }

  if (!user.isAdmin) {
    return res.status(403).json({ error: 'Hozzáférés megtagadva! Ehhez a művelethez adminisztrátori jogosultság szükséges.' });
  }

  req.user = user;
  next();
}


/**
 * Új felhasználó létrehozása HTTP POST kérésre.
 */
export async function createUser(req, res) {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.statusCode ? error.message : 'Nem sikerült létrehozni a felhasználót.';
    res.status(status).json({ error: message });
  }
}

/**
 * Felhasználó logikai törlése (inaktiválása) ID alapján.
 */
export async function deleteUser(req, res) {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.statusCode ? error.message : 'Nem sikerült törölni a felhasználót.';
    res.status(status).json({ error: message });
  }
}

export default {
  login,
  getUsers,
  createUser,
  deleteUser,
  authenticateToken,
  authenticateAdmin,
};
