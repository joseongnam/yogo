require("dotenv").config();
const { ObjectId } = require("mongodb");

const express = require("express");
const app = express();
app.use(express.json());

const { MongoClient } = require("mongodb");
const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");

function isAdminMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SESSION_PASSWORD);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "관리자만 접근 가능" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "인증 실패", error: err.message });
  }
}

// S3 설정
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.PRIVATE_ACCESSKEY,
  },
});

async function getS3ImageList(yogojo) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: yogojo,
    });

    const response = await s3.send(command);
    const contents = response.Contents || [];

    // region이 함수일 수 있으니 비동기로 받아옴
    let region = s3.config.region;
    if (typeof region === "function") {
      region = await region();
    }

    // region이 객체면 문자열로 변환
    if (typeof region === "object" && region.region) {
      region = region.region;
    }

    const imageUrls = contents.map((obj) => {
      return `https://${yogojo}.s3.${region}.amazonaws.com/${obj.Key}`;
    });

    return imageUrls;
  } catch (error) {
    console.error("S3 목록 조회 실패:", error);
    return [];
  }
}

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
    bucket: "yogojo",
    key: function (req, file, cb) {
      const prefix = req.query.prefix || "default";
      const safePrefix = prefix.endsWith("/") ? prefix : prefix + "/";

      const fileName = Date.now() + "_" + file.originalname;
      const fullkey = safePrefix + fileName;

      cb(null, fullkey);
    },
  }),
});

let db;

