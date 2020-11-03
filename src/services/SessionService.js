const { nanoid } = require("nanoid");

const knex = require("../db/db");

const Session = require("../models/Sessions");

class SessionService {
  async sessions() {
    try {
      const sessions = await knex.select().table("sessions");
      if (sessions) {
        return sessions;
      }
    } catch (err) {
      console.error(err);
    }
  }
  async createSession(userId) {
    try {
      const sessionId = new Session(nanoid()).sessionId;
      await knex("sessions").insert({ sessionId, userId });
      return sessionId;
    } catch (err) {
      console.error(err);
    }
  }
  async deleteSession(sessionId) {
    try {
      await knex("sessions").where("sessionId", sessionId).del();
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = SessionService;
