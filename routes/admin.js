const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Article = require("../models/Article");
const User = require("../models/User");
const Cart = require("../models/Cart");
const { session } = require("passport");

//articles users orders

router.get("/", ensureAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.redirect("/");
  }
  try {
    const articles = await Article.find({}).populate("user").lean();
    const users = await User.find({}).lean();
    const orders = await Cart.find({}).lean();
    res.render("admin/index", {
      layout: "layouts/admin",
      articles,
      users,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/articles", ensureAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.redirect("/");
  }
  try {
    const articles = await Article.find({}).populate("user").lean();
    res.render("admin/articles", { layout: "layouts/admin", articles });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/users", ensureAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.redirect("/");
  }
  try {
    const users = await User.find({}).lean();
    res.render("admin/users", { layout: "layouts/admin", users });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/orders", ensureAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.redirect("/");
  }
  try {
    //   const orders = await Orders.find({}).lean();
    //   res.render("admin/orders", { layout: "layouts/admin", orders });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/block/:id", ensureAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.redirect("/");
  }
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { status: "Block" } }
    );
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/unblock/:id", ensureAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.redirect("/");
  }
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { status: "Active" } }
    );
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
