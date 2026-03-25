import React from 'react'
import VendorHeader from './VendorHeader'
import { Outlet } from 'react-router-dom'
import VendorFooter from './VendorFooter'

function VendorLayout() {
  return (
    <>
        <VendorHeader />
        <Outlet />
        <VendorFooter />
    </>
  )
}

export default VendorLayout