import { useState } from 'react'
import './App.css'
import {} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState('')

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
          <span><FontAwesomeIcon icon={faUser} /></span>
          <span><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
          <span><FontAwesomeIcon icon={faBagShopping} /></span>
          </div>
      </div>
    </nav>
    <div className='main-container'>
      <div className='start-container'>
        <div className={`slide-box ${page === 'one' ? 'one' : ''}`}>
          <img src="../public/img/car1-1.png" alt="" />
          <div className='btn-container'>
            <button onClick={()=>{setPage('one')}}></button>
            <button onClick={()=>{setPage('two')}}></button>
            <button onClick={()=>{setPage('three')}}></button>
          </div>
        </div>
        <div className={`slide-box ${page === 'two' ? 'two' : ''}`}>
          <img src="../public/img/car2-1.png" alt="" />
          <div className='btn-container'>
            <button onClick={()=>{setPage('one')}}></button>
            <button onClick={()=>{setPage('two')}}></button>
            <button onClick={()=>{setPage('three')}}></button>
          </div>
        </div>
        <div className={`slide-box ${page === 'three' ? 'three' : ''}`}>
          <img src="../public/img/car3-1.png" alt="" />
          <div className='btn-container'>
            <button onClick={()=>{setPage('one')}}></button>
            <button onClick={()=>{setPage('two')}}></button>
            <button onClick={()=>{setPage('three')}}></button>
          </div>
        </div>
      </div>
      <div className='middle-container'></div>
      <div className='end-container'></div>
    </div>
    </>
  )
}

export default App
