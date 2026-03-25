import React from 'react'
import '../../App.css'

function VendorFooter() {
  return (
    <footer className="mt-10 bg-[#FAF5FF] border-t border-[#C4B5FD]/30 py-4 px-6">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-[#1F1B2E]">

        <p>© 2026 TiffinHub Vendor</p>

        <p className="text-gray-500">Manage your tiffin business efficiently</p>

        <p className="text-gray-500">
          Support: vendor@tiffinhub.com
        </p>

      </div>

    </footer>
  )
}

export default VendorFooter