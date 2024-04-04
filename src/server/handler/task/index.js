export class TaskHandler {
    constructor(db, jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  
    async create(token,name,team_id) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
  
      return verifyUser.id !== null
        ? await this.db.createTask(name,team_id)
        : null;
    }
  
    async delete(token, id_task) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
  
      return verifyUser.id !== null
        ? await this.db.deleteTask(id_task)
        : null;
    }
  
    async status(token) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
  
      return verifyUser.id !== null
        ? await this.db.getUnfinishedTasks()
        : null;
    }
  
    async list(token,team_id) {
      const verifyUser = await this.jwt.auntentification(token);
      const usersTeam= await this.db.getTeamById(team_id);
  
      return verifyUser.id !== null
        ? await this.db.getTeamTasks(usersTeam)
        : null;
    }
  }