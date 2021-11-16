import React from 'react'
import './style.css'
import HeroImg from '../../assets/images/HeroImg.svg'

const ApiNotSignIn = ({ regLink }) => {
  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="hero-content mx-2 mb-3">
            <h1>Hi, You need to Sign In <span> to see the list of APIs' </span></h1>
            <p> Vantage Towers Developer portal contains lot's of useful APIs that you can plug to your web app, mobile app or software. Kindly sign up now to view our API list. </p>
            <div className="main-btn btn-hover" onClick={regLink}>Sign Up</div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="hero-img my-sm-3 mx-3">
            <img src={HeroImg} alt='hero' />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ApiNotSignIn
