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
        {[one,two,three].map((num, index)=>{
          <div className={`slide-box ${page === data.index ? data.index : ''}`} key={index}>
            <img src={`../public/img/car${index+1}-1.png`} alt={`슬라이드${num}`} />
            <div className="btn-container">
              {[one,two,three].map((data, i)=>{<button onclick={()=>{setPage({data.i})}}></button>})}

            </div>

          </div>
          })}
        </div>
      </div>
      <div className='middle-container'></div>
      <div className='end-container'></div>
    </div>
    </>
  )
}

export default App
