import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium',
    allowNull: false,
  },
});
