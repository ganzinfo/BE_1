import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export const dummyUsers = [
  { firstName: 'Bence', lastName: 'Kovács', email: 'bence.kovacs@example.com', birthYear: 1990, password: 'password123', isAdmin: true },
  { firstName: 'Anna', lastName: 'Nagy', email: 'anna.nagy@example.com', birthYear: 1995, password: 'password123', isAdmin: true },
  { firstName: 'Dániel', lastName: 'Tóth', email: 'daniel.toth@example.com', birthYear: 1988, password: 'password123', isAdmin: false },
  { firstName: 'Eszter', lastName: 'Szabó', email: 'eszter.szabo@example.com', birthYear: 2001, password: 'password123', isAdmin: false },
  { firstName: 'Péter', lastName: 'Horváth', email: 'peter.horvath@example.com', birthYear: 1993, password: 'password123', isAdmin: false },
  { firstName: 'Zsuzsanna', lastName: 'Varga', email: 'zsuzsa.varga@example.com', birthYear: 1985, password: 'password123', isAdmin: false },
  { firstName: 'Tamás', lastName: 'Kiss', email: 'tamas.kiss@example.com', birthYear: 1992, password: 'password123', isAdmin: true },
  { firstName: 'Katalin', lastName: 'Molnár', email: 'kata.molnar@example.com', birthYear: 1997, password: 'password123', isAdmin: false },
  { firstName: 'Gábor', lastName: 'Németh', email: 'gabor.nemeth@example.com', birthYear: 1982, password: 'password123', isAdmin: false },
  { firstName: 'Dóra', lastName: 'Farkas', email: 'dora.farkas@example.com', birthYear: 2003, password: 'password123', isAdmin: false },
  { firstName: 'Máté', lastName: 'Balogh', email: 'mate.balogh@example.com', birthYear: 1994, password: 'password123', isAdmin: false },
  { firstName: 'Viktória', lastName: 'Papp', email: 'viki.papp@example.com', birthYear: 1999, password: 'password123', isAdmin: false },
  { firstName: 'Zoltán', lastName: 'Takács', email: 'zoltan.takacs@example.com', birthYear: 1978, password: 'password123', isAdmin: false },
  { firstName: 'Judit', lastName: 'Juhász', email: 'judit.juhasz@example.com', birthYear: 1989, password: 'password123', isAdmin: false },
  { firstName: 'Attila', lastName: 'Mészáros', email: 'attila.meszaros@example.com', birthYear: 1991, password: 'password123', isAdmin: false },
  { firstName: 'Laura', lastName: 'Simon', email: 'laura.simon@example.com', birthYear: 2002, password: 'password123', isAdmin: false },
  { firstName: 'Ádám', lastName: 'Rácz', email: 'adam.racz@example.com', birthYear: 1996, password: 'password123', isAdmin: false },
  { firstName: 'Boglára', lastName: 'Fekete', email: 'bogi.fekete@example.com', birthYear: 1998, password: 'password123', isAdmin: false },
  { firstName: 'Norbert', lastName: 'Szilágyi', email: 'norbert.szilagyi@example.com', birthYear: 1986, password: 'password123', isAdmin: false },
  { firstName: 'Petra', lastName: 'Pál', email: 'petra.pal@example.com', birthYear: 2000, password: 'password123', isAdmin: false }
];

export async function checkEmptyTable() {
  const count = await User.count();
  if (count === 0) {
    await User.bulkCreate(dummyUsers);
    console.log('🌱 20 dummy felhasználó sikeresen hozzáadva az adatbázishoz.');
  } else {
    // Meglévő titkosítatlan (plaintext) jelszavak migrálása bcrypt hash-re
    const users = await User.findAll();
    let migratedCount = 0;
    for (const user of users) {
      if (user.password && !user.password.startsWith('$2')) {
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        migratedCount++;
      }
    }
    if (migratedCount > 0) {
      console.log(`🔒 ${migratedCount} korábbi felhasználó jelszava sikeresen titkosítva lett (bcrypt).`);
    }

    // Ha még egyetlen felhasználó sem admin az adatbázisban, beállítjuk a dummyUsers-ben megjelölt adminokat
    const adminCount = await User.count({ where: { isAdmin: true } });
    if (adminCount === 0) {
      const adminEmails = dummyUsers.filter((u) => u.isAdmin).map((u) => u.email);
      for (const email of adminEmails) {
        await User.update({ isAdmin: true }, { where: { email } });
      }
      console.log(`👑 Admin jogosultságok sikeresen beállítva a kijelölt felhasználókhoz (${adminEmails.length} admin).`);
    }
  }
}

