import express from 'express';
import path from 'path';
import { connectDB } from './db.js';
import { User } from './models/User.js';
import { Task } from './models/Task.js';
import { UserTask } from './models/UserTask.js';
import { checkEmptyTable as checkEmptyUsersTable } from './z_dummy_data/users_dummy.js';
import { checkEmptyTable as checkEmptyTasksTable } from './z_dummy_data/tasks_dummy.js';

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

// Felhasználók lekérdezése
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült lekérni a felhasználókat.' });
  }
});

// Feladatok lekérdezése
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült lekérni a feladatokat.' });
  }
});

// Kapcsolótábla lekérdezése: Taskonként egy tömbben a hozzájuk rendelt felhasználók
app.get('/api/usertasks', async (req, res) => {
  try {
    const tasksWithUsers = await Task.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
          through: {
            attributes: [], // Ne tartalmazza a UserTasks kapcsolótábla mezőit
          },
        },
      ],
    });
    res.json(tasksWithUsers);
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült lekérni a feladatokhoz rendelt felhasználókat.' });
  }
});

app.listen(PORT, async () => {
  await connectDB();
  await checkEmptyUsersTable();
  await checkEmptyTasksTable();
  console.log(`Szerver elindult a http://localhost:${PORT} címen`);
});

