import { useState } from "react";

function ProductsList() {
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 1. 이미지 S3 업로드
      const formData = new FormData();
      formData.append("img", imageFile);

      const uploadResponse = await fetch("/api/upload?prefix=products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Bearer 대소문자 주의
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text(); // ✅ body 1회만 읽음
        alert("이미지 업로드 실패: " + errorText);
        return;
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.location?.[0];

      if (!imageUrl) {
        alert("업로드 성공했지만 이미지 URL이 없습니다.");
        return;
      }

      // 2. 상품 데이터 전송
      const productData = {
        title,
        explanation,
        price,
        discountPrice,
        discountRate,
        imageURL: imageUrl,
      };

      const saveResponse = await fetch("/api/productRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ 여기도 필요할 수 있음
        },
        body: JSON.stringify(productData),
      });

      const result = await saveResponse.json();

      if (!saveResponse.ok) {
        alert("상품 등록 실패: " + (result.message || "오류 발생"));
        return;
      }

      alert(result.message || "상품 등록 완료!");
    } catch (err) {
      console.error("등록 실패:", err);
      alert("등록 중 오류 발생: " + err.message);
    }
  };

  return (
    <div className="background">
      <form className="form-group" onSubmit={handleSubmit}>
        <div>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="미리보기"
              style={{ width: "300px", border: "1px solid #ccc" }}
            />
          )}
          <label>이미지 업로드</label>
          <br />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label>상품명 (title)</label>
          <input
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>설명 (explanation)</label>
          <input
            placeholder="explanation"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>가격 (price)</label>
          <input
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>할인가 (discount price)</label>
          <input
            placeholder="discount price"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>할인율 (%) (discount rate)</label>
          <input
            placeholder="discount rate"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
          />
        </div>

        <button type="submit">상품 등록</button>
      </form>
    </div>
  );
}

export default ProductsList;
