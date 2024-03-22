import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Database {
  constructor() {}

  async getUnfinishedWorkTime(id) {
    const verifyWork = await prisma.work_time.findFirst({
      where: {
        user_id: id,
        end_date: null
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getUsersWorkTimes(id) {
    const verifyWork = await prisma.work_time.findMany({
      where: {
        user_id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async beginWorkTime(id, task_name) {
    const verifyWork = await new Database().getUnfinishedWorkTime(id);

    if (verifyWork === null) {
      const result = await prisma.work_time.create({
        data: {
          user_id: id,
          begin_date: new Date().toISOString(),
          task_name: task_name
        }
      });

      return result;
    }

    return null;
  }

  async finishWorkTime(id) {
    const verifyWork = await new Database().getUnfinishedWorkTime(id);

    if (verifyWork !== null) {
      const result = await prisma.work_time.update({
        where: {
          id: verifyWork.id
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

  async updateWorkTime(id,id_work, task_name, begin_time, end_time) {
    const result = await prisma.work_time.update({
      where: {
        id: id_work
      },
      data: {
        begin_date: begin_time,
        end_date: end_time,
        task_name: task_name
      }
    });

    return result;
  }

  async deleteWorkTime(id_work) {
    await prisma.work_time.delete({
      where: {
        id: id_work
      }
    });

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
        password: await bcrypt.hash(password.toString(), salt),
        role: 'user'
      }
    });

    return result;
  }

  async getTasks(id) {
    const verifyWork = await prisma.task.findMany({
      where: {
        user_id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }
}

export default prisma;
