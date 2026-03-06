import React, { useEffect, useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearError, forgotPassword } from '../../../redux/slices/features/auth/authSlice'
import toast from 'react-hot-toast'

const ForgotPassword: React.FC= () => {

    const [email, setEmail] = useState('')
    // const [message, setMessage] = useState<string | null>(null)
    const { loading, error } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()

    const role = location.pathname.includes('candidate')? 'candidate' : 'company' 

    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])

    const handleSubmit = async(e: React.FormEvent) => {
          e.preventDefault()
          const result = await dispatch(forgotPassword({role, email}))
          if(forgotPassword.fulfilled.match(result)){
             toast.success('OTP has been sent to your email')
             setTimeout(() => navigate(`/${role}/verifyotp`, {state: {email,role, type: 'forgotpassword'}}), 2000)
          }
    }

  return (
    <AuthLayout title='Forgot Password' subtitle='Enter your email to reset your password'> 
     <div className='px-10 py-10 text-white '>
        <form onSubmit={handleSubmit} className='space-y-6 max-w-xl mx-auto'>
            <div className='space-y-2'>
                <label className='block text-sm font-medium'>Email</label>
                <input
                   type='email'
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder='name@gmail.com'
                   className='w-full bg-[#EDE0E0] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-[#E9C788] '
                   required
                />
            </div>
            {error && <p className='text-[#FBBEBE] text-sm'>{error}</p>}
            {/* {message && <p className='text-green-500 text-sm'>{message}</p>} */}

           <div className='flex justify-center'>
                <button 
                type='submit'
                disabled={loading}
                className='w-full bg-[#E9C788] hover:bg-[#6B4705] font-bold p-3 rounded-xl transition disabled:opacity-50'>
                    {loading? 'Sending...' : 'Send OTP'}
                </button>
            </div>
            <div className='text-center text-sm'>
                <Link to={`/${role}/login`} className='hover:underline'>
                   Back to login
                </Link>
            </div>
        </form>
     </div>
    </AuthLayout>
  )
}

export default ForgotPassword
