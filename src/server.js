import express from "express";
import bodyParser from "body-parser";
import { cfg } from "./config.js";
import { logger, logMiddleware } from "./logger.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logMiddleware);

app.get("/", (req, res) => {});

app.post("/", (req, res) => {});

app.get("/track", (req, res) => {});

app.post("/track/start", async (req, res) => {
  const result = await prisma.post.create({
    data: {
      begin_time: Date.now(),
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  });
  res.json(result);
});

app.post("/track/stop", async (req, res) => {
  const { id_cli } = req.body;

  const result = await prisma.post.update({
    where: {
      id: id_cli,
    },
    data: {
      end_time: Date.now(),
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  });
  res.json(result);
});

app.listen(cfg.server.port, () => {
  logger.info(`Server is running `, {
    host: cfg.server.host,
    port: cfg.server.port,
  });
});
