import {useState, useEffect} from "react";

function ProductsList() {

    let [title, setTitle] = useState("");
    let [explanation, setExplanation] = useState("");
    let [price, setPrice] = useState("");
    let [discountPrice, setDiscountPrice] = useState("");
    let [discountRate, setDiscountRate] = useState("")


  return (
    <>
      <div className="background">
        <form className="form-group">
          <div>
            <img src="" alt="" />
            <input type="file" />
          </div>
          <div className="form-group">
            <label htmlFor="">title :</label>
            <input type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }} />
          </div>
          <div className="form-group">
            <label htmlFor="">explanation :</label>
            <input type="text"
            value={explanation}
            onChange={(e) => {
              setExplanation(e.target.value);
            }} />
          </div>
          <div className="form-group">
            <label htmlFor="">price :</label>
            <input type="text"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }} />
          </div>
          <div className="form-group">
            <label htmlFor="">discount-price :</label>
            <input type="text"
            value={discountPrice}
            onChange={(e) => {
              setDiscountPrice(e.target.value);
            }} />
          </div>
          <div className="form-group">
            <label htmlFor="">discount-rate :</label>
            <input type="text"
            value={discountRate}
            onChange={(e) => {
              setDiscountRate(e.target.value);
            }} />
          </div>
          <button>등록하기</button>
        </form>
      </div>
    </>
  );
}
// review: [] good: rate-of-sales: hits:
export default ProductsList;
