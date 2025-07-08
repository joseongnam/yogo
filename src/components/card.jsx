import { useState, useEffect } from 'react'
import {} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Navigate, Route, Routes } from 'react-router-dom';

function Card({title, explanation, price, discountRate, discountPrice, imageURL})   {
  return (
  <div className='product-card'>
    <img src={imageURL} alt="상품이미지" />
    <h4>제목 : {title}</h4>
    <p>설명 : {explanation}</p>
    <p>가격 : {price}원</p>
    <span>할인율 : {discountRate}%</span><p>할인가 : {discountPrice}원</p>
    <span>g</span><p>리뷰(100)</p>
  </div>
  )
}

export default Card;
