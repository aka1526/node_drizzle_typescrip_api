import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { db } from '../db/db';
import { revokedTokensTB } from './../db/schema/revokedTokens';
import { UserTable } from '../db/schema/users';
import { eq, inArray } from 'drizzle-orm';
import { getOnlineUsers, updateUserLastActive} from '../services/onlineStatus';

// Add this declaration
declare global {
    namespace Express {
      interface Request {
        user: any; // Or use a more specific type based on your JWT payload
      }
    }
  }

const checkRevokedToken = async (token: string) => {
  const revoked = await db.select()
    .from(revokedTokensTB as any)
    .where(eq(revokedTokensTB.token, token));
  return revoked.length > 0;
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Check if token is revoked
    if (await checkRevokedToken(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    if (req.user) {
       
      await updateUserLastActive(req.user.uuid);
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const getOnlineUsersTotal = async (req: Request, res: Response) => {
  try {
    const onlineUsers = await getOnlineUsers();
    
    res.json({onlineUsers: onlineUsers??0});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch online users' });
  }
}; 