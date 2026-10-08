import { Sequelize } from 'sequelize';

// SQLite adatbázis kapcsolat inicializálása
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Az adatbázis fájl helye
  logging: false,               // Állítsd console.log-ra, ha látni szeretnéd az SQL lekérdezéseket
});

// Kapcsolat ellenőrzése és táblák szinkronizálása
export async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ SQLite adatbázis kapcsolat sikeresen felépült.');
  } catch (error) {
    console.error('❌ Nem sikerült csatlakozni az SQLite adatbázishoz:', error);
  }
}
