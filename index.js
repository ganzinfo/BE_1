import express from 'express';
import path from 'path';
import { connectDB } from './db.js';

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

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Szerver elindult a http://localhost:${PORT} címen`);
});
