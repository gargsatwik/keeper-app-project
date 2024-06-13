import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;

const saltLength = 10;

const _dirname = dirname(fileURLToPath(import.meta.url));

const DB_URI = process.env.DB_URI;
const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db("Keeper App");
const credentials = db.collection("Crendentials");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("src"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log(_dirname);
  if (req.isAuthenticated()) {
    res.render(_dirname + "/public/index.html");
  } else {
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render(_dirname + "/views/login.ejs");
});

app.get("/register", (req, res) => {
  res.render(_dirname + "/views/register.ejs");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.post("/register", (req, res) => {
  const data = req.body;
  bcrypt.hash(data.password, saltLength, async (err, hash) => {
    if (err) {
      console.log("Error hashing password ", err);
    } else {
      const newUser = {
        email: data.email,
        password: hash,
      };
      await credentials.insertOne(newUser);
      req.login(newUser, (err) => {
        console.log(err);
        res.redirect("/");
      });
    }
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    const registered_data = await credentials.findOne({ email: username });
    bcrypt.compare(password, registered_data.password, (err, result) => {
      if (err) {
        console.log("Error comparing passwords ", err);
      } else {
        if (result) {
          return cb(null, registered_data);
        } else {
          return cb(null, false);
        }
      }
    });
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      const result = credentials.findOne({ email: profile.email });
      if (!result) {
        const newUser = {
          email: profile.email,
          passport: "googleAuth",
        };
        cb(null, newUser);
      } else {
        cb(null, result);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
