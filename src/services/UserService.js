const { nanoid } = require("nanoid");
const crypto = require("crypto");
const UserModel = require("../models/User");

const knex = require("../db/db");

class UserService {
  async users() {
    try {
      const users = await knex.select().table("users");
      if (users) {
        return users;
      }
    } catch (err) {
      console.error(err);
    }
  }
  async findUserByUsername(username) {
    try {
      const user = await knex
        .select()
        .table("users")
        .where({ username: username });
      if (user) {
        return user[0];
      }
    } catch (err) {
      console.error(err);
    }
  }
  async findUserBySessionId(sessionId) {
    try {
      const session = await knex
        .select()
        .table("sessions")
        .where({ sessionId });
      if (!session) {
        return sessionId;
      }

      const user = await knex
        .select()
        .table("users")
        .where("id", session[0].userId);
      return user[0];
    } catch (err) {
      console.error(err);
    }
  }
  async createUser(username, password) {
    try {
      const passwordHash = await crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      const user = await new UserModel(nanoid(), username, passwordHash);
      await knex("users").insert(user);

      return user;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = UserService;
