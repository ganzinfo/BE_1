import * as taskRepository from '../repository/taskRepository.js';
import * as userService from './userService.js';

/**
 * Összes feladat lekérdezése (üzleti logika).
 */
export async function getAllTasks() {
  return await taskRepository.findAll();
}

/**
 * Egy adott feladat lekérdezése azonosító alapján.
 */
export async function getTaskById(id) {
  return await taskRepository.findById(id);
}

/**
 * Feladatok és a hozzájuk rendelt felhasználók lekérdezése.
 * Üzleti szabály: Csak érvényes tokennel rendelkező felhasználók számára elérhető.
 */
export async function getTasksWithUsers(token) {
  const user = await userService.verifyToken(token);
  if (!user) {
    const error = new Error('Hozzáférés megtagadva! Érvénytelen vagy lejárt token.');
    error.statusCode = 401;
    throw error;
  }

  return await taskRepository.findAllWithUsers();
}

export default {
  getAllTasks,
  getTaskById,
  getTasksWithUsers,
};
