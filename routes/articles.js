const express = require("express");
const UserInfoError = require("passport-google-oauth20/lib/errors/userinfoerror");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Article = require("../models/Article");
const User = require("../models/User");
const Category = require("../models/Category");
const Cart = require("../models/Cart");
const { session } = require("passport");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nazicishop@gmail.com",
    pass: "shopshopocami",
  },
});

// @desc            Show add page
// @route           GET /articles/add
router.get("/add", ensureAuth, async (req, res) => {
  //get info about user tbale category from lookup yes ?
  try {
    const categories = await Category.find().lean();
    console.log(categories);
    res.render("articles/add", { layout: "layouts/main", categories });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc            Process add form
// @route           POST /articles
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Article.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
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

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let article = await Article.findById(req.params.id).populate("user").lean();

    if (!article) {
      return res.render("error/404");
    }
    res.render("articles/details", { layout: "layouts/main", article });
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let article = await Article.findById(req.params.id).lean();
    if (!article) {
      return res.render("error/404");
    }
    if (article.user != req.user.id) {
      res.redirect("/articles");
    } else {
      article = await Article.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.redirect("/articles/" + req.params.id);
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const article = await Article.findOne({
      _id: req.params.id,
    }).lean();
    if (!article) {
      return res.render("error/404");
    }

    if (article.user != req.user.id) {
      res.redirect("/articles");
    } else {
      res.render("articles/edit", { layout: "layouts/main", article });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc            Delete article
// @route           DELETE /articles/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Article.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc            Get articles from one user
// @route           GET /articles/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const articles = await Article.find({ user: req.params.userId })
      // .populate("user")
      .lean();
    const user = await User.find({ _id: req.params.userId }).lean();
    articles.user = user;
    res.render("user/user", { layout: "layouts/main", articles });
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

router.post("/addToCart/:id", ensureAuth, async (req, res) => {
  try {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    const article = await Article.findById(req.params.id);
    const seller = await User.findById(article.user);
    var alreadyAdded = false;
    for (let i = 0; i < cart.order.length; i++) {
      console.log(cart.order[i].article + "--------------" + article._id);
      if (cart.order[i].article == article._id.toString()) {
        cart.order[i].qty = cart.order[i].qty + parseInt(req.body.qty);
        alreadyAdded = true;
      }
    }
    if (!alreadyAdded) {
      cart.order.push({ seller: seller, article: article, qty: req.body.qty });
    }
    req.session.cart = cart;
    console.log(req.session.cart);
    console.log(req.session);
    res.redirect("/articles/" + req.params.id);
  } catch (error) {
    console.error(error);
  }
});

router.get("/cart/purchase", ensureAuth, async (req, res) => {
  try {
    let cart = req.session.cart;
    cart.buyer = req.user;
    await Cart.create(cart);
    var mailOptions = {};
    for (let i = 0; i < cart.order.length; i++) {
      mailOptions = {
        from: "nazicishop@gmail.com",
        to: cart.order[i].seller.email,
        subject: "You received a new order",
        text:
          cart.buyer.email +
          " ordered this from you: " +
          cart.order[i].article.name,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    req.session.cart = [];
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.post("/search", ensureAuth, async (req, res) => {
  try {
    const searchFilter = req.body.search;
    const user = req.user;
    console.log(searchFilter);
    const articles = await Article.find({
      name: { $regex: searchFilter, $options: "i" },
    }).lean();
    console.log(articles);
    res.render("articles/index", { layout: "layouts/main", articles, user });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
