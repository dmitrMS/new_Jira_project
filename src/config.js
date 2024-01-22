import dotenv from 'dotenv';

dotenv.config();

export const cfg = {
  server: { host: 'hostname', port: process.env.SERVER_PORT || 8000 },
  jwt: {
    end_time: process.env.JWT_END_TIME || '1h',
    secret: process.env.JWT_SECRET || 'x-auth-key'
  },
  log: {
    human_friendly: process.env.LOG_HUMAN_FRIENDLY === 'true',
    level: process.env.LOG_LEVEL || false
  }
};
