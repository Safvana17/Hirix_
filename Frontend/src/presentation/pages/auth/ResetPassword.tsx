import React, { useEffect, useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'
import ForgotPasswordImage from '../../../assets/images/forgotpassword.jpg'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { clearError, resetPassword } from '../../../redux/slices/features/auth/authSlice'
import { resetPasswordSchema } from '../../../lib/validation/authValidation'
import { ZodError } from 'zod'
import toast from 'react-hot-toast'

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading } = useSelector((state: RootState) => state.auth)

  const email = location.state?.email
  const otp = location.state?.otp
  const role = location.pathname.includes('candidate') ? 'candidate' : 'company'

  const [formData, setFormData] = useState({
    email: email,
    otp: otp,
    newPassword: '',
    confirmPassword: '' 
  })
  const [localError, setLocalError] = useState<Record<string, string>>({})

  useEffect(() => {
    if(!email || !otp){
      navigate(`/${role}/login`)
    }
    return () => {
      dispatch(clearError())
    }
  })

  const validate = () => {
    try {
      resetPasswordSchema.parse(formData)
      setLocalError({})
      return true

    } catch (error) {
      if(error instanceof ZodError){
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
        const field = issue.path[0] 
        if(typeof field === 'string' ||typeof field === 'number')
          errors[field] = issue.message
        })
        setLocalError(errors)
      }
      return false
    }
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    if(!validate()) return
    if(!formData.email || !formData.otp){
      toast.error('Session Expired, please try again')
      navigate(`/${role}/forgotpassword`)
      return
    }

    console.log('email: ', formData.email)
    console.log('otp: ', formData.otp)
    const result = await dispatch(resetPassword({role, email: formData.email, otp: formData.otp, newPassword: formData.newPassword, confirmPassword: formData.confirmPassword}))
    if(resetPassword.fulfilled.match(result)){
      toast('Your password reset successful. PLease login to continue.')
      navigate(`/login`)
    }
  }

  return (
    <AuthLayout title='Reset Passwrd' subtitle='Enter your nw password'>
      <div className='grid grid-cols-1 md:grid-cols-2 min-h-[600px]'>
       <div className='relative h-full'>
         <img src={ForgotPasswordImage} alt="Auth image" className='w-full h-full object-cover'/>
         <div className="absolute inset-0 bg-[#9A6605] opacity-50" />
       </div>
        <div className='bg-[#9A6605] p-8 md:p-12 flex flex-col justify-center'>
          <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm text-white font-medium mb-1'>New Password</label>
                <input 
                    type='password'
                    placeholder='••••••••'
                    required
                    className='w-full bg-[#EDE0E0] rounded-xl px-4 py-3 text-black outline-none'
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value }) }
                />
                {localError.newPassword && <p className='text-[#FBBEBE] text-sm'>{localError.newPassword}</p>}
              </div>

              <div>
                <label className='block text-sm text-white font-medium mb-1'>Confirm Password</label>
                <input 
                    type='password'
                    placeholder='••••••••'
                    required
                    className='w-full bg-[#EDE0E0] rounded-xl px-4 py-3 text-black outline-none'
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value }) }
                />
                {localError.confirmPassword && <p className='text-[#FBBEBE] text-sm'>{localError.confirmPassword}</p>}
              </div>

              <button
                type='submit'
                disabled={loading}
                className='cursor-pointer w-full bg-[#E9C788] hover:bg-[#6B4705] py-3 mt-3 rounded-xl text-white font-bold'
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
          </form>
        </div>
      </div>

    </AuthLayout>
  )
}

export default ResetPassword
