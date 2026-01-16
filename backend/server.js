const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const routes = require('./routes/index');
const validPassword = require('./passport/passwordFunctions').validPassword;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4080;

// ---- MONGO URL (nem docker) ----
const MONGO_URL =
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/shift-scheduler';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Model
const User = require('./models/User');

// ---- Mongo connect ----
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected:', MONGO_URL))
  .catch((err) => {
    console.error('MongoDB connection error:', err?.message || err);
    // Ha nincs DB, ne fusson tovább, mert úgyis minden szétesik
    process.exit(1);
  });

/**
 * PASSPORT SET UP
 */
passport.use(
  new LocalStrategy((username, password, cb) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) return cb(null, false);

        const isValid = validPassword(password, user.hash, user.salt);
        if (isValid) return cb(null, user);

        return cb(null, false);
      })
      .catch((err) => cb(err));
  })
);

passport.serializeUser((user, cb) => cb(null, user.id));

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
});

// Session (MongoStore)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'boterham',
    store: MongoStore.create({ mongoUrl: MONGO_URL }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport before routes
app.use(passport.initialize());
app.use(passport.session());

// Production build (ha van build)
app.use(express.static('../frontend/build'));

// Routes
app.use(routes);

// Start
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
