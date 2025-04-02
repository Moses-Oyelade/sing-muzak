export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'your_strong_secret',
    expiresIn: '1h',
  };
  