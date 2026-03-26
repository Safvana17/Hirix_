import React, { useEffect, useRef, useState } from 'react'
// import { FiBell, FiSearch } from 'react-icons/fi'
import { Bell, ChevronDown, User, LogOut, Search } from 'lucide-react'
import { FaUserCircle } from 'react-icons/fa'
import HirixLogo from '../../../assets/images/Logo.jpeg'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../redux/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { logoutUser } from '../../../redux/slices/features/auth/authSlice'
import { ROUTES } from '../../../constants/routes'

const InternalHeader: React.FC= () => {
    const [isDropDown, setIsDropDown] = useState(false)
    const dropDownRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const location = useLocation()
    const role = location.pathname.includes('admin') ? 'Admin' : 'Company'

    const handleSubmit = async() => {
        await dispatch(logoutUser())
        if(role === 'Admin'){
            navigate(`/${role}/login`)
        }
        navigate('/')
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropDownRef.current && !dropDownRef.current.contains(event.target as Node)){
                setIsDropDown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

  return (
    <header className='w-full h-16 bg-[#f5f0e8] border-b border-white flex items-center justify-between px-8 sticky top-0 z-50'>
        
        <div className='flex items-center gap-2 mr-5'>
           <div>
              <img src={HirixLogo} alt="hirix_logo" className='w-10 h-10 rounded-md'/>
           </div>
           <span className='font-irish text-Black text-4xl font-bold tracking-[0.15em]'>HiriX</span>
        </div>

        <div className='flex-1 max-w-2xl px-8 hidden:md-block'>
            <div className='relative w-full max-w-xl'>
                <Search className='w-4 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'/>
                <input 
                    type="text" 
                    placeholder='Search companies, users, texts...' 
                    className='w-full pl-10 pr-4 py-2 rounded-full bg-[#EDE6DA] outline-none text-sm placeholder-gray-500 focus:ring-2 focus:ring-[#7c5a1a]/20'
                />
            </div>
        </div>

        <div className='flex items-center gap-6 right-0'>
            <button className="p-2.5 text-[#7c5a1a]/70 hover:text-[#7c5a1a] hover:bg-[#e9e2d5] rounded-xl transition-all relative">
                <Bell className="w-6 h-6" />
                {/* <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#f5f0e8]"></span> */}
            </button>
            <div className='relative' ref={dropDownRef}>
               <button
                  onClick={() => setIsDropDown(!isDropDown)}
                  className='flex items-center gap-3 p-1.5 pr-3 hover:bg-[#e9e2d5] rounded-2xl transition-all border border-transparent'
                >
                   <div className='w-10 h-10 bg-[#7c5a1a] rounded-full flex items-center justify-center text-white ring-2 ring-[#e2d8c3]'>
                      <FaUserCircle className='cursor-pointer text-2xl hover:text-black' />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#7c5a1a] transition-transform duration-200 ${isDropDown ? 'rotate-180' : ''}`} />
                </button>

                  {isDropDown && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-[#e2d8c3] py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                            </div>
                            <button
                                onClick={() => {
                                    /* Handle profile navigate */
                                    navigate(ROUTES.COMPANY.SETTINGS)
                                    setIsDropDown(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#f5f0e8] hover:text-[#7c5a1a] transition-colors"
                            >
                                <User className="w-4 h-4" />
                                My Profile
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div> 
                  )}
                </div>
            </div>
    </header>
  )
}

export default InternalHeader
