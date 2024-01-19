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
      begin_time: new Date().toISOString()
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
      updated_at: new Date().toISOString()
    }
  });

  res.json(result);
});

app.post('/auth/signup', async (req, res) => {
  const { login, password } = req.body;
  var salt = await bcrypt.genSalt(10);

  const result = await prisma.user.create({
    data: {
      login: login.toString(),
      password: await bcrypt.hash(password.toString(), salt)
    }
  });

  return res.status(200).json({
    jwt: jwt.sign(
      {
        id: result.id
      },
      cfg.jwt.secret,
      { expiresIn: cfg.jwt.end_time }
    )
  });
});

app.post('/auth/signin', async (req, res) => {
  const { login, password } = req.body;

  const result = await prisma.user.findFirst({
    where: {
      login: login
    }
  });

  if (result && bcrypt.compareSync(password, result.password)) {
    return res.status(200).json({
      jwt: jwt.sign(
        {
          id: result.id
        },
        cfg.jwt.secret,
        { expiresIn: cfg.jwt.end_time }
      )
    });
  }

  return res.status(200).json({ message: 'Неверный логин или пароль' });
});

app.post('/auth/connect', async (req, res) => {
  const { token } = req.body;

  try {
    var decoded = jwt.verify(token, cfg.jwt.secret, {
      ignoreExpiration: false
    });
  } catch (err) {
    err = {
      name: 'JsonWebTokenError',
      message: 'jwt is not valid'
    };
  }

  if (decoded) {
    const id = jwt.decode(token, { complete: true });
    console.log(id);
    const result = await prisma.user.findFirst({
      where: {
        id: id.payload.id
      }
    });
    if (result) {
      return res.status(200).json({
        jwt: jwt.sign(
          {
            id: result.id
          },
          cfg.jwt.secret,
          { expiresIn: cfg.jwt.end_time }
        )
      });
    }
  }

  return;
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});

export default prisma;
