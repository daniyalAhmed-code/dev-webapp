// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
/* eslint-disable */
import HeroSection from '../componentsNew/HeroSection'
// import HomeSlider from '../componentsNew/HomeSlider'

// mobx
import { observer } from 'mobx-react'

// fragments
import { fragments } from 'services/get-fragments'

// react-router
import { Link } from 'react-router-dom'
import GetStarted from 'componentsNew/GetStarted/'
import ExploreHome from 'componentsNew/ExploreHome/'

// semantic-ui
import { Segment, Container } from 'semantic-ui-react'

export const HomePage = observer(() => (
  <>
    <HeroSection />
    <ExploreHome />
    <GetStarted />
  </>
))

export default HomePage
