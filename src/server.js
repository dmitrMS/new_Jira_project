import express from 'express';
import bodyParser from 'body-parser';
import { Jwt } from './jwt.js';
import { Database } from './database.js';
import { AuthHandler } from './server/handler/auth/index.js';
import { TrackHandler } from './server/handler/track/index.js';
import { TaskHandler } from './server/handler/task/index.js';
import { cfg } from './config.js';
import { logger, logMiddleware } from './logger.js';
import cors from 'cors'

const app = express();
const db = new Database();
const jwt = new Jwt(db);
const authHandler = new AuthHandler(db, jwt);
const trackHandler = new TrackHandler(db, jwt);
const taskHandler = new TaskHandler(db, jwt);
const authHeader = 'x-auth-key';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logMiddleware);
app.use(cors());

app.post('/track/start', async (req, res) => {
  const token = req.headers[authHeader];
  const { task_name } = req.body;
  const result = await trackHandler.start(token,task_name );

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

app.post('/track/update', async (req, res) => {
  const token = req.headers[authHeader];
  const { id_work,task_name,begin_date, end_date} = req.body;
  const result = await trackHandler.update(token,id_work,task_name,begin_date, end_date);

  return result !== null
    ? res.status(200).json(result)
    : res.status(200).json({ message: 'Нет незаконченных работ!' });
});

app.post('/track/delete', async (req, res) => {
  const token = req.headers[authHeader];
  const { id_work } = req.body;
  await trackHandler.delete(token, id_work);

  return  res.status(200).json({ message: 'Работа удалена' });
});

app.post('/track/status', async (req, res) => {
  const token = req.headers[authHeader];
  const verifyWork = await trackHandler.status(token);

  return verifyWork !== null
    ? res.status(200).json(verifyWork)
    : res.status(200).json(null);
});

app.post('/track/list', async (req, res) => {
  const token = req.headers[authHeader];
  const verifyWork = await trackHandler.list(token);

  return res.status(200).json(verifyWork);
});

app.get('/task/list', async (req, res) => {
  const token = req.headers[authHeader];
  const verifyWork = await taskHandler.list(token);

  return res.status(200).json(verifyWork);
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
  const verifyUser = await authHandler.singIn(login, password);

  return verifyUser !== null
    ? res.status(200).json({
        jwt: verifyUser 
      })
    : res.status(200).json({ message: 'Неверный логин или пароль' });
});

app.post('/auth/connect', async (req, res) => {
  const token = req.headers[authHeader];
  const verifyUser = await authHandler.connect(token);

  return verifyUser !== null
    ? res.status(200).json({
        jwt: verifyUser 
      })
    : res.status(401).json();
});

app.post('/auth/data', async (req, res) => {
  const token = req.headers[authHeader];
  const verifyUser = await authHandler.getDate(token);

  return verifyUser !== null
    ? res.status(200).json({
      id: verifyUser.id, 
      role: verifyUser.role
    })
    : res.status(401).json();
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port
  });
});
