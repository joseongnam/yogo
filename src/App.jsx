import { useState } from 'react'
import './App.css'
import {} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
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
        <div className='box'>
        <span>로그인</span>
        <span>회원가입</span>
          <span><FontAwesomeIcon icon={faBars} /></span>
          <span></span>
          <span><FontAwesomeIcon icon={faBagShopping} /></span>
          </div>
      </div>
    </nav>
    <div className='main-container'>
      <div className='start-container'></div>
      <div className='middle-container'></div>
      <div className='end-container'></div>
    </div>
    </>
  )
}

export default App
