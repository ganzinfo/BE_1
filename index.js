import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// JSON kérések törzsének feldolgozása
app.use(express.json());

// Alapértelmezett teszt útvonal
app.get('/', (req, res) => {
  res.json({ message: 'Express szerver sikeresen fut!' });
});

app.listen(PORT, () => {
  console.log(`Szerver elindult a http://localhost:${PORT} címen`);
});
