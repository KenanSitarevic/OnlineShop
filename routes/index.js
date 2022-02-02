const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Article = require("../models/Article");

router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "layouts/login" });
});

router.get("/login", (req, res) => {
  res.render("dashboard", { layout: "layouts/main" });
  // ("koji view", {layout: "unutar kojeg layouta"})
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const user = req.user;
    const articles = await Article.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      layout: "layouts/main",
      name: req.user.firstName,
      articles,
      user,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
