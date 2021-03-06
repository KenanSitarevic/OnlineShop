const express = require("express");
const passport = require("passport");
const router = express.Router();

//@desc         Auth with Google
//@route        Get /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//@desc         Auth auth callback
//@route        Get /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//@desc         Logout user
//@route        /auth/logout
router.get("/logout", (req, res) => {
  req.session.cart.order = [];
  req.logout();
  res.redirect("/");
});

module.exports = router;
