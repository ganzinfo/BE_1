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
    // Eltávolítjuk a Sequelize hibás SQLite backup tábláját, ha létezik
    await sequelize.query('DROP TABLE IF EXISTS `Users_backup`;');
    await sequelize.sync();

    // SQLite-ban biztonságosan hozzáadjuk a deleted oszlopot, ha még nem létezik
    const [columns] = await sequelize.query("PRAGMA table_info('Users');");
    const hasDeleted = columns.some((col) => col.name === 'deleted');
    if (!hasDeleted) {
      await sequelize.query('ALTER TABLE `Users` ADD COLUMN `deleted` INTEGER NOT NULL DEFAULT 0;');
      console.log('✅ "deleted" oszlop sikeresen hozzáadva a Users táblához.');
    }

    console.log('✅ SQLite adatbázis kapcsolat sikeresen felépült.');
  } catch (error) {
    console.error('❌ Nem sikerült csatlakozni az SQLite adatbázishoz:', error);
  }
}
