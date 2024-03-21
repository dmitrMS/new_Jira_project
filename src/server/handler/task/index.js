export class TaskHandler {
    constructor(db, jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  
    async create(token,task_id) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser !== null
        ? await this.db.createTask(task_id)
        : null;
    }
  
    async delete(token, id_task) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser !== null
        ? await this.db.deleteTask(id_task)
        : null;
    }
  
    async status(token) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser !== null
        ? await this.db.getUnfinishedTasks()
        : null;
    }
  
    async list(token) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser !== null
        ? await this.db.getTasks()
        : null;
    }
  }