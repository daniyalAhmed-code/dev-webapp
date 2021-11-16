
import React from 'react'

// ProSidebar react
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

export default class PageWithSidebar extends React.Component {
  render () {
    const { sidebarContent, children, SidebarPusherProps } = this.props
    return (
      <Sidebar.Pushable
        as={Segment}
        style={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          border: 'none',
          margin: 0,
          borderRadius: 0,
          boxShadow: 'none'
        }}
      >
        <Sidebar
          as={Menu}
          inverted
          attached
          borderless
          vertical
          visible
          style={{
            margin: 0,
            borderRadius: 0,
            flex: '0 0 auto',
            position: 'relative',
            overflowY: 'scroll',
            width: '260px'
          }}
        >
          {sidebarContent}
        </Sidebar>
        <Sidebar.Pusher
          style={{
            marginLeft: 0,
            position: 'absolute',
            flex: '1 1 auto',
            height: '100%',
            overflow: 'auto',
            width: 'calc(100% - 260px)'
          }}
          {...SidebarPusherProps}
        >
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}
