import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'password123',
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tokenExpiresAt: {
    type: DataTypes.STRING,
    allowNull: true,
    set(val) {
      if (val instanceof Date) {
        const pad = (n) => String(n).padStart(2, '0');
        const str = `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())} ${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(val.getSeconds())}`;
        this.setDataValue('tokenExpiresAt', str);
      } else {
        this.setDataValue('tokenExpiresAt', val);
      }
    },
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password && !user.password.startsWith('$2')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeBulkCreate: async (users) => {
      for (const user of users) {
        if (user.password && !user.password.startsWith('$2')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password && !user.password.startsWith('$2')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

