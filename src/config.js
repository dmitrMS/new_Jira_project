import dotenv from 'dotenv';

dotenv.config();

export const cfg = {
  server: { host: 'hostname', port: process.env.SERVER_PORT || 8000 },
  log: {
    human_friendly: process.env.LOG_HUMAN_FRIENDLY === 'true',
    level: process.env.LOG_LEVEL || false
  }
};
