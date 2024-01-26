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
      { expiresIn: cfg.jwt.end_time }
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

        const verify_user = await this.db.findUserById(id.payload.id);

        return verify_user ? verify_user.id : null;
      }
    } catch (err) {
      return null;
    }
  }
}
