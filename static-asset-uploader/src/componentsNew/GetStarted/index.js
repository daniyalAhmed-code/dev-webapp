import React from 'react'
import { FaUserCheck, FaTags, FaUserShield, FaSignal } from 'react-icons/fa'

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

import './style.css'

const GetStarted = () => {
  return (
    <section className="get-started bg-light py-4">
      <div className="container px-4">
        <div className="row align-items-center text-center justify-content-center">
          <h1 className="title py-3"> Get Started </h1>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="single-step text-center">
                <div className="row justify-content-center">
                  <div className="step-icon mb-3">
                    <FaUserCheck />
                  </div>
                </div>
                <div className="step-cap my-2">
                  <h5>Create an account and subscribe to APIs</h5>
                  <p>To use any of our APIs you must create a developer account. A developer account provides an API Key for accessing our APIs, a playground for testing our APIs, and API usage metrics. Create or sign in using the buttons in the top right.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="single-step text-center">
                <div className="row justify-content-center">
                  <div className="step-icon mb-3">
                    <FaTags />
                  </div>
                </div>
                <div className="step-cap my-2">
                  <h5>Subscribe to APIs</h5>
                  <p>After you create a new account, you will have a new API Key but it won't be linked to any of our APIs. To activate it for a particular API, navigate to APIs and find the API you want. Click <small>subscribe</small>. Your API Key is now subscribed to the API and you can make calls to its methods.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="single-step text-center">
                <div className="row justify-content-center">
                  <div className="step-icon mb-3">
                    <FaUserShield />
                  </div>
                </div>
                <div className="step-cap my-2">
                  <h5>Try Out the API</h5>
                  <p>We know that figuring out how to use APIs can be hard. Use the “Try it out!” feature to get examples of the request and response shapes of our APIs. This makes an API call to the backend service using your API Key and provides a sample curl request with all necessary input parameters and the real response.If you need your API Key for any reason, you can always find it on your dashboard after logging in.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="single-step text-center">
                <div className="row justify-content-center">
                  <div className="step-icon mb-3">
                    <FaSignal/>
                  </div>
                </div>
                <div className="step-cap my-2">
                  <h5>Monitor your usage</h5>
                  <p>Typically each API has a usage limit set for each API Key. As you scale up your usage of the APIs, you can monitor your usage towards the limits on your dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default GetStarted
