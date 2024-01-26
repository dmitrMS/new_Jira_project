export class TrackHandler {
  constructor(db, jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async start(token) {
    const verify_user = await this.jwt.auntentification(token);

    return verify_user !== null
      ? await this.db.beginWorkTime(verify_user)
      : null;
  }

  async stop(token) {
    const verify_user = await this.jwt.auntentification(token);

    return verify_user !== null
      ? await this.db.finishWorkTime(verify_user)
      : null;
  }

  async status(token) {
    const verify_user = await this.jwt.auntentification(token);

    return verify_user !== null
      ? await this.db.getUnfinishedWorkTime(verify_user)
      : null;
  }

  async list(token) {
    const verify_user = await this.jwt.auntentification(token);

    return verify_user !== null
      ? await this.db.getUsersWorkTimes(verify_user)
      : null;
  }
}
