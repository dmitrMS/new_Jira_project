export class NotificationHandler {
  constructor(db, jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async updateTeam(token, notification_id, team_id) {
    const verifyUser = await this.jwt.auntentification(token);

    await this.db.updateStatusNotification(notification_id);

    return verifyUser.id !== null
      ? await this.db.createUserTeam(verifyUser.id,team_id)
      : null;
  }

  async delete(token, id) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null ? await this.db.deleteNotification(id) : null;
  }

  async status(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.getUncoordinatedNotifications(verifyUser.id)
      : null;
  }

  async list(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser.id !== null
      ? await this.db.getAllNotifications(verifyUser.id)
      : null;
  }
}