async function startServer() {
  try {
    const client = await new MongoClient(process.env.DB_URL, {
      tlsAllowInvalidCertificates: true,
    }).connect();
    console.log("✅ DB 연결 성공");
    db = client.db("yogo");

    // Passport Local 전략 설정
    passport.use(
      new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
        const result = await db
          .collection("user")
          .findOne({ username: 입력한아이디 });
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{10,16}$/;

      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "올바른 이메일 형식이 아닙니다." });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "비밀번호는 10~16자이며, 영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다.",
        });
      }

      if (password !== repassword) {
        return res
          .status(400)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = false;
        await db.collection("user").insertOne({
          email,
          name,
          pw: hashedPassword,
          phoneNumber,
          isAdmin,
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
          return res
            .status(400)
            .json({ message: "아이디가 존재하지 않습니다." });
        }

        const isMatch = await bcrypt.compare(password, user.pw);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." });
        }

        const token = jwt.sign(
          {
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false,
          },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

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

    app.post(
      "/upload",
      isAdminMiddleware,
      upload.array("img", 10),
      async (req, res) => {
        try {
          let region = s3.config.region;
          if (typeof region === "function") {
            region = await region();
          }
          if (typeof region === "object" && region.region) {
            region = region.region;
          }

          const locations = req.files.map((file) => {
            return `https://yogojo.s3.${region}.amazonaws.com/${file.key}`;
          });

          res.json({ message: "업로드 완료", location: locations });
        } catch (err) {
          console.error("업로드 중 오류:", err);
          res.status(500).json({ message: "서버 오류", error: err.message });
        }
      }
    );

    // 서버 시작
    app.listen(process.env.PORT, () => {
      console.log(`🚀 서버 실행중: http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ DB 연결 실패:", err);
  }

  app.get("/image-list", async (req, res) => {
    const prefix = req.query.prefix || ""; // 예: "ad/" 또는 "products/"
    try {
      const command = new ListObjectsV2Command({
        Bucket: "yogojo",
        Prefix: prefix,
      });

      const response = await s3.send(command);

      let region = s3.config.region;
      if (typeof region === "function") {
        region = await region();
      }

      // region이 객체일 수도 있으니 문자열로 처리
      if (typeof region === "object" && region.region) {
        region = region.region;
      }

      const imageUrls = (response.Contents || []).map((obj) => {
        return `https://yogojo.s3.${region}.amazonaws.com/${obj.Key}`;
      });

      res.json(imageUrls);
    } catch (err) {
      console.error("S3 이미지 조회 오류:", err);
      res.status(500).json({ message: "이미지 조회 실패" });
    }
  });

  app.delete("/delete", isAdminMiddleware, async (req, res) => {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ message: "key 값이 없습니다" });
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: "yogojo",
        Key: key, // 예: "ad/1751778707862_car1-1.png"
      });

      await s3.send(command);
      res.status(200).json({ message: "삭제 완료", deletedKey: key });
    } catch (err) {
      console.error("삭제 실패:", err);
      res
        .status(500)
        .json({ message: "삭제 중 오류 발생", error: err.message });
    }
  });

  app.delete("/delete-multiple", isAdminMiddleware, async (req, res) => {
    const { keys } = req.body; // 배열로 ["ad/xxx.png", "products/yyy.jpg"]

    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ message: "keys 배열이 필요합니다" });
    }

    try {
      const command = new DeleteObjectsCommand({
        Bucket: "yogojo",
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
          Quiet: false,
        },
      });

      await db.collection("products").deleteMany({
        imageURL: {
          $in: keys.map(
            (k) => `https://yogojo.s3.ap-northeast-2.amazonaws.com/${k}`
          ),
        },
      });

      const result = await s3.send(command);
      res.status(200).json({ message: "삭제 완료", deleted: result.Deleted });
    } catch (err) {
      console.error("다중 삭제 실패:", err);
      res.status(500).json({ message: "삭제 중 오류", error: err.message });
    }
  });

  app.post("/productRegistration", isAdminMiddleware, async (req, res) => {
    const { title, explanation, price, discountPrice, discountRate, imageURL } =
      req.body;

    if (!imageURL) {
      return res
        .status(400)
        .json({ message: "이미지 URL 및 key가 필요합니다." });
    }

    try {
      await db.collection("products").insertOne({
        title,
        explanation,
        price,
        discountPrice,
        discountRate,
        imageURL,

        createdAt: new Date(),
      });

      res.status(200).json({ message: "상품 등록 완료" });
    } catch (err) {
      console.error("상품 등록 오류:", err);
      res.status(500).json({ message: "DB 저장 실패", error: err.message });
    }
  });

  // ✅ 상품 목록 페이징 조회
  app.get("/products", async (req, res) => {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const skip = (page - 1) * limit;

    try {
      const total = await db.collection("products").countDocuments();
      const products = await db
        .collection("products")
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      res.json({ products, total });
    } catch (e) {
      res.status(500).json({ message: "상품 조회 실패", error: e.message });
    }
  });

  // ✅ 상품 수정
  app.put("/products/:id", isAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    try {
      const product = await db
        .collection("products")
        .findOne({ _id: new ObjectId(id) });
      if (!product)
        return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

      // 새 이미지URL이 있고 기존과 다르면 기존 이미지 삭제
      if (update.imageURL && update.imageURL !== product.imageURL) {
        const oldKey = product.imageURL.split(".amazonaws.com/")[1];
        if (oldKey) {
          try {
            await s3.send(
              new DeleteObjectCommand({ Bucket: "yogojo", Key: oldKey })
            );
            console.log(`기존 이미지 삭제 성공: ${oldKey}`);
          } catch (delErr) {
            console.error("기존 이미지 삭제 실패:", delErr);
            // 삭제 실패해도 계속 진행 가능하게 함
          }
        }
      }

      // DB 업데이트
      const result = await db
        .collection("products")
        .updateOne({ _id: new ObjectId(id) }, { $set: update });

      res.json({ message: "수정 완료", result });
    } catch (err) {
      console.error("상품 수정 오류:", err);
      res.status(500).json({ message: "수정 실패", error: err.message });
    }
  });

  // ✅ 상품 삭제 + S3 이미지 삭제
  app.delete("/product/:id", isAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { imageURL } = req.body;
    const key = imageURL.split(".amazonaws.com/")[1];

    try {
      await db.collection("products").deleteOne({ _id: new ObjectId(id) });
      await s3.send(new DeleteObjectCommand({ Bucket: "yogojo", Key: key }));
      res.json({ message: "삭제 완료" });
    } catch (err) {
      res.status(500).json({ message: "삭제 오류", error: err.message });
    }
  });

  app.get("/products/all", async (req, res) => {
  try {
    const allProducts = await db.collection("products").find({}).toArray();
    res.json({ allProducts });
  } catch (e) {
    res.status(500).json({ message: "전체 상품 조회 실패", error: e.message });
  }
});

}

startServer();
