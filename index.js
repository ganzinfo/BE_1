import express from 'express';
import path from 'path';
import { connectDB } from './db.js';
import { checkEmptyTable as checkEmptyUsersTable } from './z_dummy_data/users_dummy.js';
import { checkEmptyTable as checkEmptyTasksTable } from './z_dummy_data/tasks_dummy.js';
import * as userController from './controller/userController.js';
import * as taskController from './controller/taskController.js';

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

// Alapértelmezett teszt útvonal
app.get('/', (req, res) => {
  res.json({ message: 'Express szerver sikeresen fut!' });
});

// --- API Útvonalak (A kérések kezelését a Controller réteg végzi) ---

// Bejelentkezés végpont
app.post('/api/login', userController.login);

// Felhasználók lekérdezése
app.get('/api/users', userController.getUsers);

// Új felhasználó létrehozása
app.post('/api/users', userController.createUser);
app.post('/api/createuser', userController.createUser);

// Felhasználó logikai törlése (deleted flag = true)
app.post('/api/deleteuser/:id', userController.deleteUser);

// Feladatok lekérdezése
app.get('/api/tasks', taskController.getTasks);

// Feladatok és hozzájuk rendelt felhasználók lekérdezése (Védett végpont, autentikáció a Service rétegben)
app.get('/api/taskusers', taskController.getTaskUsers);

// Szerver indítása és adatbázis kapcsolat
app.listen(PORT, async () => {
  await connectDB();
  await checkEmptyUsersTable();
  await checkEmptyTasksTable();
  console.log(`Szerver elindult a http://localhost:${PORT} címen`);
});
