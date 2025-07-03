import { useState, useEffect } from "react";
import {} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

function Layout() {
  let navigate = useNavigate();

  return (
    <>
      <nav className="up-navbar">
        <div className="event-nav">
          <span>👑이달의 리뷰왕! 6월 리뷰 이벤트 보러가기</span>
        </div>
        <div className="main-nav">
          <div
            className="box"
            style={{ fontWeight: "bold", fontSize: "30px", cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            YOGO
          </div>
          <div className="box">
            <ul>
              <li
                onClick={() => {
                  navigate("/sale-products");
                }}
              >
                요고특가
              </li>
              <li
                onClick={() => {
                  navigate("/");
                }}
              >
                모든상품
              </li>
              <li
                onClick={() => {
                  navigate("/");
                }}
              >
                리뷰
              </li>
              <li
                onClick={() => {
                  navigate("/");
                }}
              >
                이벤트
              </li>
              <li
                onClick={() => {
                  navigate("/");
                }}
              >
                고객센터
              </li>
            </ul>
          </div>
          <div className="box">
            <span
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </span>
            <span>회원가입</span>
            <span>
              <FontAwesomeIcon icon={faUser} />
            </span>
            <span>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <span>
              <FontAwesomeIcon icon={faBagShopping} />
            </span>
          </div>
        </div>
      </nav>
      <Outlet />
      <div
        style={{
          borderBottom: "1px solid rgb(233, 233, 233)",
          borderTop: "1px solid rgb(233, 233, 233)",
          height: "300px",
        }}
      >
        <div className="information">
          <div style={{ flex: 3 }}>
            <h1>YOGO</h1>
            <p>상호명 : 글로우업리즈(주)</p>
            <p>주소 : 서울 성동구 연무장19길 6(성수동2가)</p>
            <p>사업자등록번호 : 000-00-00000</p>
            <p>개인정보보호책임자 : 조성남</p>
          </div>
          <div style={{ flex: 1 }}>
            <h5>고객센터</h5>
            <p>000-0000-000000-00</p>
            <button>채널톡 바로가기</button>
            <p>주중 09:00~18:00</p>
            <p>주말 및 공휴일 </p>
          </div>
          <div style={{ flex: 1 }}>
            <h5>무통장 입금 계좌정보</h5>
            <p></p>
            <p></p>
            <p>입금시 주문자명 기재</p>
          </div>
        </div>
      </div>
      <nav className="last">
        <ul>
          <li>개인정보처리방침</li>
          <li>이용약관</li>
          <li>이용안내</li>
        </ul>
      </nav>
    </>
  );
}

export default Layout;