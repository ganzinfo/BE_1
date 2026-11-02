import { Router } from 'express';
import * as userController from '../controller/userController.js';

const router = Router();

// Bejelentkezés végpont (nyilvános)
router.post('/login', userController.login);

// Felhasználók lekérdezése (User joggal elérhető)
router.get('/users', userController.authenticateToken, userController.getUsers);

// Új felhasználó létrehozása (User joggal elérhető)
router.post('/users', userController.authenticateToken, userController.createUser);
router.post('/createuser', userController.authenticateToken, userController.createUser);

// Felhasználó logikai törlése (deleted flag = true) (User joggal elérhető)
router.post('/deleteuser/:id', userController.authenticateToken, userController.deleteUser);
router.post('/deleteuser', userController.authenticateToken, userController.deleteUser);
router.delete('/deleteuser/:id', userController.authenticateToken, userController.deleteUser);
router.delete('/deleteuser', userController.authenticateToken, userController.deleteUser);
router.delete('/users/:id', userController.authenticateToken, userController.deleteUser);
router.delete('/users', userController.authenticateToken, userController.deleteUser);

export default router;
