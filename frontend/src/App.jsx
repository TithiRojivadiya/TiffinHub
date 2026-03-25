import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Link, Route, RouterProvider, Routes } from 'react-router-dom'
import './App.css'
import VendorLayout from './Components/Vendor/VendorLayout.jsx'
import UserLayout from './Components/User/UserLayout.jsx'
import AdminLayout from './Components/Admin/AdminLayout.jsx'
import Layout from './Layout'
import UserDashboard from './Components/User/UserDashboard.jsx'
import UserVendors from './Components/User/UserVendors.jsx'
import UserSubscriptions from './Components/User/UserSubscriptions.jsx'
import UserProfile from './Components/User/UserProfile.jsx'
import VendorDashboard from './Components/Vendor/VendorDashboard.jsx'
import VendorMenu from './Components/Vendor/VendorMenu.jsx'
import VendorDeliveries from './Components/Vendor/VendorDeliveries.jsx'
import VendorProfile from './Components/Vendor/VendorProfile.jsx'
import AdminDashboard from './Components/Admin/AdminDashboard.jsx'
import AdminReports from './Components/Admin/AdminReports.jsx'
import AdminUsers from './Components/Admin/AdminUsers.jsx'
import AdminVendors from './Components/Admin/AdminVendors.jsx'
import RoleSelect from './RoleSelect.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(

      <Route path='/' element={<Layout />} >

        <Route index element={<RoleSelect />} />

        <Route path='user' element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path='dashboard' element={<UserDashboard/>} />
          <Route path='vendors' element={<UserVendors />} />
          <Route path='subscriptions' element={<UserSubscriptions />} />
          <Route path='profile' element={<UserProfile />} />
        </Route>

        <Route path='vendor' element={<VendorLayout />}>
          <Route index element={<VendorDashboard/>} />
          <Route path='dashboard' element={<VendorDashboard/>} />
          <Route path='menu' element={<VendorMenu />} />
          <Route path='deliveries' element={<VendorDeliveries />} />
          <Route path='profile' element={<VendorProfile />} />
        </Route>

        <Route path='admin' element={<AdminLayout/>}>
          <Route index element={<AdminDashboard/>} />
          <Route path='dashboard' element={<AdminDashboard/>} />
          <Route path='vendors' element={<AdminVendors />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='reports' element={<AdminReports />} />
        </Route>

      </Route>

  )
)

function App() {
  

  return (
    <>

      <RouterProvider router={router} />
      
    </>
  )
}

export default App
