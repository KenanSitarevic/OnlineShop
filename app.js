const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Passport config
require("./config/passport")(passport);

// EJS Helpers
const { formatDate, stripTags, truncate } = require("./helpers/ejs");

// EJS
app.use(expressLayouts);
app.set("layout", "views/layouts/main");
app.set("view engine", "ejs");

//Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/articles", require("./routes/articles"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
