import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cfg } from './config.js';
import { logger, logMiddleware } from './logger.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logMiddleware);

app.post('/track/start', async (req, res) => {
  const result = await prisma.work_time.create({
    data: {
      begin_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });

  res.json(result);
});

app.post('/track/stop', async (req, res) => {
  const { id_cli } = req.body;

  const result = await prisma.work_time.update({
    where: {
      id: id_cli
    },
    data: {
      end_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });

  res.json(result);
});

app.get('/auth/signup', (req, res) => {
  const message = req.query.message;

  res.json({ message });
});

app.post('/auth/signup', async (req, res) => {
  const { login, password } = req.body;
  var salt = bcrypt.genSaltSync(10);

  const result = await prisma.user.create({
    data: {
      login: login.toString(),
      password: bcrypt.hashSync(password.toString(), salt),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });

  return res.status(200).json({
    token: jwt.sign(
      {
        id: prisma.user.id
      },
      'secret'
    )
  });
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});

export default prisma;
