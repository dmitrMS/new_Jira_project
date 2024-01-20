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
  const token = req.headers['token'];

  try {
    const decoded = jwt.verify(token, cfg.jwt.secret, {
      ignoreExpiration: false
    });

    if (decoded) {
      const id = jwt.decode(token, { complete: true });

      const verify_user = await prisma.user.findFirst({
        where: {
          id: id.payload.id
        }
      });

      if (verify_user) {
        const verify_work = await prisma.work_time.findFirst({
          where: {
            user_id: id.payload.id,
            end_date: null
          }
        });

        if (verify_work === null) {
          const result = await prisma.work_time.create({
            data: {
              begin_date: new Date().toISOString(),
              user_id: verify_user.id
            }
          });

          return res.status(200).json(result);
        }

        return res.status(200).json({ message: 'Есть незаконченная работа!' });
      }
    }

    return res.status(401).json({});
  } catch (err) {
    err = {
      name: 'JsonWebTokenError',
      message: 'jwt is not valid'
    };

    return res.status(401).json(err);
  }
});

app.post('/track/stop', async (req, res) => {
  const token = req.headers['token'];

  try {
    const decoded = jwt.verify(token, cfg.jwt.secret, {
      ignoreExpiration: false
    });

    if (decoded) {
      const id = jwt.decode(token, { complete: true });

      const verify_user = await prisma.user.findFirst({
        where: {
          id: id.payload.id
        }
      });

      if (verify_user) {
        const verify_work = await prisma.work_time.findFirst({
          where: {
            user_id: id.payload.id,
            end_date: null
          }
        });

        if (verify_work !== null) {
          const result = await prisma.work_time.update({
            where: {
              id: verify_work.id
            },
            data: {
              end_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          });

          return res.status(200).json(result);
        }

        return res.status(200).json({ message: 'Нет незаконченных работ!' });
      }
    }

    return res.status(401).json();
  } catch (err) {
    err = {
      name: 'JsonWebTokenError',
      message: 'jwt is not valid'
    };

    return res.status(401).json(err);
  }
});

app.post('/track/status', async (req, res) => {
  const token = req.headers['token'];

  try {
    const decoded = jwt.verify(token, cfg.jwt.secret, {
      ignoreExpiration: false
    });

    if (decoded) {
      const id = jwt.decode(token, { complete: true });

      const verify_user = await prisma.user.findFirst({
        where: {
          id: id.payload.id
        }
      });

      if (verify_user) {
        const verify_work = await prisma.work_time.findFirst({
          where: {
            user_id: id.payload.id,
            end_date: null
          }
        });

        if (verify_work) {
          return res.status(200).json(verify_work);
        }

        return res.status(200).json();
      }
    }

    return res.status(401).json();
  } catch (err) {
    err = {
      name: 'JsonWebTokenError',
      message: 'jwt is not valid'
    };

    return res.status(401).json(err);
  }
});

app.post('/track/list', async (req, res) => {
  const token = req.headers['token'];

  try {
    const decoded = jwt.verify(token, cfg.jwt.secret, {
      ignoreExpiration: false
    });

    if (decoded) {
      const id = jwt.decode(token, { complete: true });

      const verify_user = await prisma.user.findFirst({
        where: {
          id: id.payload.id
        }
      });

      if (verify_user) {
        const verify_work = await prisma.work_time.findMany({
          where: {
            user_id: id.payload.id
          }
        });

        return res.status(200).json(verify_work);
      }
    }

    return res.status(401).json();
  } catch (err) {
    err = {
      name: 'JsonWebTokenError',
      message: 'jwt is not valid'
    };

    return res.status(401).json(err);
  }
});

app.post('/auth/signup', async (req, res) => {
  const { login, password } = req.body;
  let salt = await bcrypt.genSalt(10);

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
  const token = req.headers['token'];

  try {
    const decoded = jwt.verify(token, cfg.jwt.secret, {
      ignoreExpiration: false
    });

    if (decoded) {
      const id = jwt.decode(token, { complete: true });

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

    return res.status(401).json();
  } catch (err) {
    err = {
      name: 'JsonWebTokenError',
      message: 'jwt is not valid'
    };

    return res.status(401).json(err);
  }
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});

export default prisma;
