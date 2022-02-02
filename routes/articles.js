const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Article = require("../models/Article");

// @desc            Show add page
// @route           GET /articles/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("articles/add", { layout: "layouts/main" });
});

// @desc            Process add form
// @route           POST /articles
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Article.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc            Show all articles
// @route           GET /articles/add
router.get("/", ensureAuth, async (req, res) => {
  try {
    const articles = await Article.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    const user = req.user;
    res.render("articles/index", { layout: "layouts/main", articles, user });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
