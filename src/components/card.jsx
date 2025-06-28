import { useState, useEffect } from 'react'
import {} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Navigate, Route, Routes } from 'react-router-dom';

function Card(){
  return (
  <div className='product-card'>
    <img src="/img/car1-1.png" alt="상품이미지" />
    <h4>title</h4>
    <p>explanation</p>
    <p>A-price</p>
    <span>50%</span><p>B-price</p>
    <span>g</span><p>리뷰(100)</p>
  </div>
  )
}

export default Card;
