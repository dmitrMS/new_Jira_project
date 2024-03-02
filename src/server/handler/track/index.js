export class TrackHandler {
  constructor(db, jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async start(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.beginWorkTime(verifyUser)
      : null;
  }

  async stop(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.finishWorkTime(verifyUser)
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
