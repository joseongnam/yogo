import { useState, useEffect } from 'react'
import './App.css'
import {} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const [page, setPage] = useState('one');
  const pageToIndex = { one: 0, two: 1, three: 2 };
  const translateX = `translateX(-${pageToIndex[page] * 100}vw)`;

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => {
        const nextIndex = (pageList.indexOf(prev) + 1) % pageList.length;
        return pageList[nextIndex];
      });
    }, 5000);
  
    return () => clearInterval(interval);
  }, [page]);

  return (
    <>
    <nav className='up-navbar'>
      <div className='event-nav'>
        <h7>👑이달의 리뷰왕! 6월 리뷰 이벤트 보러가기</h7>
      </div>
      <div className='main-nav'>
        <div className='box' style={{fontWeight: 'bold', fontSize : '30px'}}>YOGO</div>
        <div className='box'>
          <ul>
            <li>요고특가</li>
            <li>모든상품</li>
            <li>리뷰</li>
            <li>이벤트</li>
            <li>고객센터</li>
          </ul>
        </div>
        <div className='box' >
        <span>로그인</span>
        <span>회원가입</span>
          <span><FontAwesomeIcon icon={faUser} /></span>
          <span><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
          <span><FontAwesomeIcon icon={faBagShopping} /></span>
          </div>
      </div>
    </nav>
    <div className='main-container'>
  <div className='start-container' style={{ transform: translateX, transition: 'transform 0.5s' }}>
    {['one','two','three'].map((num, index) => (
      <div className='slide-box' key={index}>
        <img src={`/img/car${index+1}-1.png`} alt={`슬라이드${num}`} />
      </div>
    ))}
  </div>
  <div className="btn-container">
    {['one','two','three'].map((num, index) => (
      <button
        onClick={() => setPage(num)}
        key={index}
        className={page === num ? 'active' : ''}
      ></button>
    ))}
  </div>
</div>
      <div className='middle-container'></div>
      <div className='end-container'></div>
    </>
  )
}

export default App;
