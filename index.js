const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

//Load config
dotenv.config({ path: "./config/config.env" });
// passport config
require("./config/passport")(passport);
connectDB();

const app = express();
// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
// Handlebars Helpers
const { formatDate, stripTags, truncate } = require("./helpers/hbs");
//Handle bars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { formatDate, stripTags, truncate },
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");
// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
  })
);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// Static folder
app.use(express.static(path.join(__dirname, "public")));

// ROutes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

//Port
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
