import { Router } from 'express';
import * as taskController from '../controller/taskController.js';
import * as userController from '../controller/userController.js';

const router = Router();

// Feladatok lekérdezése (User joggal elérhető)
router.get('/tasks', userController.authenticateToken, taskController.getTasks);

// Feladatok és hozzájuk rendelt felhasználók lekérdezése (Admin joggal elérhető)
router.get('/taskusers', userController.authenticateAdmin, taskController.getTaskUsers);

export default router;
