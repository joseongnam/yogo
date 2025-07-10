import Card from  '../components/card'
import { useEffect, useState } from "react";
import axios from "axios";

function SaleProducts(){

  let [saleProducts, setSaleProducts] = useState([]);

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

return(

<>
<div className='sale-div'>
  <h3>요고특가</h3>
  </div>
        <div className="sale-products" style={{marginTop: '0px'}}>
        <div className="product-row">
          {saleProducts.map((data, i)=>{
            return <Card 
                          key={i}
              title={data.title}
              explanation={data.explanation}
              price={data.price}
              discount={data.discount}
              discountRate={data.discountRate}
              discountPrice={data.discountPrice}
              imageURL={data.imageURL}
              data={data}/>
          } )}
          </div>
          </div>
  </>
  )}

export default SaleProducts