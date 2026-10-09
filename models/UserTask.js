import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { User } from './User.js';
import { Task } from './Task.js';

export const UserTask = sequelize.define('UserTask', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  TaskId: {
    type: DataTypes.INTEGER,
    references: {
      model: Task,
      key: 'id',
    },
  },
});

// N:M kapcsolatok beállítása a User és Task modellek között
User.belongsToMany(Task, { through: UserTask, foreignKey: 'UserId' });
Task.belongsToMany(User, { through: UserTask, foreignKey: 'TaskId' });

// Közvetlen kapcsolatok a kapcsolótábla (UserTask) felé
UserTask.belongsTo(User, { foreignKey: 'UserId' });
UserTask.belongsTo(Task, { foreignKey: 'TaskId' });
User.hasMany(UserTask, { foreignKey: 'UserId' });
Task.hasMany(UserTask, { foreignKey: 'TaskId' });

