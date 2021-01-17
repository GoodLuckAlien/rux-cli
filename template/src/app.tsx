import React from 'react'
import './app.scss'
import { connect } from 'ruxjs'
const image = require('./assets/images/alien.jpg')

const index = (prop) => {
  const { number, dispatch } = prop
  return <div className="page" >
    <div className="content" >
      <img src={image} />
      <p className="title" >欢迎使用Rux! 一款集成redux和react-redux状态管理工具 。</p>
      <p className='title' > ⭐️ * {number}  </p>
      <div className="btns" >
        <button onClick={() => dispatch({ type: 'index.numberAdd' })} >⭐️ ++</button>
        <button onClick={() => dispatch({ type: 'index.numberDel' })} >⭐️ --</button>
        <button onClick={() => dispatch({ type: 'index.asyncnumberAdd' })} >async ⭐️ ++</button>
        <button onClick={() => dispatch({ type: 'index.resetNumber' })} > async reset ⭐️ </button>
      </div>
    </div>
  </div>
}

export default connect((store) => ({ number: store.index.number }))(index)