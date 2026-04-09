import { Request , Response } from 'express';
import { prisma } from "../config/prisma.js";
import { createProjectSchema } from '../validators/schemas.js';



export async function createProject(req: Request, res: Response) {

   const result = createProjectSchema.safeParse(req.body);

   if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message});
   }

   const userId = req.userId as string;

   const {title, description} = result.data;

   try {
      const project = await prisma.project.create({
         data:{
            title,
            description,
            userId
         }
      });

       return res.status(201).json(project);

   } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Erro ao criar projeto"});
   }
}


export async function getProjects(req: Request, res: Response) {
   const userId = req.userId as string;
   try {
          const projects = await prisma.project.findMany({
            where: {
               userId
            },
            orderBy: {
               createdAt: "desc"
            }
          });
          return res.json(projects);
      } catch (error) {
            console.error(error);
            return res.status(500).json({error: "Erro ao buscar projetos"});
      }
}

export async function getProjectById(req: Request, res: Response) {
   const userId = req.userId as string;
   const { id } = req.params;
   if (!id) {
      return res.status(400).json({ error: "ID do projeto inválido ou acesso restrito" });
   }
   try {
      const project = await prisma.project.findUnique({
         where: { id: id as string }
      });
      if (!project || project.userId !== userId) {
         return res.status(403).json({ error: "Projeto não encontrado ou acesso restrito" });
      }
      return res.json(project);

   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar projeto" });
   }
}
export async function updateProject(req: Request, res: Response) {
   const result = createProjectSchema.safeParse(req.body);

   if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message});
   }
   const userId = req.userId as string;
   const { id } = req.params;
   const { title, description } = result.data;

   try {
      const project = await prisma.project.findUnique({ where: { id: id as string } });

      if (!project || project.userId !== userId) {
         return res.status(403).json({ error: "Projeto não encontrado ou acesso restrito" });
      }

      const updated = await prisma.project.update({
         where: { id: id as string },
         data: { title, description }
      });

      return res.json(updated);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar projeto" });
   }
}


export async function deleteProject(req: Request, res: Response) {
   const userId = req.userId as string;
   const { id } = req.params;

   try {
      const project = await prisma.project.findUnique({ where: { id: id as string } });

      if (!project || project.userId !== userId) {
         return res.status(403).json({ error: "Projeto não encontrado ou acesso restrito" });
      }

      await prisma.project.delete({ where: { id: id as string } });
      return res.status(204).send();
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar projeto" });
   }
}