export class UserTeamHandler {
    constructor(db, jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  
    async delete(token,user_id, team_id) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser.id !== null
        ? await this.db.deleteUserTeam(user_id, team_id)
        : null;
    }
  
    async list(token,team_id) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);

      const userTeam=await this.db.getUsersTeam(team_id);

      const users = [];

      for (const element of userTeam) {
        const user=await this.db.findUserById(element.user_id);
        const numWorks=await this.db.getUsersWorkTimes(user.id);
        const numTeamWorks = numWorks.filter(function(work) {
          return work.task_id !== undefined;
        });
        const item = {
          login: user.login,
          role: user.role,
          numTeamWorks: numTeamWorks.length,
        };
        users.push(item);
      }
  
      return verifyUser !== null ? users : null;
    }
  }