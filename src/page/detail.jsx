import ProductDetail from "../components/product-detail";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Detail() {
  const [product, setProduct] = useState();
  const { id } = useParams();

  useEffect(() => {
    const products = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("이미지 불러오기 실패:", err);
      }
    };
    products();
  }, [id]);

  if (!product) return <div>로딩 중...</div>;

  return (
    <>
      <div className="background">
        <div className="registration-container">
          <div className="product-img">
            <div className="detail-slide">
              <img src={product.imageURL} alt="상품이미지" />
            </div>
            <div>
              <img src="" alt="" />
              <img src="" alt="" />
              <img src="" alt="" />
              <img src="" alt="" />
              <img src="" alt="" />
              <img src="" alt="" />
            </div>
          </div>
          <ProductDetail />
        </div>
        <div className="purchase"></div>
      </div>
    </>
  );
}

export default Detail;
