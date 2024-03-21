export class TrackHandler {
  constructor(db, jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async start(token,task_name) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.beginWorkTime(verifyUser,task_name)
      : null;
  }

  async stop(token) {
    const verifyUser = await this.jwt.auntentification(token);

    console.log(verifyUser);
    return verifyUser !== null
      ? await this.db.finishWorkTime(verifyUser)
      : null;
  }

  async update(token,id_work,task_name,begin_time, end_time) {
    const verifyUser = await this.jwt.auntentification(token);
    console.log(id_work,task_name,begin_time, end_time);

    return verifyUser !== null
      ? await this.db.updateWorkTime(verifyUser,id_work,task_name,begin_time, end_time)
      : null;
  }

  async delete(token, id_work) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.deleteWorkTime(id_work)
      : null;
  }

  async status(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getUnfinishedWorkTime(verifyUser)
      : null;
  }

  async list(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getUsersWorkTimes(verifyUser)
      : null;
  }
}
