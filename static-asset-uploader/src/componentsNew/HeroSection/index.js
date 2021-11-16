import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import { MdKeyboardArrowRight, MdArrowForward } from 'react-icons/md'

const HeroSection = () => {
  const [hover, setHover] = useState(false)

  const onHover = () => {
    setHover(!hover)
  }

  return (
    <div className="heroContainer">
      <div className="heroBg">
        <img className='imgBg' src='' alt ='' />
      </div>
      <div className="heroContent">
        <h1 className="heroH1"> VANTAGE TOWERS</h1>
        <div className="heroP">
          Welcome to vantage towers <b>developer portal.</b>
        </div>
        <div className="heroBtnWrapper">
          <Link to= "/getting-started" className="get_button" onMouseEnter={onHover} onMouseLeave={onHover}>
            Get started {hover ? <MdArrowForward className="arrowForward" /> : <MdKeyboardArrowRight className="arrowRight" />}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
