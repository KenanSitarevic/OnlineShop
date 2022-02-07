module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.user.status != "Active") {
      res.redirect(
        "https://st3.depositphotos.com/1431107/17801/i/1600/depositphotos_178018500-stock-photo-blocked-red-rubber-stamp.jpg"
      );
    }
    if (req.isAuthenticated()) {
      return next();
    }
    if (!req.isAuthenticated()) {
      res.redirect("/");
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
