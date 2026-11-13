import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../db.js';

export const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
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
    defaultValue: true,
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
    beforeCreate: async (admin) => {
      if (admin.password && !admin.password.startsWith('$2')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    },
    beforeBulkCreate: async (admins) => {
      for (const admin of admins) {
        if (admin.password && !admin.password.startsWith('$2')) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password') && admin.password && !admin.password.startsWith('$2')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    },
  },
});
