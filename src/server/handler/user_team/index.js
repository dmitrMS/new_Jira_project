export class UserTeamHandler {
    constructor(db, jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  
    // async create(token,team_id) {
    //   const verifyUser = await this.jwt.auntentification(token);
  
    //   return verifyUser.id !== null
    //     ? await this.db.createUserTeam(verifyUser.id,team_id)
    //     : null;
    // }
  
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

      userTeam.forEach(async (element) => {
        const userTeam=await this.db.findUserById(element.id);
        const numWorks=await this.db.getUsersWorkTimes(userTeam.id);
        const numTeamWorks = numWorks.filter(function(work) {
          return work.task_id !== undefined;
        });
        const item = {
          login: userTeam.id,
          role: userTeam.role,
          numTeamWorks: numTeamWorks.length,
        };
        users.push(item);
      });
  
      return users;
    }
  }