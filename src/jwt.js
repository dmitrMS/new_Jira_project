import jwt from 'jsonwebtoken';
import { cfg } from './config.js';

const authHeader = 'x-auth-key';

export class Jwt {
  constructor(db) {
    this.db = db;
  }

  createToken(id) {
    const token = jwt.sign(
      {
        id: id
      },
      cfg.jwt.secret,
      { expiresIn: cfg.jwt.endTime }
    );

    return token;
  }

  async auntentification(token) {
    try {
      const decoded = jwt.verify(token, cfg.jwt.secret, {
        ignoreExpiration: false
      });

      if (decoded) {
        const id = jwt.decode(token, { complete: true });

        const verifyUser = await this.db.findUserById(id.payload.id);

        return verifyUser ? verifyUser.id : null;
      }
    } catch (err) {
      return null;
    }
  }
}
