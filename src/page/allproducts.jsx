import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card.jsx";
import axios from "axios";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const DbProducts = async () => {
      try {
        const res = await axios.get("/api/products/all");
        setProducts(res.data.allProducts);
      } catch (err) {
        console.error("이미지 불러오기 실패:", err);
      }
    };

    DbProducts();

  }, []);

  return (
    <>
      <div className="sale-div">
        <h3 style={{ fontWeight: "bold" }}>모든상품</h3>
      </div>
      <div className="sale-products" style={{ marginTop: "0px" }}>
        <div className="product-row">
          {products.map((data, i) => {
            return (
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
            );
          })}
        </div>
      </div>
    </>
  );
}

export default AllProducts;
