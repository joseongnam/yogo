import { jwtDecode } from "jwt-decode";
import {useState, useEffect} from "react";

function MyPage() {
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);
      } catch (err) {
        console.error("토큰 디코딩 실패:", err);
      }
    }
  }, []);
  return (
    <>
      <span>{userName}하이</span>
    </>
  );
}

export default MyPage;
