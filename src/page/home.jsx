import { useState, useEffect } from 'react'
import {} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Card from '../components/card.jsx'

function Home(){

      const [page, setPage] = useState('one');
  const pageList = ['one', 'two', 'three'];
  const pageIndex = pageList.indexOf(page);
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (pageIndex + 1) % pageList.length;
      setPage(pageList[nextIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, [page]);

  return(
    <>
    
      <div className="main-container">
        {/* 양옆 화살표 버튼 */}
        <div
          className="start-container"
          style={{
            transform: `translateX(-${pageIndex * 100}vw)`,
            transition: 'transform 0.5s',
          }}
        >
          {pageList.map((_, index) => (
            <div className="slide-box" key={index}>
              <img src={`/img/car${index + 1}-1.png`} alt={`슬라이드${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="btn-container">
          {pageList.map((num, index) => (
            <button
              onClick={() => setPage(num)}
              key={index}
              className={page === num ? 'active' : ''}
            ></button>
          ))}
        </div>

        {/* 화살표 버튼 */}
        <div className="arrow left" onClick={() => {
          const prevIndex = (pageIndex - 1 + pageList.length) % pageList.length;
          setPage(pageList[prevIndex]);
        }}>&lt;</div>

        <div className="arrow right" onClick={() => {
          const nextIndex = (pageIndex + 1) % pageList.length;
          setPage(pageList[nextIndex]);
        }}>&gt;</div>
      </div>
      <div className="sale-products">
        <h1>요고특가</h1><span>득템은 타이밍, 기회는 지금뿐!</span>
        <div className="product-row">
          {[...Array(8)].map((_, i)=>{
            return <Card key={i}/>
          } )}
          </div>
          <div style={{display : 'flex', justifyContent : 'center' }}>
        <button className='more-btn' onClick={()=>{navigate('/sale-products')}}>특가상품 더보기 &gt;</button>
        </div>
      </div>
      <div className="new-products"></div>
    </>
  )
}

export default Home