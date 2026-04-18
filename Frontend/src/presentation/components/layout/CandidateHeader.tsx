import React, { useRef, useState } from 'react'
import HirixLogo from '../../../assets/images/Logo.jpeg'
import { LogOut, ChevronDown, Star } from 'lucide-react'
import { FaUserCircle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../redux/store'
import { logoutUser } from '../../../redux/slices/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'


const CandidateHeader: React.FC= () => {

    const [isDropDown, setIsDropDown] = useState(false)
    const dropDownRef = useRef(null)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    
    const handleSubmit = async() => {
        await dispatch(logoutUser())
        navigate('/')
    }

  return (
    <header className='bg-[#274E72] flex top-0 z-50 h-25 px-8 justify-between items-center sticky sm:px-6 lg:px-10'>
        <div className='flex items-center gap-2 mr-5'>
              <img src={HirixLogo} alt="hirix_logo" className='w-10 h-10 rounded-md'/>
           {/* <span className='font-irish text-white text-4xl font-bold tracking-[0.15em]'>HiriX</span> */}
        </div>

        <div className='hidden md:flex text-white flex-col px-5'>
           <h1 className='text-4xl font-bold py-2'>Prepare For Your Test</h1>
           <p className='text-md mb-2'>Prepare for your assessment with practice questions</p>
        </div> 

        <div className='flex items-center gap-6 right-0'>
            <button 
              onClick={() => navigate('/candidate/subscription')}
              className='flex items-center bg-white px-2 py-2 rounded-xl gap-2 font-bold'>
              <Star className='w-5 h-5 bg-black rounded-xl text-white' />
              Upgrade to Pro
            </button>

            <div className='relative' ref={dropDownRef}>
               <button
                  onClick={() => setIsDropDown(!isDropDown)}
                  className='flex items-center gap-3 p-1.5 pr-3  hover:text-[#021A30] rounded-2xl transition-all border border-transparent'
                >
                   <div className='w-10 h-10 rounded-full flex items-center justify-center'>
                      <FaUserCircle className='cursor-pointer text-2xl text-white hover:text-[#021A30]' />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white transition-transform hover:text-[#021A30] duration-200 ${isDropDown ? 'rotate-180' : ''}`} />
                </button>

                  {isDropDown && (
                        <div className="absolute right-0 mt-3 w-38 bg-white rounded-2xl shadow-xl border border-[#e2d8c3] py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={handleSubmit}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

export default CandidateHeader
