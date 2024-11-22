 
import { eq, inArray } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db/db';
import { UserTable } from '../db/schema/users';
import { validationResult } from "express-validator";
import { generateUUID } from '../lib/util';
import { CustomError } from '../lib/custom-error';
import { getOnlineUsers ,updateUserLastActive } from '../services/onlineStatus';

export const UpdateProfile = async (req: Request, res: Response,next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new CustomError(JSON.stringify(result.array()), 400));
    }
  try {
    
    const UUID = await generateUUID();
    const {email,   firstName, lastName, address, tel } = req.body;

   const note = await db.update(UserTable).set({  email,  firstName, lastName, address, tel }).where(eq(UserTable.uuid, req.params.id));

    res.status(201).json({ data: note  });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};


export const GetProfile = async (req: Request, res: Response,next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new CustomError(JSON.stringify(result.array()), 400));
  }
try {
  
  const UUID = await generateUUID();
  const data = await db
  .select()
  .from(UserTable)
  .where(eq(UserTable.uuid, req.params.id));
 
  res.status(201).json({ data: data  });
} catch (error) {
  res.status(500).json({ error: 'Failed to get Profile' });
}
};

export const getUsersOnlineTotal = async (req: Request, res: Response ,next: NextFunction) => {


  try {
    
    const onlineUsers = await getOnlineUsers();
     res.status(201).send({onlineUsers: onlineUsers }) ;
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch online users' });
  }
};
