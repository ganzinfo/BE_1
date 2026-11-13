import { Router } from 'express';
import * as userController from '../controller/userController.js';
import { validateCreateUser } from '../middleware/userValidator.js';

const router = Router();

// Bejelentkezés végpont (nyilvános)
router.post('/login', userController.login);

// Keresés darabszám és 10-es oldalszám végpont (GET /api/users/pages vagy /api/users/count?search=...)
router.get('/users/pages', userController.authenticateToken, userController.getUserPagesCount);
router.get('/users/count', userController.authenticateToken, userController.getUserPagesCount);
router.get('/users/search/count', userController.authenticateToken, userController.getUserPagesCount);

// Keresés és lapozás végpont - csak a teljes nevekkel (GET /api/users/search?search=...&page=... vagy /api/users/page/:page)
router.get('/users/search', userController.authenticateToken, userController.getUsersByPage);
router.get('/users/search/:page', userController.authenticateToken, userController.getUsersByPage);
router.get('/users/page', userController.authenticateToken, userController.getUsersByPage);
router.get('/users/page/:page', userController.authenticateToken, userController.getUsersByPage);

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
