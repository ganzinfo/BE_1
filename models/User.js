import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  birthYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// 20 db dummy adat betöltése, amennyiben a tábla üres
export async function seedUsers() {
  const count = await User.count();
  if (count === 0) {
    const dummyUsers = [
      { firstName: 'Bence', lastName: 'Kovács', email: 'bence.kovacs@example.com', birthYear: 1990 },
      { firstName: 'Anna', lastName: 'Nagy', email: 'anna.nagy@example.com', birthYear: 1995 },
      { firstName: 'Dániel', lastName: 'Tóth', email: 'daniel.toth@example.com', birthYear: 1988 },
      { firstName: 'Eszter', lastName: 'Szabó', email: 'eszter.szabo@example.com', birthYear: 2001 },
      { firstName: 'Péter', lastName: 'Horváth', email: 'peter.horvath@example.com', birthYear: 1993 },
      { firstName: 'Zsuzsanna', lastName: 'Varga', email: 'zsuzsa.varga@example.com', birthYear: 1985 },
      { firstName: 'Tamás', lastName: 'Kiss', email: 'tamas.kiss@example.com', birthYear: 1992 },
      { firstName: 'Katalin', lastName: 'Molnár', email: 'kata.molnar@example.com', birthYear: 1997 },
      { firstName: 'Gábor', lastName: 'Németh', email: 'gabor.nemeth@example.com', birthYear: 1982 },
      { firstName: 'Dóra', lastName: 'Farkas', email: 'dora.farkas@example.com', birthYear: 2003 },
      { firstName: 'Máté', lastName: 'Balogh', email: 'mate.balogh@example.com', birthYear: 1994 },
      { firstName: 'Viktória', lastName: 'Papp', email: 'viki.papp@example.com', birthYear: 1999 },
      { firstName: 'Zoltán', lastName: 'Takács', email: 'zoltan.takacs@example.com', birthYear: 1978 },
      { firstName: 'Judit', lastName: 'Juhász', email: 'judit.juhasz@example.com', birthYear: 1989 },
      { firstName: 'Attila', lastName: 'Mészáros', email: 'attila.meszaros@example.com', birthYear: 1991 },
      { firstName: 'Laura', lastName: 'Simon', email: 'laura.simon@example.com', birthYear: 2002 },
      { firstName: 'Ádám', lastName: 'Rácz', email: 'adam.racz@example.com', birthYear: 1996 },
      { firstName: 'Boglára', lastName: 'Fekete', email: 'bogi.fekete@example.com', birthYear: 1998 },
      { firstName: 'Norbert', lastName: 'Szilágyi', email: 'norbert.szilagyi@example.com', birthYear: 1986 },
      { firstName: 'Petra', lastName: 'Pál', email: 'petra.pal@example.com', birthYear: 2000 }
    ];

    await User.bulkCreate(dummyUsers);
    console.log('🌱 20 dummy felhasználó sikeresen hozzáadva az adatbázishoz.');
  }
}
