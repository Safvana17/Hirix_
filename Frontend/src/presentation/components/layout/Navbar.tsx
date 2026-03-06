import React from 'react'
import { Link } from 'react-router-dom'
import HirixLogo from '../../../assets/images/Logo.jpeg'

const Navbar: React.FC= () => {
  return (
    <nav className='absolute top-0 left-0 w-full z-50 flex justify-between items-center p-4 px-12 bg-transparent border-b border-white'>
      <div className='flex items-center gap-2 mr-5'>

        <div className='flex items-center gap-2 mr-5'>
           <div>
            <img src={HirixLogo} alt="hirix_logo" className='w-10 h-10 rounded-md'/>
           </div>
           <span className='font-irish text-white text-4xl font-bold tracking-[0.15em]'>HiriX</span>
        </div>

        <div className="w-px h-8 bg-white mr-5"></div>

        <div className='ml-4 hidden md:flex space-x-8'>
          <Link to="/whyhirix" className='text-gray-300 hover:text-white transition text-md font-medium'>why Hirix</Link>
        </div>

      </div>

      <div className='flex items-center space-x-6 right-3'>
          <Link to="/login" className='text-white hover:text-gray-300 transition text-sm font-medium'>Login</Link>
          <Link to="/signup" className='px-6 py-2 bg-[#9A6605] text-white rounded-lg hover:bg-[#6B4705] transition text-sm font-bold shadow-lg shadow-amber-900/20'>Sign Up</Link>
      </div>
    </nav>
  )
}

export default Navbar
