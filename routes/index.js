const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Article = require("../models/Article");
const { session } = require("passport");

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

router.get("/cart", ensureAuth, async (req, res) => {
  try {
    const articles = [];
    for (let i = 0; i < req.session.cart.order.length; i++) {
      articles.push(
        await Article.findById(req.session.cart.order[i].article)
          .populate("user")
          .lean()
      );
    }
    if (!articles) {
      const articles = [];
      res.render("articles/cart", { layout: "layouts/main", articles, req });
    }
    console.log(articles);
    res.render("articles/cart", { layout: "layouts/main", articles, req });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/clearCart", ensureAuth, async (req, res) => {
  req.session.cart.order = [];
  const articles = [];
  res.render("articles/cart", { layout: "layouts/main", articles });
});

router.get("/blocked", ensureAuth, async (req, res) => {
  res.render("blocked", { layout: "layouts/login" });
});

module.exports = router;
