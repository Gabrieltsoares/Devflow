import { Router } from "express";
import { createTask, getTasksByProject, toggleTaskComplete, deleteTask } from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Todas as rotas de tarefas exigem autenticação
router.use(authMiddleware);

router.post("/", createTask);
router.get("/:projectId", getTasksByProject);
router.patch("/:id", toggleTaskComplete);
router.delete("/:id", deleteTask);

export default router;