import winston from 'winston';
import { cfg } from './config.js';

let format = winston.format.printf((info) => {
  let log = `${info.level}: ${info.message} | `;

  for (const property in info) {
    if (property !== 'level' && property !== 'message') {
      log += `${property}: ${info[property]}, `;
    }
  }

  return log;
});

if (cfg.log.human_friendly === false) {
  format = winston.format.json();
}

export const logger = winston.createLogger({
  format: format,
  level: cfg.log.level,
  transports: [new winston.transports.Console()]
});

export const logMiddleware = function (req, res, next) {
  const startTime = Date.now();

  res.on('finish', function () {
    logger.info('Request proccesed', {
      method: req.method,
      url: decodeURI(req.url),
      status: res.statusCode,
      latency: Date.now() - startTime
    });
  });

  next();
};
