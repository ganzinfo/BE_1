import { User } from '../models/User.js';
import { Task } from '../models/Task.js';
import { UserTask } from '../models/UserTask.js';

export const dummyTasks = [
  { title: 'Adatbázis séma megtervezése', description: 'Az adatbázis táblák és kapcsolatok specifikálása', status: 'completed', priority: 'high' },
  { title: 'Express backend konfiguráció', description: 'Alapvető middleware-ek és útvonalak beállítása', status: 'completed', priority: 'high' },
  { title: 'User modell létrehozása', description: 'Sequelize User entitás és validációk elkészítése', status: 'completed', priority: 'medium' },
  { title: 'Task modell és kapcsolótábla', description: 'N:M kapcsolat kialakítása a feladatok és felhasználók között', status: 'in_progress', priority: 'high' },
  { title: 'Autentikáció implementálása', description: 'JWT alapú hitelesítés bevezetése', status: 'pending', priority: 'high' },
  { title: 'Jelszó hash-elés bcrypttel', description: 'Biztonságos jelszókezelés a regisztrációnál', status: 'pending', priority: 'high' },
  { title: 'API dokumentáció készítése', description: 'Swagger / OpenAPI dokumentáció generálása', status: 'pending', priority: 'medium' },
  { title: 'Frontend felület tervezése', description: 'Figma mock-upok és wireframe-ek készítése', status: 'in_progress', priority: 'medium' },
  { title: 'Felhasználói profil oldal', description: 'Profil adatok megjelenítése és szerkesztése', status: 'pending', priority: 'low' },
  { title: 'Feladatkezelő tábla (Kanban)', description: 'Drag-and-drop funkció a teendők mozgatására', status: 'pending', priority: 'medium' },
  { title: 'Értesítési rendszer', description: 'E-mail és webes értesítések feladat hozzárendeléskor', status: 'pending', priority: 'medium' },
  { title: 'Egységtesztek írása backendhez', description: 'Jest és Supertest tesztek a végpontokhoz', status: 'pending', priority: 'high' },
  { title: 'Frontend tesztelés Cypress-szel', description: 'E2E tesztek készítése a kritikus útvonalakhoz', status: 'pending', priority: 'low' },
  { title: 'Docker környezet kialakítása', description: 'Dockerfile és docker-compose.yml létrehozása', status: 'pending', priority: 'medium' },
  { title: 'CI/CD pipeline beállítása', description: 'GitHub Actions automatikus tesztelés és build', status: 'pending', priority: 'medium' },
  { title: 'Naplózás (Logging) fejlesztése', description: 'Winston vagy Morgan logger integrálása', status: 'completed', priority: 'low' },
  { title: 'Biztonsági audit elvégzése', description: 'CORS, Helmet és Rate limiting beállítása', status: 'pending', priority: 'high' },
  { title: 'Teljesítmény optimalizálás', description: 'Lekérdezések gyorsítása és indexelés', status: 'pending', priority: 'medium' },
  { title: 'Sötét mód támogatás', description: 'Dark mode téma implementálása a frontend oldalon', status: 'in_progress', priority: 'low' },
  { title: 'Éles szerverre telepítés', description: 'Produkciós környezet beállítása és domain konfiguráció', status: 'pending', priority: 'high' }
];

export const dummyUserTasks = [
  { UserId: 1, TaskId: 1 },
  { UserId: 1, TaskId: 2 },
  { UserId: 2, TaskId: 2 },
  { UserId: 3, TaskId: 3 },
  { UserId: 1, TaskId: 4 },
  { UserId: 3, TaskId: 4 },
  { UserId: 4, TaskId: 4 },
  { UserId: 5, TaskId: 5 },
  { UserId: 6, TaskId: 5 },
  { UserId: 6, TaskId: 6 },
  { UserId: 7, TaskId: 7 },
  { UserId: 8, TaskId: 7 },
  { UserId: 9, TaskId: 8 },
  { UserId: 10, TaskId: 8 },
  { UserId: 11, TaskId: 8 },
  { UserId: 12, TaskId: 9 },
  { UserId: 13, TaskId: 10 },
  { UserId: 14, TaskId: 10 },
  { UserId: 15, TaskId: 11 },
  { UserId: 16, TaskId: 12 },
  { UserId: 17, TaskId: 12 },
  { UserId: 18, TaskId: 13 },
  { UserId: 19, TaskId: 14 },
  { UserId: 20, TaskId: 14 },
  { UserId: 1, TaskId: 15 },
  { UserId: 5, TaskId: 15 },
  { UserId: 10, TaskId: 15 },
  { UserId: 2, TaskId: 16 },
  { UserId: 7, TaskId: 17 },
  { UserId: 14, TaskId: 17 },
  { UserId: 8, TaskId: 18 },
  { UserId: 11, TaskId: 19 },
  { UserId: 16, TaskId: 19 },
  { UserId: 3, TaskId: 20 },
  { UserId: 12, TaskId: 20 },
  { UserId: 18, TaskId: 20 }
];

export async function checkEmptyTable() {
  const taskCount = await Task.count();
  if (taskCount === 0) {
    await Task.bulkCreate(dummyTasks);
    console.log('🌱 20 dummy feladat sikeresen hozzáadva az adatbázishoz.');
  }

  const userTaskCount = await UserTask.count();
  if (userTaskCount === 0) {
    const users = await User.findAll({ attributes: ['id'], order: [['id', 'ASC']] });
    const tasks = await Task.findAll({ attributes: ['id'], order: [['id', 'ASC']] });

    if (users.length > 0 && tasks.length > 0) {
      const mappedUserTasks = dummyUserTasks.map(item => {
        const userIndex = (item.UserId - 1) % users.length;
        const taskIndex = (item.TaskId - 1) % tasks.length;
        return {
          UserId: users[userIndex].id,
          TaskId: tasks[taskIndex].id,
        };
      });

      await UserTask.bulkCreate(mappedUserTasks);
      console.log('🌱 Felhasználó-feladat hozzárendelések sikeresen hozzáadva az adatbázishoz.');
    }
  }
}

