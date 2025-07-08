import "./App.css";
import {} from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./page/home.jsx";
import SaleProducts from "./page/sale-products.jsx";
import Layout from "./page/layout.jsx";
import Login from "./page/login.jsx";
import Join from "./page/join.jsx";
import Manager from "./page/manager.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import Mypage from "./page/mypage.jsx"
import Detail from "./page/detail.jsx"
import AdminRoute from "./components/AdminRoute.jsx"
import AllProducts from "./page/allproducts.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={
            <AdminRoute>
            <Manager />
            </AdminRoute>
            }></Route>
          <Route path="/mypage" element={<Mypage />}></Route>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sale-products" element={<SaleProducts />} />
            <Route path="/join" element={<Join />} />
            <Route path="/detail" element={<Detail />}></Route>
            <Route path="/allproducts" element={<AllProducts/>}></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
