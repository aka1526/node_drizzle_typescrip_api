 
import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db/db';
import { NotesTable } from '../db/schema/note';
import { validationResult } from "express-validator";
import { generateUUID } from '../lib/util';
import { CustomError } from '../lib/custom-error';


export const createNote = async (req: Request, res: Response,next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new CustomError(JSON.stringify(result.array()), 400));
    }
  try {
    
    const UUID = await generateUUID();
   const note = await db.insert(NotesTable).values({ 
        uuid: UUID,
        title: req.body.title,
        body: req.body.body,
    });

    res.status(201).json({ data: note  });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const getAllNotes = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const notes = await db.select().from(NotesTable);
      res.status(200).json({ notes });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create note' });
    }
  };

  export const getNote = async (req: Request, res: Response,next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new CustomError(JSON.stringify(result.array()), 400));
    }

    try {
        const note = await db
        .select()
        .from(NotesTable)
        .where(eq(NotesTable.uuid, req.params.id));
      res.status(200).json({ note });
    } catch (error) {
        next(new CustomError("Failed to fetch note", 500));
    }
  };


  export const deleteNote = async (req: Request, res: Response,next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new CustomError(JSON.stringify(result.array()), 400));
    }
    try {
        const result = validationResult(req);

        await db.delete(NotesTable).where(eq(NotesTable.uuid, req.params.id));
    res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
       // res.status(500).json({ error: 'Failed to create note' });
        next(new CustomError("Failed to delete note", 500));
        
    }
  };
 
  export const updateNote = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(new CustomError(JSON.stringify(result.array()), 400));
          }

        await db.delete(NotesTable).where(eq(NotesTable.uuid, req.params.id));
    res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create note' });
    }
  };