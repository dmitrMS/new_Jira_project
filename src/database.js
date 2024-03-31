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

  async updateWorkTime(id, id_work, task_name, begin_time, end_time) {
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

  async updateUser(id, task_id) {
    const result = await prisma.work_time.update({
      where: {
        id: id
      },
      data: {
        task_id: task_id
      }
    });

    return result;
  }

  async createTask(name, team_id) {
    const result = await prisma.task.create({
      data: {
        name: name,
        team_id: team_id
      }
    });

    return result;
  }

  async deleteTask(task_id) {
    await prisma.task.delete({
      where: {
        id: task_id
      }
    });

    return null;
  }

  async getTasks(id) {
    const verifyWork = await prisma.task.findMany({
      where: {
        user_id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async createTeam(id, name) {
    const result = await prisma.team.create({
      data: {
        admin_id: id,
        name: name
      }
    });

    return result;
  }

  async deleteTeam(team_id) {
    await prisma.team.delete({
      where: {
        id: team_id
      }
    });

    return null;
  }

  async getTeams(id) {
    const verifyWork = await prisma.team.findFirst({
      where: {
        id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getUsersTeams(id) {
    const teamUsers = await prisma.user_team.findMany({
      where: {
        user_id: id
      }
    });
    let userTeams = [];

    for (const element of teamUsers) {
      const item=await new Database().getTeams(element.team_id);
      userTeams.push(item);
    }
  
    return userTeams;
  }

  async createNotification(id, user_id, team_id) {
    const result = await prisma.notification.create({
      data: {
        sender_id: id,
        user_id: user_id,
        reason: 'team',
        data_id: team_id
      }
    });

    return result;
  }

  async deleteNotification(id) {
    await prisma.team.delete({
      where: {
        id: id
      }
    });

    return null;
  }

  async updateStatusNotification(id) {
    const result = await prisma.notification.update({
      where: {
        id: id
      },
      data: {
        status: true
      }
    });

    return result;
  }

  async getUncoordinatedNotifications(id) {
    const verifyWork = await prisma.notification.findMany({
      where: {
        user_id: id,
        status: false
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async getAllNotifications(id) {
    const verifyWork = await prisma.notification.findMany({
      where: {
        user_id: id
      }
    });

    return verifyWork !== null ? verifyWork : null;
  }

  async createUserTeam(user_id, team_id) {
    const result = await prisma.user_team.create({
      data: {
        user_id: user_id,
        team_id: team_id
      }
    });

    return result;
  }

  async deleteUserTeam(user_id, team_id) {
    await prisma.user_team.delete({
      where: {
        user_id: user_id,
        team_id: team_id
      }
    });

    return null;
  }

  async getUsersTeam(team_id) {
    const verifyWork = await prisma.user_team.findMany({
      where: {
        team_id: team_id
      }
    });

    return verifyWork;
  }
}

export default prisma;
