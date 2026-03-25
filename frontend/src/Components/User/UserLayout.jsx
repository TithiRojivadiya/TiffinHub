import React from 'react'
import UserHeader from './UserHeader'
import { Outlet } from 'react-router-dom'
import UserFooter from './UserFooter'

function UserLayout() {
  return (
    <>
        <UserHeader />
        <Outlet />
        <UserFooter />
    </>
  )
}

export default UserLayout