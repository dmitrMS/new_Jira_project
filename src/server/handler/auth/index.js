export class AuthHandler {
  constructor(db, jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async singIn(login, password) {
    const verify_user = await this.db.createUserToken(login, password);

    return verify_user !== null ? this.jwt.createToken(verify_user.id) : null;
  }

  async singUp(login, password) {
    const user = await this.db.createUser(login, password);

    return this.jwt.createToken(user.id);
  }

  async connect(token) {
    const verify_user = await this.jwt.auntentification(token);

    return verify_user !== null ? this.jwt.createToken(verify_user.id) : null;
  }
}
