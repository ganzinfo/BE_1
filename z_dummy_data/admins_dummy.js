import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin.js';

export const dummyAdmins = [
  {
    username: 'admin1',
    firstName: 'Bence',
    lastName: 'Kovács',
    email: 'admin.bence@example.com',
    password: 'password123',
    isAdmin: true,
  },
  {
    username: 'admin2',
    firstName: 'Anna',
    lastName: 'Nagy',
    email: 'admin.anna@example.com',
    password: 'password123',
    isAdmin: true,
  },
  {
    username: 'admin3',
    firstName: 'Tamás',
    lastName: 'Kiss',
    email: 'admin.tamas@example.com',
    password: 'password123',
    isAdmin: true,
  },
];

export async function checkEmptyTable() {
  const count = await Admin.count();
  if (count === 0) {
    await Admin.bulkCreate(dummyAdmins);
    console.log('👑 3 dummy admin sikeresen hozzáadva az adatbázishoz.');
  } else {
    // Meglévő titkosítatlan (plaintext) jelszavak migrálása bcrypt hash-re
    const admins = await Admin.findAll();
    let migratedCount = 0;
    for (const admin of admins) {
      if (admin.password && !admin.password.startsWith('$2')) {
        admin.password = await bcrypt.hash(admin.password, 10);
        await admin.save();
        migratedCount++;
      }
    }
    if (migratedCount > 0) {
      console.log(`🔒 ${migratedCount} korábbi admin jelszava sikeresen titkosítva lett (bcrypt).`);
    }
  }
}
