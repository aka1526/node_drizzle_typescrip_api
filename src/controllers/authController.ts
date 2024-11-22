import { UserTable } from './../db/schema/users';
import { Request, Response,NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/db';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { eq, and, sql } from 'drizzle-orm';
import { generateUUID, getBangkokTime } from '../lib/util';
import { refreshTokensTB } from '../db/schema/refreshTokens';
import { CustomError } from '../lib/custom-error';
import { revokedTokensTB } from '../db/schema/revokedTokens';
 

 
// Cookie config
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in production
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, password, name } = req.body;


    // Check if user exists
    
    const existingUser = await db.select().from(UserTable).where(eq(UserTable.email, email));
    if (existingUser.length) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const UUID = await generateUUID();
    const data = await db.insert(UserTable).values({ 
         uuid: UUID,
         email: email,
         password: hashedPassword,
         firstName: name,   
     });

    // Generate tokens
    const tokens = generateTokens(UUID);

    // Store refresh token
    await db.insert(refreshTokensTB).values({
        uuid: await generateUUID(),
        user_uuid: UUID,
        token: tokens.refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() 
    });

    res.status(201).json({
      message: 'User registered successfully',
     
      tokens
    });

  } catch (error) {
    //res.status(500).json({ message: 'Registration failed' });
    next(new CustomError("Failed to register user", 500));
  }
};

export const login = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [user] = await db.select().from(UserTable).where(and(eq(UserTable.email, email), eq(UserTable.isActive, 'Y')));
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate tokens
    const tokens = generateTokens(user.uuid);

    // Set cookies
    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
     // Update last_active
     await db.update(UserTable)
     .set({ lastActive:  sql`${getBangkokTime()}`, status_online: 'Y' })
     .where(eq(UserTable.uuid, user.uuid));
 
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    res.json({ message: 'Login successful' });

  } catch (error) {
    // res.status(500).json({ message: 'Login failed' });
    next(new CustomError("Failed to login", 500));
  }
};

export const refresh = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify token and generate new ones
    const decoded = await verifyRefreshToken(refreshToken);
    const tokens = generateTokens(decoded.uuid);

    // Set new cookies
    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    res.json({ message: 'Token refreshed successfully' });

  } catch (error) {
    // res.status(403).json({ message: 'Invalid refresh token' });
    next(new CustomError("Invalid refresh token", 403));
  }
};

export const logout = async (req: Request, res: Response,next:NextFunction) => {
  try {
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    // res.status(500).json({ message: 'Logout failed' });
    next(new CustomError("Failed to logout", 500));
  }
};

export const updateUser = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { name, email } = req.body;
    const userUuid = req.user?.uuid; // Assuming req.user is set by authenticateToken middleware

    if (!userUuid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await db.update(UserTable)
      .set({ 
        firstName: name,
        email: email 
      })
      .where(eq(UserTable.uuid, userUuid));

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    // res.status(500).json({ message: 'Update failed' });
    next(new CustomError("Failed to update user", 500));
  }
};

export const getProfile = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const userUuid = req.user?.uuid; // Assuming req.user is set by authenticateToken middleware

    if (!userUuid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [user] = await db.select({
      uuid: UserTable.uuid,
      email: UserTable.email,
      firstName: UserTable.firstName,
      createdAt: UserTable.createdAt
    })
    .from(UserTable)
    .where(eq(UserTable.uuid, userUuid));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    // res.status(500).json({ message: 'Failed to fetch profile' });
    next(new CustomError("Failed to fetch profile", 500));
  }
};

export const revokeToken = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.status(401).json({ message: 'No token provided' });

    // Add token to revoked list
    await db.insert(revokedTokensTB).values({ token: accessToken });
    
    // Clear cookie
    res.clearCookie('accessToken');
    res.json({ message: 'Token revoked successfully' });
  } catch (error) {
    next(new CustomError("Failed to revoke token", 500));
  }
}; 