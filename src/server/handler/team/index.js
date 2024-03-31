export class TeamHandler {
    constructor(db, jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  
    async create(token,name) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
      const team=await this.db.createTeam(verifyUser.id,name)
  
      return team.id !== null
        ? await this.db.createUserTeam(verifyUser.id,team.id)
        : null;
    }
  
    async delete(token, team_id) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
  
      return verifyUser.id !== null
        ? await this.db.deleteTeam(team_id)
        : null;
    }
  
    async addUserTeam(token,login,team_id) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
      const invitedUser=await this.db.findUserByLogin(login);
  
      return invitedUser !== null
        ? await this.db.createNotification(verifyUser.id,invitedUser.id,team_id)
        : null;
    }
  
    async list(token) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser.id !== null
        ? await this.db.getUsersTeams(verifyUser.id)
        : null;
    }
  }