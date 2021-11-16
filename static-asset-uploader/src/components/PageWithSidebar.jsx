// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'

// semantic-ui
import { Button, Icon, Sidebar, Segment, Responsive, Menu } from 'semantic-ui-react'

import _ from 'lodash'

/* eslint-disable */
export default withCollapsibleMobileSidebar(class PageWithSidebar extends React.Component {
  render() {
    const {sidebarContent, children, SidebarPusherProps} = this.props

    // injected props from withCollapsibleMobileSidebar HOC
    const {isSidebarCollapsed, isMobileScreenResolution, toggleSidebar} = this.props
    const expansionButtonWidth = "48px"
    const sidebarWidth = "260px"
    const contentWidth = isMobileScreenResolution ? `calc(100% - ${expansionButtonWidth})` : `calc(100% - ${sidebarWidth})`
    const animation = isMobileScreenResolution ? "overlay" : "push"
    const contentLeftMargin = isMobileScreenResolution ? expansionButtonWidth : 0
    const expansionButtonLeftMargin = isSidebarCollapsed ? `-${sidebarWidth}` : 0
    const transition = "500ms ease"
    return (
      <div style={{minHeight: '100vh'}}>
        <Sidebar.Pushable
          as={Segment}
          style={{ display: "flex", flex: "1 1 auto", overflow: "auto", border: "none", margin: 0, borderRadius: 0, boxShadow: "none"}}>
          <Sidebar
            as={Menu}
            inverted
            attached
            borderless
            vertical
            style={{ margin: 0, borderRadius: 0, flex: "0 0 auto", position: "sticky", overflowY: "scroll", width: sidebarWidth }}
            visible={!isSidebarCollapsed}
            animation={animation}>
            {sidebarContent}
          </Sidebar>
          {
            isMobileScreenResolution &&
              <SidebarExpansionButton
                onClick={toggleSidebar}
                expanded={!isSidebarCollapsed}
                style={{ marginLeft: expansionButtonLeftMargin, width: expansionButtonWidth, transition }}
              />
          }
          <Sidebar.Pusher
            dimmed={isMobileScreenResolution && !isSidebarCollapsed}
            style={{ marginLeft: contentLeftMargin, position: "absolute", flex: "1 1 auto", overflow: 'auto', width: contentWidth, transition }}
            {...SidebarPusherProps}>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
})

function withCollapsibleMobileSidebar(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isSidebarCollapsed: false,
        isMobileScreenResolution: false
      }
    }

    componentDidMount() {
      this.checkMobileScreenResolution()
      window.addEventListener('resize', this.debouncedResizeHandler)
    }

    checkMobileScreenResolution = () => {
      const isMobileScreenResolution = this.isMobileScreenResolution()
      this.setState({isSidebarCollapsed: isMobileScreenResolution, isMobileScreenResolution: isMobileScreenResolution})

      if (this.isMobileScreenResolution()) {
        this.setState({isSidebarCollapsed: true, isMobileScreenResolution: true})
      } else {
        this.setState({isSidebarCollapsed: false, isMobileScreenResolution: false})
      }
    }

    debouncedResizeHandler = _.debounce(this.checkMobileScreenResolution, 500)

    isMobileScreenResolution() {
      const {minWidth, maxWidth} = Responsive.onlyMobile
      // Collapse sidebar on mobile device screen resolutions
      return window.innerWidth >= minWidth && window.innerWidth <= maxWidth
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.debouncedResizeHandler)
    }

    toggleSidebar = () => {
      this.setState(state => ({isSidebarCollapsed: !state.isSidebarCollapsed}))
    }

    render() {
      return (
        <WrappedComponent
          isSidebarCollapsed={this.state.isSidebarCollapsed}
          toggleSidebar={this.toggleSidebar}
          isMobileScreenResolution={this.state.isMobileScreenResolution}
          {...this.props}
        />
      );
    }
  };
}

function SidebarExpansionButton({onClick, expanded, style}) {
  return (
      <Button
        secondary
        size="large"
        onClick={onClick}
        title="Expand Sidebar"
        style={{zIndex: 3, borderRadius: 0, height: "100vh", position: "sticky", ...style}}>
          <Icon
            name={`chevron ${expanded ? "left" : "right"}`}
            style={{margin: 0, padding: 0, width: 0, height: 0}}
          />
      </Button>
  )
}