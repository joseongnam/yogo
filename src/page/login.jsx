import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();
  const { login } = useContext(AuthContext);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="top-bar">
          <button className="back-button" onClick={() => window.history.back()}>
            ←
          </button>
          <div className="spacer" />
          <button
            className="home-button"
            onClick={() => (window.location.href = "/")}
          >
            🏠
          </button>
        </div>

        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">
          아이디와 비밀번호 입력하기 귀찮으시죠? <br />
          1초 회원가입으로 간편하게 로그인 해보세요.
        </p>

        <button className="kakao-login">카카오 1초 로그인/회원가입</button>

        <div className="tab-buttons">
          <button className="tab-button tab-active">기존 회원</button>
          <button className="tab-button tab-inactive">비회원 배송조회</button>
        </div>

        <input
          className="login-input"
          type="text"
          placeholder="아이디 또는 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={saveId}
              onChange={() => setSaveId(!saveId)}
            />
            아이디 저장
          </label>
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            보안접속
          </label>
        </div>

        <button
          className="login-button"
          onClick={async (e) => {
            e.preventDefault();
            const loginData = {
              email: email,
              password: password,
            };
            try {
              const response = await fetch("/api/login/search", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
              });
              const result = await response.json();
              if (response.ok) {
                alert(result.message);
                navigate("/");
                login(result.token);
              } else {
                alert(result.message);
              }
            } catch (e) {
              alert("회원가입 정보가 없습니다" + e.message);
            }
          }}
        >
          로그인
        </button>

        <div className="links">
          <button>아이디 찾기</button> | <button>비밀번호 찾기</button> |{" "}
          <button>회원가입</button>
        </div>

        <button className="social-button naver">네이버 로그인</button>
        <button className="social-button facebook">Facebook으로 로그인</button>
        <button className="social-button google">
          <img src="https://www.google.com/favicon.ico" alt="Google" />
          Google 로그인
        </button>
      </div>
    </div>
  );
}

export default Login;
