import React from 'react'
import { FaBars, FaUserCircle } from "react-icons/fa"
// import { MdFormatAlignLeft } from 'react-icons/md'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './style.css'
// Navlogo
import navLogo from '../../assets/images/nav-logo.png'
import {
  isAdmin,
  isAuthenticated,
  isRegistered,
  logout,
  getCognitoUrl
} from '../../services/self'

// mobx
import { observer } from 'mobx-react'

// fragments
// import { fragments } from '../../services/get-fragments'
import ContactUs from '../../components/Feedback'

// services
import { store } from 'services/state'

/* eslint-disable */
const Navbar = observer(({ toggle, pathname }) => {
  const email = store.user && store.user.email
  //assigning location variable
    const location = useLocation();

  //destructuring pathname from location
  const { pathname: urlPathname } = location

  //Javascript split method to get the name of the path in array
  // const splitLocation = urlPathname.split("/")
  //  { (splitLocation[1] === "admin") || (splitLocation[1] === "apis") ? <div className="sideBarIcon" onClick={ toggle } >
  //          <MdFormatAlignLeft />
  //          </div> : "" }
  return (
    <>
      <nav className="main-nav">
        <div className="navbarContainer">
          <Link to="/" className="navLogoWrapper">
            <img src={navLogo} className="navLogoImg" />
          </Link>
          <div className="mobileBarIcon" onClick={toggle}>
            <FaBars />
          </div>

          <ul className="navMenu">
            <li className="navItem">
              <NavLink
                activeClassName="active"
                className="navLink"
                to="/getting-started"
              >
                Getting Started
              </NavLink>
            </li>
            <li className="navItem">
              <NavLink activeClassName="active" className="navLink" to="/apis/">
                {" "}
                APIs{" "}
              </NavLink>
            </li>
            <li className="navItem">
              <p className="navLink">{<ContactUs />}</p>
            </li>
          </ul>

          <ul className="navMenu">
            {isAuthenticated() ? (
              <>
                {isAdmin() && (
                  <li className="navItem">
                    <NavLink
                      activeClassName="active"
                      className="navLink"
                      to="/admin/apis"
                    >
                      Admin Panel
                    </NavLink>
                  </li>
                )}
                {isRegistered() && (
                  <>
                    {" "}
                    <li className="navItem">
                      <NavLink
                        activeClassName="active"
                        className="navLink"
                        to="/products"
                      >
                        Products
                      </NavLink>
                    </li>
                    <li className="navItem">
                      <span class="dropdown-container">
                        <FaUserCircle className="profileIcon" size={60} />
                        <div class="dropdown-content">
                          <NavLink
                            activeClassName="active"
                            className="dropdown-link"
                            to="/dashboard"
                          >
                            Dashboard
                          </NavLink>
                          <NavLink
                            activeClassName="active"
                            className="dropdown-link"
                            to="/userProfile"
                          >
                            Profile Page
                          </NavLink>
                        </div>
                      </span>
                    </li>
                  </>
                )}
                <li className="navBtn" onClick={logout}>
                  <span className="navBtnLink isPrimary"> Sign out </span>
                </li>
              </>
            ) : (
              <>
                <nav className="navBtn">
                  <a className="navBtnLink isPrimary" href={getCognitoUrl()}>
                    Sign In
                  </a>
                </nav>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  )
})

export default Navbar