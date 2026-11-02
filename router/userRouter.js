import { Router } from 'express';
import * as userController from '../controller/userController.js';
import { validateCreateUser } from '../middleware/userValidator.js';

const router = Router();

// Bejelentkezés végpont (nyilvános)
router.post('/login', userController.login);

// Felhasználók lekérdezése (User joggal elérhető)
router.get('/users', userController.authenticateToken, userController.getUsers);

// Új felhasználó létrehozása (User joggal elérhető, validált adatokkal)
router.post('/users', userController.authenticateToken, validateCreateUser, userController.createUser);
router.post('/createuser', userController.authenticateToken, validateCreateUser, userController.createUser);

// Felhasználó logikai törlése (deleted flag = true) (User joggal elérhető)
router.post('/deleteuser/:id', userController.authenticateToken, userController.deleteUser);
router.post('/deleteuser', userController.authenticateToken, userController.deleteUser);
router.delete('/deleteuser/:id', userController.authenticateToken, userController.deleteUser);
router.delete('/deleteuser', userController.authenticateToken, userController.deleteUser);
router.delete('/users/:id', userController.authenticateToken, userController.deleteUser);
router.delete('/users', userController.authenticateToken, userController.deleteUser);

export default router;
