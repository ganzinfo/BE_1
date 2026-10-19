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

