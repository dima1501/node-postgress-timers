const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const crypto = require("crypto");

const TimerService = require("../services/TimerService");
const UserService = require("../services/UserService");
const SessionService = require("../services/SessionService");

const auth = require("../middlewares/AuthMiddleware");

router.get("/", auth(), (req, res) => {
  res.render("index", {
    user: req.user,
    authError:
      req.query.authError === "true"
        ? "Wrong username or password"
        : req.query.authError,
  });
});

router.get("/api/timers", auth(), async (req, res) => {
  try {
    const timers = await new TimerService().timers(req);
    res.status(200).send(timers);
  } catch (err) {
    console.error(err);
  }
});

router.post("/api/timers/:id/stop", auth(), async (req, res) => {
  try {
    const timer = await new TimerService().stopTimer(req);
    if (timer) {
      res.status(200).json({ timer });
    } else {
      res.status(404).send("Timer not found");
    }
  } catch (err) {
    console.error(err);
  }
});

router.post("/api/timers", auth(), async (req, res) => {
  const description = req.body.description;

  if (description) {
    try {
      const newTimer = await new TimerService().createTimer(description);
      res.status(201).json(newTimer);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(404).send("No description");
  }
});

router.post(
  "/login",
  auth(),
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await new UserService().findUserByUsername(username);
      const passwordHash = await crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (!user || passwordHash !== user.password) {
        return res.redirect("/?authError=true");
      }

      const sessionId = await new SessionService().createSession(user.id);
      res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
);

router.post(
  "/signup",
  auth(),
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await new UserService().createUser(username, password);
      const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (!user || passwordHash !== user.password) {
        return res.redirect("/?authError=true");
      }

      const sessionId = await new SessionService().createSession(user.id);
      res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
);

router.get("/logout", auth(), async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }

  try {
    await new SessionService().deleteSession(req.sessionId);
    res.clearCookie("sessionId").redirect("/");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
