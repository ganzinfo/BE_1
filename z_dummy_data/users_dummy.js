import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export const dummyUsers = [
  {
    "firstName": "Bence",
    "lastName": "Kovács",
    "email": "bence.kovacs@example.com",
    "birthYear": 1990,
    "password": "password123",
    "isAdmin": true
  },
  {
    "firstName": "Anna",
    "lastName": "Nagy",
    "email": "anna.nagy@example.com",
    "birthYear": 1995,
    "password": "password123",
    "isAdmin": true
  },
  {
    "firstName": "Dániel",
    "lastName": "Tóth",
    "email": "daniel.toth@example.com",
    "birthYear": 1988,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Eszter",
    "lastName": "Szabó",
    "email": "eszter.szabo@example.com",
    "birthYear": 2001,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Péter",
    "lastName": "Horváth",
    "email": "peter.horvath@example.com",
    "birthYear": 1993,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Zsuzsanna",
    "lastName": "Varga",
    "email": "zsuzsa.varga@example.com",
    "birthYear": 1985,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Tamás",
    "lastName": "Kiss",
    "email": "tamas.kiss@example.com",
    "birthYear": 1992,
    "password": "password123",
    "isAdmin": true
  },
  {
    "firstName": "Katalin",
    "lastName": "Molnár",
    "email": "kata.molnar@example.com",
    "birthYear": 1997,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Gábor",
    "lastName": "Németh",
    "email": "gabor.nemeth@example.com",
    "birthYear": 1982,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Dóra",
    "lastName": "Farkas",
    "email": "dora.farkas@example.com",
    "birthYear": 2003,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Máté",
    "lastName": "Balogh",
    "email": "mate.balogh@example.com",
    "birthYear": 1994,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Viktória",
    "lastName": "Papp",
    "email": "viki.papp@example.com",
    "birthYear": 1999,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Zoltán",
    "lastName": "Takács",
    "email": "zoltan.takacs@example.com",
    "birthYear": 1978,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Judit",
    "lastName": "Juhász",
    "email": "judit.juhasz@example.com",
    "birthYear": 1989,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Attila",
    "lastName": "Mészáros",
    "email": "attila.meszaros@example.com",
    "birthYear": 1991,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Laura",
    "lastName": "Simon",
    "email": "laura.simon@example.com",
    "birthYear": 2002,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Ádám",
    "lastName": "Rácz",
    "email": "adam.racz@example.com",
    "birthYear": 1996,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Boglára",
    "lastName": "Fekete",
    "email": "bogi.fekete@example.com",
    "birthYear": 1998,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Norbert",
    "lastName": "Szilágyi",
    "email": "norbert.szilagyi@example.com",
    "birthYear": 1986,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Petra",
    "lastName": "Pál",
    "email": "petra.pal@example.com",
    "birthYear": 2000,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "László",
    "lastName": "Fehér",
    "email": "laszlo.feher@example.com",
    "birthYear": 1970,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Éva",
    "lastName": "Fehér",
    "email": "eva.feher@example.com",
    "birthYear": 1973,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Csaba",
    "lastName": "Fehér",
    "email": "csaba.feher@example.com",
    "birthYear": 1976,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Anita",
    "lastName": "Fehér",
    "email": "anita.feher@example.com",
    "birthYear": 1979,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Krisztián",
    "lastName": "Fehér",
    "email": "krisztian.feher@example.com",
    "birthYear": 1982,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Beatrix",
    "lastName": "Fehér",
    "email": "beatrix.feher@example.com",
    "birthYear": 1985,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Roland",
    "lastName": "Fehér",
    "email": "roland.feher@example.com",
    "birthYear": 1988,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Dorina",
    "lastName": "Fehér",
    "email": "dorina.feher@example.com",
    "birthYear": 1991,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Szabolcs",
    "lastName": "Fehér",
    "email": "szabolcs.feher@example.com",
    "birthYear": 1994,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Fanni",
    "lastName": "Fehér",
    "email": "fanni.feher@example.com",
    "birthYear": 1997,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Balázs",
    "lastName": "Fehér",
    "email": "balazs.feher@example.com",
    "birthYear": 2000,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Vivien",
    "lastName": "Fehér",
    "email": "vivien.feher@example.com",
    "birthYear": 2003,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Márk",
    "lastName": "Fehér",
    "email": "mark.feher@example.com",
    "birthYear": 1971,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Bianka",
    "lastName": "Fehér",
    "email": "bianka.feher@example.com",
    "birthYear": 1974,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Richárd",
    "lastName": "Fehér",
    "email": "richard.feher@example.com",
    "birthYear": 1977,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Réka",
    "lastName": "Fehér",
    "email": "reka.feher@example.com",
    "birthYear": 1980,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Dávid",
    "lastName": "Fehér",
    "email": "david.feher@example.com",
    "birthYear": 1983,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Kinga",
    "lastName": "Fehér",
    "email": "kinga.feher@example.com",
    "birthYear": 1986,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "András",
    "lastName": "Fehér",
    "email": "andras.feher@example.com",
    "birthYear": 1989,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Noémi",
    "lastName": "Fehér",
    "email": "noemi.feher@example.com",
    "birthYear": 1992,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Kristóf",
    "lastName": "Fehér",
    "email": "kristof.feher@example.com",
    "birthYear": 1995,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Lili",
    "lastName": "Fehér",
    "email": "lili.feher@example.com",
    "birthYear": 1998,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Barnabás",
    "lastName": "Fehér",
    "email": "barnabas.feher@example.com",
    "birthYear": 2001,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Hanna",
    "lastName": "Fehér",
    "email": "hanna.feher@example.com",
    "birthYear": 2004,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Marcell",
    "lastName": "Fehér",
    "email": "marcell.feher@example.com",
    "birthYear": 1972,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Bogi",
    "lastName": "Fehér",
    "email": "bogi.feher@example.com",
    "birthYear": 1975,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Olivér",
    "lastName": "Fehér",
    "email": "oliver.feher@example.com",
    "birthYear": 1978,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Luca",
    "lastName": "Fehér",
    "email": "luca.feher@example.com",
    "birthYear": 1981,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Milán",
    "lastName": "Fehér",
    "email": "milan.feher@example.com",
    "birthYear": 1984,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Jázmin",
    "lastName": "Fehér",
    "email": "jazmin.feher@example.com",
    "birthYear": 1987,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Botond",
    "lastName": "Fehér",
    "email": "botond.feher@example.com",
    "birthYear": 1990,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Gréta",
    "lastName": "Fehér",
    "email": "greta.feher@example.com",
    "birthYear": 1993,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Bálint",
    "lastName": "Fehér",
    "email": "balint.feher@example.com",
    "birthYear": 1996,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Zsófia",
    "lastName": "Fehér",
    "email": "zsofia.feher@example.com",
    "birthYear": 1999,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Levente",
    "lastName": "Fehér",
    "email": "levente.feher@example.com",
    "birthYear": 2002,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Nóra",
    "lastName": "Fehér",
    "email": "nora.feher@example.com",
    "birthYear": 1970,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Dominik",
    "lastName": "Fehér",
    "email": "dominik.feher@example.com",
    "birthYear": 1973,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Emma",
    "lastName": "Fehér",
    "email": "emma.feher@example.com",
    "birthYear": 1976,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Benedek",
    "lastName": "Fehér",
    "email": "benedek.feher@example.com",
    "birthYear": 1979,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Zoé",
    "lastName": "Fehér",
    "email": "zoe.feher@example.com",
    "birthYear": 1982,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "László",
    "lastName": "Kocsis",
    "email": "laszlo.kocsis@example.com",
    "birthYear": 1985,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Éva",
    "lastName": "Kocsis",
    "email": "eva.kocsis@example.com",
    "birthYear": 1988,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Csaba",
    "lastName": "Kocsis",
    "email": "csaba.kocsis@example.com",
    "birthYear": 1991,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Anita",
    "lastName": "Kocsis",
    "email": "anita.kocsis@example.com",
    "birthYear": 1994,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Krisztián",
    "lastName": "Kocsis",
    "email": "krisztian.kocsis@example.com",
    "birthYear": 1997,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Beatrix",
    "lastName": "Kocsis",
    "email": "beatrix.kocsis@example.com",
    "birthYear": 2000,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Roland",
    "lastName": "Kocsis",
    "email": "roland.kocsis@example.com",
    "birthYear": 2003,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Dorina",
    "lastName": "Kocsis",
    "email": "dorina.kocsis@example.com",
    "birthYear": 1971,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Szabolcs",
    "lastName": "Kocsis",
    "email": "szabolcs.kocsis@example.com",
    "birthYear": 1974,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Fanni",
    "lastName": "Kocsis",
    "email": "fanni.kocsis@example.com",
    "birthYear": 1977,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Balázs",
    "lastName": "Kocsis",
    "email": "balazs.kocsis@example.com",
    "birthYear": 1980,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Vivien",
    "lastName": "Kocsis",
    "email": "vivien.kocsis@example.com",
    "birthYear": 1983,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Márk",
    "lastName": "Kocsis",
    "email": "mark.kocsis@example.com",
    "birthYear": 1986,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Bianka",
    "lastName": "Kocsis",
    "email": "bianka.kocsis@example.com",
    "birthYear": 1989,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Richárd",
    "lastName": "Kocsis",
    "email": "richard.kocsis@example.com",
    "birthYear": 1992,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Réka",
    "lastName": "Kocsis",
    "email": "reka.kocsis@example.com",
    "birthYear": 1995,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Dávid",
    "lastName": "Kocsis",
    "email": "david.kocsis@example.com",
    "birthYear": 1998,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Kinga",
    "lastName": "Kocsis",
    "email": "kinga.kocsis@example.com",
    "birthYear": 2001,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "András",
    "lastName": "Kocsis",
    "email": "andras.kocsis@example.com",
    "birthYear": 2004,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Noémi",
    "lastName": "Kocsis",
    "email": "noemi.kocsis@example.com",
    "birthYear": 1972,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Kristóf",
    "lastName": "Kocsis",
    "email": "kristof.kocsis@example.com",
    "birthYear": 1975,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Lili",
    "lastName": "Kocsis",
    "email": "lili.kocsis@example.com",
    "birthYear": 1978,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Barnabás",
    "lastName": "Kocsis",
    "email": "barnabas.kocsis@example.com",
    "birthYear": 1981,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Hanna",
    "lastName": "Kocsis",
    "email": "hanna.kocsis@example.com",
    "birthYear": 1984,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Marcell",
    "lastName": "Kocsis",
    "email": "marcell.kocsis@example.com",
    "birthYear": 1987,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Bogi",
    "lastName": "Kocsis",
    "email": "bogi.kocsis@example.com",
    "birthYear": 1990,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Olivér",
    "lastName": "Kocsis",
    "email": "oliver.kocsis@example.com",
    "birthYear": 1993,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Luca",
    "lastName": "Kocsis",
    "email": "luca.kocsis@example.com",
    "birthYear": 1996,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Milán",
    "lastName": "Kocsis",
    "email": "milan.kocsis@example.com",
    "birthYear": 1999,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Jázmin",
    "lastName": "Kocsis",
    "email": "jazmin.kocsis@example.com",
    "birthYear": 2002,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Botond",
    "lastName": "Kocsis",
    "email": "botond.kocsis@example.com",
    "birthYear": 1970,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Gréta",
    "lastName": "Kocsis",
    "email": "greta.kocsis@example.com",
    "birthYear": 1973,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Bálint",
    "lastName": "Kocsis",
    "email": "balint.kocsis@example.com",
    "birthYear": 1976,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Zsófia",
    "lastName": "Kocsis",
    "email": "zsofia.kocsis@example.com",
    "birthYear": 1979,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Levente",
    "lastName": "Kocsis",
    "email": "levente.kocsis@example.com",
    "birthYear": 1982,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Nóra",
    "lastName": "Kocsis",
    "email": "nora.kocsis@example.com",
    "birthYear": 1985,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Dominik",
    "lastName": "Kocsis",
    "email": "dominik.kocsis@example.com",
    "birthYear": 1988,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Emma",
    "lastName": "Kocsis",
    "email": "emma.kocsis@example.com",
    "birthYear": 1991,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Benedek",
    "lastName": "Kocsis",
    "email": "benedek.kocsis@example.com",
    "birthYear": 1994,
    "password": "password123",
    "isAdmin": false
  },
  {
    "firstName": "Zoé",
    "lastName": "Kocsis",
    "email": "zoe.kocsis@example.com",
    "birthYear": 1997,
    "password": "password123",
    "isAdmin": false
  }
];

export async function checkEmptyTable() {
  const count = await User.count();
  if (count === 0) {
    await User.bulkCreate(dummyUsers);
    console.log('🌱 100 dummy felhasználó sikeresen hozzáadva az adatbázishoz.');
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
  }
}

export async function resetTable() {
  await User.destroy({ where: {} });
  await User.bulkCreate(dummyUsers);
  console.log('🌱 Users tábla ürítve és 100 dummy felhasználó sikeresen betöltve.');
}
