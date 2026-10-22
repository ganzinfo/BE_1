import express from 'express';
import path from 'path';
import { connectDB } from './db.js';
import { checkEmptyTable as checkEmptyUsersTable } from './z_dummy_data/users_dummy.js';
import { checkEmptyTable as checkEmptyTasksTable } from './z_dummy_data/tasks_dummy.js';
import * as userController from './controller/userController.js';
import * as taskController from './controller/taskController.js';
import * as userService from './service/userService.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Minimalista kérésnaplózó (logger) middleware státuszkóddal
app.use((req, res, next) => {
  res.on('finish', () => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
  });
  next();
});

// Statikus fájlok kiszolgálása a public mappából
app.use(express.static('public'));

// JSON kérések törzsének feldolgozása
app.use(express.json());

// Favicon kiszolgálása
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve('public/favicon.svg'));
});

// Alapértelmezett teszt útvonal: belépés nélkül udvarias elutasító üzenet, belépéssel üdvözlés
app.get('/', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader || req.headers['token'] || req.query.token;

  const user = token ? await userService.verifyToken(token) : null;
  if (!user) {
    return res.status(401).json({
      message: 'Kérjük, szíveskedjen bejelentkezni a rendszer használatához! Bejelentkezés nélkül a szolgáltatás sajnos nem érhető el.',
    });
  }

  res.json({
    message: 'Express szerver sikeresen fut! Üdvözöljük a rendszerben.',
    user: {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

// --- API Útvonalak (A kérések kezelését a Controller réteg végzi) ---

// Bejelentkezés végpont (nyilvános)
app.post('/api/login', userController.login);

// Felhasználók lekérdezése (User joggal elérhető)
app.get('/api/users', userController.authenticateToken, userController.getUsers);

// Új felhasználó létrehozása (User joggal elérhető)
app.post('/api/users', userController.authenticateToken, userController.createUser);
app.post('/api/createuser', userController.authenticateToken, userController.createUser);

// Felhasználó logikai törlése (deleted flag = true) (User joggal elérhető)
app.post('/api/deleteuser/:id', userController.authenticateToken, userController.deleteUser);
app.delete('/api/deleteuser/:id', userController.authenticateToken, userController.deleteUser);
app.delete('/api/users/:id', userController.authenticateToken, userController.deleteUser);

// Feladatok lekérdezése (User joggal elérhető)
app.get('/api/tasks', userController.authenticateToken, taskController.getTasks);

// Feladatok és hozzájuk rendelt felhasználók lekérdezése (Admin joggal elérhető)
app.get('/api/taskusers', userController.authenticateAdmin, taskController.getTaskUsers);

// Szerver indítása és adatbázis kapcsolat
app.listen(PORT, async () => {
  await connectDB();
  await checkEmptyUsersTable();
  await checkEmptyTasksTable();
  console.log(`Szerver elindult a http://localhost:${PORT} címen`);
});
