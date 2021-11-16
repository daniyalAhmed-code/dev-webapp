import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './style.css'
import {
  isAdmin,
  isAuthenticated,
  isRegistered,
  logout,
  getLoginRedirectUrl
} from '../../services/self'

import { cognitoDomain, cognitoClientId } from '../../services/api'

// mobx
import { observer } from 'mobx-react'

// services
import { store } from 'services/state'

// fragments
import { fragments } from '../../services/get-fragments'

function getCognitoUrl () {
  const redirectUri = getLoginRedirectUrl()
  return `${cognitoDomain}/login?response_type=token&client_id=${cognitoClientId}&redirect_uri=${redirectUri}`
}
/* eslint-disable */


const Sidebar = observer(({isOpen, toggle}) => {
  const email = store.user && store.user.email
  return (
    <aside className= "sidebarContainer" onClick={ toggle } style={ isOpen ? { opacity: '100%', top: '0'} : { opacity: '0', top: '-100%'}}>
      <div className="Icon" onClick= { toggle }>
        <FaTimes className="closeIcon" />
      </div>
      <div className= "sidebarWrapper">
        <ul className="sidebarMenu">
          <Link className="sidebarLink" to= "/">Home</Link>
          <Link className="sidebarLink" to= "/getting-started">{fragments.GettingStarted.title}</Link>
          <Link className="sidebarLink" to= "/apis"> {fragments.APIs.title} </Link>
           { isAuthenticated() ? <>
          { isAdmin() && 
              <Link className= "sidebarLink" to="admin/apis">Admin Panel</Link> }
          { isRegistered() && <>
              <Link className= "sidebarLink" to="/products">Products</Link>
              <Link className= "sidebarLink" to="/dashboard">My Dashboard</Link> </>}
              <div className= "sidebarAcc" onClick={ logout }>
               {email && <span>
                {email}<br />
                </span>}
                <span>
                  Sign out
                </span>
            </div>
          </> : <>
             <div className="sideBtnWrap">
                <a className="sidebarRoute" href={ getCognitoUrl()}> Sign In</a>
             </div>
          </>}
        </ul>
      </div>
    </aside>
  )
})

export default Sidebar
