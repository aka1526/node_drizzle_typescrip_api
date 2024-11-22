import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

export const generateTokens = (uuid: string) => {
  const accessToken = jwt.sign({ uuid }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ uuid }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): { uuid: string } => {
  const decoded = jwt.verify(token, REFRESH_SECRET) as { uuid: string };
  return decoded;
}; 