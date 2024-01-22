import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cfg } from './config.js';
import { logger, logMiddleware } from './logger.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

class Jwt {
  constructor() {}

  CreateToken = (id) => {
    const token = jwt.sign(
      {
        id: id
      },
      cfg.jwt.secret,
      { expiresIn: cfg.jwt.end_time }
    );

    return token;
  };

  auntentification = async function (req, res, next) {
    const token = req.headers['x-auth-key'];

    try {
      var decoded = jwt.verify(token, cfg.jwt.secret, {
        ignoreExpiration: false
      });

      if (decoded) {
        const id = jwt.decode(token, { complete: true });

        const verify_user = await prisma.user.findFirst({
          where: {
            id: id.payload.id
          }
        });

        return verify_user ? verify_user.id : res.status(401).json();
      }
    } catch (err) {
      err = {
        name: 'JsonWebTokenError',
        message: 'jwt is not valid'
      };

      return res.status(401).json(err);
    }
  };
}
class Database {
  constructor() {}

  GetUnfinishedWorkTime = async function (id) {
    const verify_work = await prisma.work_time.findFirst({
      where: {
        user_id: id,
        end_date: null
      }
    });

    return verify_work !== null ? verify_work.id : null;
  };

  GetUsersWorkTime = async function (id) {
    const verify_work = await prisma.work_time.findMany({
      where: {
        user_id: id
      }
    });

    return verify_work;
  };

  BeginWorkTime = async function (id) {
    const verify_work = await new Database().GetUnfinishedWorkTime(id);

    if (verify_work === null) {
      const result = await prisma.work_time.create({
        data: {
          begin_date: new Date().toISOString(),
          user_id: id
        }
      });

      return result;
    }

    return null;
  };

  FinishWorkTime = async function (id) {
    const verify_work = await new Database().GetUnfinishedWorkTime(id);

    if (verify_work !== null) {
      const result = await prisma.work_time.update({
        where: {
          id: verify_work
        },
        data: {
          end_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
      return result;
    }

    return null;
  };

  CreateUserToken = async function (req, res, next) {
    const { login, password } = req.body;

    const result = await prisma.user.findFirst({
      where: {
        login: login
      }
    });

    return result && bcrypt.compareSync(password, result.password)
      ? result
      : null;
  };

  CreateUser = async function (req, res, next) {
    const { login, password } = req.body;
    let salt = await bcrypt.genSalt(10);

    const result = await prisma.user.create({
      data: {
        login: login.toString(),
        password: await bcrypt.hash(password.toString(), salt)
      }
    });

    return result;
  };
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logMiddleware);

app.post('/track/start', async (req, res) => {
  const verify_user = await new Jwt().auntentification(req, res);
  const result = await new Database().BeginWorkTime(verify_user);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Есть незаконченная работа!' });
});

app.post('/track/stop', async (req, res) => {
  const verify_user = await new Jwt().auntentification(req, res);
  const result = await new Database().FinishWorkTime(verify_user);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

app.post('/track/status', async (req, res) => {
  const verify_user = await new Jwt().auntentification(req, res);
  const verify_work = await new Database().GetUnfinishedWorkTime(verify_user);

  return verify_work !== null
    ? res.status(200).json(verify_work)
    : res.status(200).json();
});

app.post('/track/list', async (req, res) => {
  const verify_user = await new Jwt().auntentification(req, res);
  const verify_work = await new Database().GetUsersWorkTime(verify_user);

  return res.status(200).json(verify_work);
});

app.post('/auth/signup', async (req, res) => {
  const verify_work = await new Database().CreateUser(req, res);

  return res.status(200).json({
    jwt: new Jwt().CreateToken(verify_work.id)
  });
});

app.post('/auth/signin', async (req, res) => {
  const verify_work = await new Database().CreateUserToken(req, res);

  return verify_work !== null
    ? res.status(200).json({
        jwt: new Jwt().CreateToken(verify_work.id)
      })
    : res.status(200).json({ message: 'Неверный логин или пароль' });
});

app.post('/auth/connect', async (req, res) => {
  const verify_user = await new Jwt().auntentification(req, res);

  return verify_user !== null
    ? res.status(200).json({
        jwt: new Jwt().CreateToken(verify_user.id)
      })
    : res.status(401).json();
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});

export default prisma;
