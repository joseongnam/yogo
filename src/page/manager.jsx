import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import ProductsList from "./products-list";


function Manager() {
  const [userName, setUserName] = useState(null);
  const [files, setfiles] = useState(null); // 선택된 파일
  const [prefix, setPrefix] = useState("products"); // 기본 prefix
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
 

  // 파일 선택 핸들러
  const handleChange = (e) => {
    setfiles(e.target.files);
  };

  // 파일 업로드
  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("파일을 선택하세요");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("img", files[i]);
    }

    try {
      const res = await fetch(`/api/upload?prefix=${prefix}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error("서버 오류: " + text);
      }
      const data = await res.json();
      alert("업로드 완료");
      setfiles(null); // 파일 초기화
      fetchImages(); // 이미지 다시 불러오기
    } catch (err) {
      console.error("업로드 실패:", err);
    }
  };

  // ✅ 이미지 불러오기 (prefix가 변경될 때마다 자동 실행)
  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/image-list?prefix=${prefix}/`);
      const data = await res.json();
      setImages(data);
      setSelected([]);
    } catch (err) {
      console.error("이미지 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [prefix]);

  // 체크박스 선택 토글
  const toggleSelect = (url) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  // 다중 삭제
  const handleDelete = async () => {
    console.log("삭제 버튼 클릭됨");

    const keys = selected.map((url) => {
      const key = url.split(".com/")[1];
      console.log("삭제할 key:", key);
      return key;
    });

    console.log("keys 전체:", keys);

    try {
      const res = await fetch("/api/delete-multiple", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ keys }),
      });

      const result = await res.json();
      alert("삭제 완료");
      setImages((prev) => prev.filter((img) => !selected.includes(img)));
      setSelected([]);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 로그인된 유저 정보 디코딩
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
    <div style={{ padding: "1rem" }}>
      <h3>{userName}님, 안녕하세요!</h3>

      {/* 🔽 prefix 선택 */}
      <div style={{ marginBottom: "1rem" }}>
        <label>이미지 종류: </label>
        <select value={prefix} onChange={(e) => setPrefix(e.target.value)}>
          <option value="products">상품 이미지</option>
          <option value="ad">광고 이미지</option>
          <option value="user/123">유저 프로필</option>
          <option value="smallImage">작은이미지</option>
        </select>
      </div>

      {/* 🔼 이미지 업로드 */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="file"
          multiple
          onChange={handleChange}
          accept="/api/image/*"
        />
        <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>
          업로드
        </button>
      </div>

      {/* 이미지 리스트 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {images.map((imgUrl) => (
          <div key={imgUrl} style={{ width: "200px", textAlign: "center" }}>
            <input
              type="checkbox"
              checked={selected.includes(imgUrl)}
              onChange={() => toggleSelect(imgUrl)}
            />
            <img src={imgUrl} alt="preview" style={{ width: "100%" }} />
          </div>
        ))}
      </div>

      {/* 삭제 버튼 */}
      {selected.length > 0 && (
        <button
          onClick={handleDelete}
          style={{ marginTop: "1rem", background: "red", color: "white" }}
        >
          선택 삭제 ({selected.length}개)
        </button>
      )}
      {/* 상품 관리 컴포넌트 */}
      <ProductsList />
    </div>
  );
}

export default Manager;
