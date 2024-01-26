import express from 'express';
import bodyParser from 'body-parser';
import { Jwt } from './jwt.js';
import { Database } from './database.js';
import { AuthHandler } from './server/handler/auth/index.js';
import { TrackHandler } from './server/handler/track/index.js';
import { cfg } from './config.js';
import { logger, logMiddleware } from './logger.js';

const app = express();
const db = new Database();
const jwt = new Jwt(db);
const authHandler = new AuthHandler(db, jwt);
const trackHandler = new TrackHandler(db, jwt);
const authHeader = 'x-auth-key';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logMiddleware);

app.post('/track/start', async (req, res) => {
  const token = req.headers[authHeader];
  const result = await trackHandler.start(token);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Есть незаконченная работа!' });
});

app.post('/track/stop', async (req, res) => {
  const token = req.headers[authHeader];
  const result = await trackHandler.stop(token);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

app.post('/track/status', async (req, res) => {
  const token = req.headers[authHeader];
  const verify_work = await trackHandler.status(token);

  return verify_work !== null
    ? res.status(200).json(verify_work)
    : res.status(200).json();
});

app.post('/track/list', async (req, res) => {
  const token = req.headers[authHeader];
  const verify_work = await trackHandler.list(token);

  return res.status(200).json(verify_work);
});

app.post('/auth/signup', async (req, res) => {
  const { login, password } = req.body;
  const token = await authHandler.singUp(login, password);

  return res.status(200).json({
    jwt: token
  });
});

app.post('/auth/signin', async (req, res) => {
  const { login, password } = req.body;
  const verify_user = await authHandler.singIn(login, password);

  return verify_user !== null
    ? res.status(200).json({
        jwt: verify_user
      })
    : res.status(200).json({ message: 'Неверный логин или пароль' });
});

app.post('/auth/connect', async (req, res) => {
  const token = req.headers[authHeader];
  const verify_user = await authHandler.connect(token);

  return verify_user !== null
    ? res.status(200).json({
        jwt: verify_user
      })
    : res.status(401).json();
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});
