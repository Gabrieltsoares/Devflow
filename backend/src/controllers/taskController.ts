import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { createTaskSchema, toggleTaskSchema } from '../validators/schemas.js';


export async function createTask(req: Request, res: Response) {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0].message});
    }
    const userId = req.userId as string;
    const { title, projectId } = result.data;

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId as string } });
        if (!project || project.userId !== userId) {
            return res.status(403).json({ error: "Projeto não encontrado ou acesso restrito" });
        }

        const task = await prisma.task.create({
            data: {
                title,
                projectId
            }
        });
        return res.status(201).json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar tarefa" });
    }
}

export async function getTasksByProject(req: Request, res: Response) {
    const userId = req.userId as string;
    const { projectId } = req.params;

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId as string } });
        if (!project || project.userId !== userId) {
            return res.status(403).json({ error: "Projeto não encontrado ou acesso restrito" });
        }

        const tasks = await prisma.task.findMany({
            where: { projectId: projectId as string },
            orderBy: { createdAt: "asc" }
        });
        return res.json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar tarefas" });
    }
}

export async function toggleTaskComplete(req: Request, res: Response) {
    const result = toggleTaskSchema.safeParse(req.body);

     if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0].message});
    }
    const userId = req.userId as string;
    const { id } = req.params;
    const { completed } = result.data;

    try {
        const task = await prisma.task.findUnique({
            where: { id: id as string }
        });

        if (!task) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }

        const project = await prisma.project.findUnique({
            where: { id: task.projectId }
        });

        if (!project || project.userId !== userId) {
            return res.status(403).json({ error: "Acesso restrito" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: id as string },
            data: { completed }
        });

        return res.json(updatedTask);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar tarefa" });
    }
}

export async function deleteTask(req: Request, res: Response) {
    const userId = req.userId as string;
    const { id } = req.params;

    try {
        const task = await prisma.task.findUnique({
            where: { id: id as string }
        });

        if (!task) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }

        const project = await prisma.project.findUnique({
            where: { id: task.projectId }
        });

        if (!project || project.userId !== userId) {
            return res.status(403).json({ error: "Acesso restrito" });
        }

        await prisma.task.delete({ where: { id: id as string } });
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao deletar tarefa" });
    }
}
