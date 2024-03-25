import jwt from 'jsonwebtoken';
import { cfg } from './config.js';

const authHeader = 'x-auth-key';

export class Jwt {
  constructor(db) {
    this.db = db;
  }

  createToken(id, role) {
    // вшить админа и юзера
    const token = jwt.sign(
      {
        id: id,
        role: role
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
        const verifyRoleUser = id.payload.role;
        const verify = { id: verifyUser.id, role: verifyRoleUser };

        return verifyUser ? verify : null;
      }
    } catch (err) {
      return null;
    }
  }

  async auntentificationAdmin(token) {
    try {
      const decoded = jwt.verify(token, cfg.jwt.secret, {
        ignoreExpiration: false
      });

      if (decoded) {
        const id = jwt.decode(token, { complete: true });

        const verifyUser = await this.db.findUserById(id.payload.id);
        const verifyRoleUser = id.payload.role;
        const verify = { id: verifyUser.id, role: verifyRoleUser };

        return verifyUser && verifyRoleUser === 'teamlead' ? verify : null;
      }
    } catch (err) {
      return null;
    }
  }
}
