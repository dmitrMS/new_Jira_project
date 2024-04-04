export class TrackHandler {
  constructor(db, jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async start(token, task_name, task_id) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.beginWorkTime(verifyUser.id, task_name, task_id)
      : null;
  }

  async stop(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.finishWorkTime(verifyUser.id)
      : null;
  }

  async update(token, id_work, task_name, begin_time, end_time) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.updateWorkTime(
          verifyUser.id,
          id_work,
          task_name,
          begin_time,
          end_time
        )
      : null;
  }

  async delete(token, id_work) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.deleteWorkTime(id_work)
      : null;
  }

  async status(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.getUnfinishedWorkTime(verifyUser.id)
      : null;
  }

  async list(token, team_id) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? team_id == null
        ? await this.db.getUsersWorkTimes(verifyUser.id)
        : await this.db.getUsersTeamWorkTimes(verifyUser.id, team_id)
      : null;
  }

  async listTeam(token, team_id) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.getManuUsersTeamWorkTimes(team_id)
      : null;
  }

  
}
