require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const { MongoClient } = require("mongodb");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");

// S3 설정
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.ACCESSKET,
    secretAccessKey: process.env.PRIVATE_ACCESSKEY,
  },
});

// 세션 키
const SECRET_KEY = process.env.SESSION_PASSWORD;

// 세션 미들웨어
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// S3 업로드 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "josengnam",
    key: function (req, file, cb) {
      cb(null, Date.now().toString()); // 파일 이름
    },
  }),
});

let db;

async function startServer() {
  try {
    const client = await new MongoClient(process.env.DB_URL, {tlsAllowInvalidCertificates: true,}).connect();
    console.log("✅ DB 연결 성공");
    db = client.db("yogo");

    // Passport Local 전략 설정
    passport.use(
      new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
        const result = await db.collection("user").findOne({ username: 입력한아이디 });
        if (!result) return cb(null, false, { message: "아이디 DB에 없음" });
        if (result.password === 입력한비번) return cb(null, result);
        return cb(null, false, { message: "비번 불일치" });
      })
    );

    // 세션 직렬화/역직렬화
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

    // API: 회원가입
    app.post("/join/add", async (req, res) => {
      const { email, password, repassword, name, phoneNumber } = req.body;
      if (password !== repassword) {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("user").insertOne({
          email,
          name,
          pw: hashedPassword,
          phoneNumber,
        });
        res.status(200).json({ message: "회원가입 완료!" });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "회원가입 오류" });
      }
    });

    // API: 로그인
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

        const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, {
          expiresIn: "1h",
        });

        res.json({ message: "로그인 성공", token });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "서버 오류", error: e.message });
      }
    });

    // API: 테스트용
    app.get("/test", (req, res) => {
      res.send("서버 및 DB 정상 작동 중");
    });

    // 서버 시작
    app.listen(process.env.PORT, () => {
      console.log(`🚀 서버 실행중: http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ DB 연결 실패:", err);
  }
}

startServer();
