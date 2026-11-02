import { Router } from 'express';
import userRouter from './userRouter.js';
import taskRouter from './taskRouter.js';

const apiRouter = Router();

apiRouter.use(userRouter);
apiRouter.use(taskRouter);

export { userRouter, taskRouter };
export default apiRouter;
