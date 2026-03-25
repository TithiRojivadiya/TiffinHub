import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../App.css'

function VendorHeader() {
  return (
    <ul className="flex items-center justify-center gap-8 px-8 py-4 bg-[#FAF5FF]/80 backdrop-blur-md shadow-md border-b border-[#C4B5FD]/40">

      <li className="relative group">
        <NavLink to='/vendor/dashboard'
          className={({ isActive }) =>
            `text-sm font-medium tracking-wide transition-all duration-300 ${
              isActive ? "text-[#6D28D9]" : "text-[#1F1B2E]"
            }`
          }>
          Dashboard
        </NavLink>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#6D28D9] transition-all duration-300 group-hover:w-full"></span>
      </li>

      <li className="relative group">
        <NavLink to='/vendor/menu'
          className={({ isActive }) =>
            `text-sm font-medium tracking-wide transition-all duration-300 ${
              isActive ? "text-[#6D28D9]" : "text-[#1F1B2E]"
            }`
          }>
          Menu
        </NavLink>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#6D28D9] transition-all duration-300 group-hover:w-full"></span>
      </li>

      <li className="relative group">
        <NavLink to='/vendor/deliveries'
          className={({ isActive }) =>
            `text-sm font-medium tracking-wide transition-all duration-300 ${
              isActive ? "text-[#6D28D9]" : "text-[#1F1B2E]"
            }`
          }>
          Deliveries
        </NavLink>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#6D28D9] transition-all duration-300 group-hover:w-full"></span>
      </li>

      <li className="relative group">
        <NavLink to='/vendor/profile'
          className={({ isActive }) =>
            `text-sm font-medium tracking-wide transition-all duration-300 ${
              isActive ? "text-[#6D28D9]" : "text-[#1F1B2E]"
            }`
          }>
          Profile
        </NavLink>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#6D28D9] transition-all duration-300 group-hover:w-full"></span>
      </li>

      <li className="ml-auto">
        <NavLink
          to="/"
          className="px-4 py-1.5 rounded-lg border border-[#6D28D9] text-[#6D28D9] text-sm font-medium transition-all duration-300 hover:bg-[#6D28D9] hover:text-white"
        >
          Logout
        </NavLink>
      </li>

    </ul>
  )
}

export default VendorHeader