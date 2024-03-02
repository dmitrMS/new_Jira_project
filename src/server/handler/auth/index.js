export class AuthHandler {
  constructor(db, jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async singIn(login, password) {
    const verifyUser = await this.db.createUserToken(login, password);

    return verifyUser !== null ? this.jwt.createToken(verifyUser.id) : null;
  }

  async singUp(login, password) {
    const user = await this.db.createUser(login, password);

    return this.jwt.createToken(user.id);
  }

  async connect(token) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? this.jwt.createToken(verifyUser.id) : null;
  }
}
