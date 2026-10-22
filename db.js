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

    // SQLite-ban biztonságosan hozzáadjuk a hiányzó oszlopokat, ha még nem léteznek
    const [columns] = await sequelize.query("PRAGMA table_info('Users');");
    const columnNames = columns.map((col) => col.name);

    if (!columnNames.includes('deleted')) {
      await sequelize.query('ALTER TABLE `Users` ADD COLUMN `deleted` INTEGER NOT NULL DEFAULT 0;');
      console.log('✅ "deleted" oszlop sikeresen hozzáadva a Users táblához.');
    }

    if (!columnNames.includes('isAdmin')) {
      await sequelize.query('ALTER TABLE `Users` ADD COLUMN `isAdmin` INTEGER NOT NULL DEFAULT 0;');
      console.log('✅ "isAdmin" oszlop sikeresen hozzáadva a Users táblához.');
    }

    if (!columnNames.includes('token')) {
      await sequelize.query('ALTER TABLE `Users` ADD COLUMN `token` TEXT;');
      console.log('✅ "token" oszlop sikeresen hozzáadva a Users táblához.');
    }

    if (!columnNames.includes('tokenExpiresAt')) {
      await sequelize.query('ALTER TABLE `Users` ADD COLUMN `tokenExpiresAt` DATETIME;');
      console.log('✅ "tokenExpiresAt" oszlop sikeresen hozzáadva a Users táblához.');
    }

    console.log('✅ SQLite adatbázis kapcsolat sikeresen felépült.');
  } catch (error) {
    console.error('❌ Nem sikerült csatlakozni az SQLite adatbázishoz:', error);
  }
}
