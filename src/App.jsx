import { useState, useEffect } from "react";
import "./App.css";
import {} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./page/home.jsx";
import SaleProducts from "./page/sale-products.jsx";
import Layout from "./page/layout.jsx";
import Login from "./page/login.jsx";
import Join from "./page/join.jsx";
import MyPage from "./page/mypage.jsx";
import { AuthProvider } from "./AuthContext.jsx";

function App() {
  let navigate = useNavigate();

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />}></Route>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sale-products" element={<SaleProducts />} />
            <Route path="/join" element={<Join />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
