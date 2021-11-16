// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react'
import { Link } from 'react-router-dom'

// css
import './styles.css'
// icon
import { FaBars } from 'react-icons/fa'

import {
  isAdmin,
  isAuthenticated,
  isRegistered,
  logout,
  getLoginRedirectUrl
} from 'services/self'

import { cognitoDomain, cognitoClientId } from '../../services/api'

// mobx
import { observer } from 'mobx-react'

// fragments
import { fragments } from '../../services/get-fragments'

// components
// import MenuLink from 'components/MenuLink'
import { store } from 'services/state'

// Navlogo
import navLogo from '../../assets/images/nav-logo.png'

function getCognitoUrl (type) {
  const redirectUri = getLoginRedirectUrl()
  return `${cognitoDomain}/${type}?response_type=token&client_id=${cognitoClientId}&redirect_uri=${redirectUri}`
}

const NavBarnew = observer(({ toggle }) => {
  const email = store.user && store.user.email
  return <nav className='main-nav'>
    <div className='main-nav__container'>
      <Link className='main-nav__logo' to='/' >
        <img src={navLogo} />
      </Link>
      <div className='MobileIcon' onClick={toggle}>
        <FaBars />
      </div>
      <ul className='main-nav__list'>
        <li className='main-nav__item'>
          <Link to="/getting-started" className="main-nav__link">{fragments.GettingStarted.title}</Link>
        </li>
        <li className='main-nav__item'>
          <Link to="/apis" className="main-nav__link">{fragments.APIs.title}</Link>
        </li>
      </ul>

      <ul className='main-nav__list--second'>
        {isAuthenticated() ? <>
          {isAdmin() && <li className="main-nav__item">
            <Link to="admin/apis" className="main-nav__link">Admin Panel</Link>
          </li>}
          {isRegistered() && <li className="main-nav__item">
            <Link to="/dashboard" className="main-nav__link">My Dashboard</Link>
          </li>}
          <li className="main-nav__item" onClick={logout}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContents: 'center' }}>
              {email && <span>
                {email}
              </span>}
              <span>
                Sign out
              </span>
            </div>
          </li>
        </> : <>
          <li className="main-nav__item">
            <a href={getCognitoUrl('login')} className="main-nav__link">Sign In</a>
          </li>

          <li className="main-nav__item">
            <a href={getCognitoUrl()} className="main-nav__link main-nav__link--btn">Register</a>
          </li>

        </>}
      </ul>
    </div>
  </nav>
})

export default NavBarnew
