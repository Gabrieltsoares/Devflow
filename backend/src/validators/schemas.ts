
import {z} from 'zod';

export const registerSchema = z.object ({
    name: z.string().min(1,"Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6,"A senha deve conter no mínimo de 6 caracteres"),
})

export const loginSchema = z.object ({
    email: z.string().email("Email inválido"),
    password: z.string().min(6,"A senha deve conter no mínimo de 6 caracteres"),
})

export const createProjectSchema = z.object ({
    title: z.string().min(1,"Título é obrigatório"),
    description :z.string().optional(),
})

export const createTaskSchema = z.object ({
    title: z.string().min(1,"Título é obrigatório"),
    projectId: z.string().min(1,"ID do projeto é obrigatório"),
})

export const toggleTaskSchema = z.object ({
    completed: z.boolean(),
})  

