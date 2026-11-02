import * as userService from '../service/userService.js';

/**
 * Felhasználó bejelentkeztetése.
 * Kinyeri az adatokat a kérés törzséből (req.body), meghívja a service réteget,
 * és visszaküldi a választ vagy a megfelelő HTTP hibakódot.
 */
export async function login(req, res) {
  try {
    const { email, password, expirationMinutes } = req.body;
    console.log(`[CONTROLLER] login -> Bejelentkezési kísérlet érkezett (email: "${email}")`);
    const result = await userService.login(email, password, expirationMinutes);
    console.log(`[CONTROLLER] login -> Sikeres bejelentkezés! Token kiállítva: "${result.token}" (isAdmin: ${result.isAdmin})`);
    res.json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.statusCode ? error.message : 'Hiba történt a bejelentkezés során.';
    console.log(`[CONTROLLER] login -> Hiba a bejelentkezés során: ${message} (Státusz: ${status})`);
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

  console.log(`[CONTROLLER] authenticateToken -> Kérés autentikálása indul`);
  console.log(`[CONTROLLER] authenticateToken -> Beérkezett Authorization fejléc: "${authHeader || '(nincs)'}"`);
  console.log(`[CONTROLLER] authenticateToken -> Kinyert token: "${token || '(nincs)'}"`);

  const user = await userService.verifyToken(token);
  if (!user) {
    console.log(`[CONTROLLER] authenticateToken -> SIKERTELEN autentikáció! Token érvénytelen vagy lejárt -> 401 Hiba küldése`);
    return res.status(401).json({ error: 'Hozzáférés megtagadva! Érvénytelen vagy lejárt token.' });
  }

  console.log(`[CONTROLLER] authenticateToken -> SIKERES autentikáció! Felhasználó: ID=${user.id}, Email="${user.email}", isAdmin=${user.isAdmin}`);
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

  console.log(`[CONTROLLER] authenticateAdmin -> Admin jogosultság ellenőrzése indul (token: "${token || '(nincs)'}")`);

  const user = await userService.verifyToken(token);
  if (!user) {
    console.log(`[CONTROLLER] authenticateAdmin -> SIKERTELEN autentikáció! Token érvénytelen vagy lejárt -> 401 Hiba küldése`);
    return res.status(401).json({ error: 'Hozzáférés megtagadva! Érvénytelen vagy lejárt token.' });
  }

  if (!user.isAdmin) {
    console.log(`[CONTROLLER] authenticateAdmin -> SIKERTELEN: Felhasználó (ID=${user.id}, Email="${user.email}") NEM admin -> 403 Hiba küldése`);
    return res.status(403).json({ error: 'Hozzáférés megtagadva! Ehhez a művelethez adminisztrátori jogosultság szükséges.' });
  }

  console.log(`[CONTROLLER] authenticateAdmin -> SIKERES admin autentikáció! Felhasználó: ID=${user.id}, Email="${user.email}"`);
  req.user = user;
  next();
}


/**
 * Új felhasználó létrehozása HTTP POST kérésre.
 */
export async function createUser(req, res) {
  try {
    console.log(`[CONTROLLER] createUser -> Új felhasználó létrehozása kérés feldolgozása`);
    console.log(`[CONTROLLER] createUser -> Request body:`, JSON.stringify(req.body));
    const newUser = await userService.createUser(req.body);
    console.log(`[CONTROLLER] createUser -> SIKERES létrehozás! Új felhasználó ID=${newUser.id}, Email="${newUser.email}" -> 201 Válasz`);
    res.status(201).json(newUser);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.statusCode ? error.message : 'Nem sikerült létrehozni a felhasználót.';
    console.log(`[CONTROLLER] createUser -> Hiba történt: ${message} (Státusz: ${status})`);
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
