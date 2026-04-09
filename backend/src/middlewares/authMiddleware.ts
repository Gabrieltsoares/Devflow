import { type Request, type Response, type NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

