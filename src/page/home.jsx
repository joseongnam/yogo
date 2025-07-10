import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card.jsx";
import axios from "axios";

function Home() {
  const [page, setPage] = useState(0); // 현재 슬라이드 인덱스
  const [adImages, setAdImages] = useState([]);
  const navigate = useNavigate();
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/image-list?prefix=ad/");
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        setAdImages(data);
      } catch (err) {
        console.error("이미지 불러오기 실패:", err);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (adImages.length === 0) return; // 이미지 없으면 동작하지 않도록

    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % adImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [adImages]);

  useEffect(() => {
    const saleProducts = async () => {
      try {
        const res = await axios.get("/api/saleProducts");
        setSaleProducts(res.data.saleProducts);
      } catch (err) {
        console.log("에러남 :", err);
      }
    };
    saleProducts();
  }, []);
  return (
    <>
      <div className="main-container">
        <div
          className="start-container"
          style={{
            transform: `translateX(-${page * 100}vw)`,
            transition: "transform 0.5s",
          }}
        >
          {adImages.map((imgUrl, index) => (
            <div className="slide-box" key={index}>
              <img src={imgUrl} alt={`슬라이드${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="btn-container">
          {adImages.map((_, index) => (
            <button
              key={index}
              className={page === index ? "active" : ""}
              onClick={() => setPage(index)}
            ></button>
          ))}
        </div>

        <div
          className="arrow left"
          onClick={() =>
            setPage((prev) => (prev - 1 + adImages.length) % adImages.length)
          }
        >
          &lt;
        </div>

        <div
          className="arrow right"
          onClick={() => setPage((prev) => (prev + 1) % adImages.length)}
        >
          &gt;
        </div>
      </div>

      <div className="sale-products">
        <h1>요고특가</h1>
        <span>득템은 타이밍, 기회는 지금뿐!</span>
        <div className="product-row">
          {saleProducts.map((data, i) => (
            <Card
              key={i}
              title={data.title}
              explanation={data.explanation}
              price={data.price}
              discount={data.discount}
              discountRate={data.discountRate}
              discountPrice={data.discountPrice}
              imageURL={data.imageURL}
              data={data}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="more-btn"
            onClick={() => {
              navigate("/sale-products");
            }}
          >
            특가상품 더보기 &gt;
          </button>
        </div>
      </div>

      <div className="new-products"></div>
    </>
  );
}

export default Home;
