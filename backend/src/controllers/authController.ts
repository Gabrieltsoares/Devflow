import { type Request, type Response } from "express";
import { prisma } from "../config/prisma.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { registerSchema,loginSchema } from "../validators/schemas.js";

export async function register(req: Request, res: Response) {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0].message});
    }
    const { name, email, password } = result.data;
    try {
        const userExists = await prisma.user.findUnique({
            where: { email }
        });
        
        if (userExists) {
            return res.status(400).json({ error: "Usuário já existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Remove a senha do objeto antes de retornar para o cliente
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
}

export async function login(req: Request, res: Response) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0].message});
    }
    const { email, password } = result.data;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: "Credenciais inválidas" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(400).json({ error: "Credenciais inválidas" });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return res.json({ token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao fazer login" });
    }
}

export async function getMe(req: Request, res: Response) {
    const userId = req.userId as string
    try {
        const user = await prisma.user.findUnique({
            where: {id: userId}   
            });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });   
            }
            const { password, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
        }catch (error) {
            return res.status(500).json({error: "Erro ao buscar usuário" });
        }
    }