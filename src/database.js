import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Database {
  constructor() {}

  async getUnfinishedWorkTime(id) {
    const verify_work = await prisma.work_time.findFirst({
      where: {
        user_id: id,
        end_date: null
      }
    });

    return verify_work !== null ? verify_work : null;
  }

  async getUsersWorkTimes(id) {
    const verify_work = await prisma.work_time.findMany({
      where: {
        user_id: id
      }
    });

    return verify_work !== null ? verify_work : null;
  }

  async beginWorkTime(id) {
    const verify_work = await new Database().getUnfinishedWorkTime(id);

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
  }

  async finishWorkTime(id) {
    const verify_work = await new Database().getUnfinishedWorkTime(id);

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

      return result;
    }

    return null;
  }

  async findUserByLogin(login) {
    const result = await prisma.user.findFirst({
      where: {
        login: login
      }
    });

    return result;
  }

  async findUserById(id) {
    const result = await prisma.user.findFirst({
      where: {
        id: id
      }
    });

    return result;
  }

  async createUserToken(login, password) {
    const result = await new Database().findUserByLogin(login);

    return result && bcrypt.compareSync(password, result.password)
      ? result
      : null;
  }

  async createUser(login, password) {
    let salt = await bcrypt.genSalt(10);

    const result = await prisma.user.create({
      data: {
        login: login.toString(),
        password: await bcrypt.hash(password.toString(), salt)
      }
    });

    return result;
  }
}

export default prisma;
