import Card from  '../components/card'

function SaleProducts(){
return(

<>
<div className='sale-div'>
  <h3>요고특가</h3>
  </div>
        <div className="sale-products" style={{marginTop: '0px'}}>
        <div className="product-row">
          {[...Array(8)].map((_, i)=>{
            return <Card key={i}/>
          } )}
          </div>
          </div>
  </>
  )}

export default SaleProducts