require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const { MongoClient } = require("mongodb");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { redirect } = require("react-router-dom");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.ACCESSKET,
    secretAccessKey: process.env.PRIVATE_ACCESSKEY,
  },
});

SECRET_KEY = process.env.SESSION_PASSWORD;

app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(passport.session());
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "josengnam",
    key: function (req, file, cb) {
      cb(null, Date.now().toString()); //업로드시 파일명 변경가능
    },
  }),
});

passport.use(
  new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
    let result = await db
      .collection("user")
      .findOne({ username: 입력한아이디 });
    if (!result) {
      return cb(null, false, { message: "아이디 DB에 없음" });
    }
    if (result.password == 입력한비번) {
      return cb(null, result);
    } else {
      return cb(null, false, { message: "비번불일치" });
    }
  })
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

let db;
const url = process.env.DB_URL;
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("yogo");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT} 에서 서버 실행중`);
});

app.post("/join/add", async (req, res) => {
  const { email, password, repassword, name, phoneNumber } = req.body;
  if (password === repassword) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection("user").insertOne({
        email: email,
        name: name,
        pw: hashedPassword,
        phoneNumber: phoneNumber,
      });
      res.status(200).json({ message: "회원가입 완료!" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    }
  } else {
    res.status(400).json({
      message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    });
  }
});

app.post("/login/search", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("user").findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "아이디가 존재하지 않습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.pw);

    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign({ email: user.email, name : user.name }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "로그인 성공", token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "서버 오류", error: e.message });
  }
});
