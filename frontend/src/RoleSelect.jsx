import React from 'react'
import { Link } from 'react-router-dom'

function RoleSelect() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FAF5FF]">

      <h1 className="text-3xl font-bold mb-8 text-[#1F1B2E]">
        Choose Your Role
      </h1>

      <div className="flex gap-6">

        <Link to='/user' className="px-6 py-3 rounded-xl bg-[#6D28D9] text-white">
          User
        </Link>

        <Link to='/vendor' className="px-6 py-3 rounded-xl bg-[#C4B5FD] text-[#1F1B2E]">
          Vendor
        </Link>

        <Link to='/admin' className="px-6 py-3 rounded-xl border border-[#6D28D9] text-[#6D28D9]">
          Admin
        </Link>

      </div>

    </div>
  )
}

export default RoleSelect