import React, { useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'
import LoginBg from '../../../assets/images/LoginImage.jpg'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { loginSchema } from '../../../lib/validation/authValidation'
import { ZodError } from 'zod'
import { adminLogin } from '../../../redux/slices/features/auth/adminAuthSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AdminLogin: React.FC= () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState<Record<string, string>>({})

    const { loading } = useSelector((state: RootState) => state.adminAuth)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const validate = () => {
        try {
            loginSchema.parse(formData)
            setError({})
            return true
        } catch (error) {
            if(error instanceof ZodError){
                const errors: Record<string, string> = {}
                error.issues.forEach((issue) => {
                    const field = issue.path[0]
                    if(typeof field === 'number' || typeof field === 'string')
                       errors[field] = issue.message
                })
                setError(errors)
            }
            return false
        }
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        if(!validate()) return
        const result = await dispatch(adminLogin({email: formData.email, password: formData.password}))

        if(adminLogin.fulfilled.match(result)){
            toast.success('Admin logged in successfully')
            navigate('/admin/dashboard')
        }

        if(adminLogin.rejected.match(result)){
            toast.error(result.payload || 'Failed to login')
        }
    }
  return (
    <AuthLayout title='Welcome, Nice to see you again' subtitle=''>
      <div className='grid grid-cols-1 md:grid-cols-2 min-h-[600px]'>
       <div className='relative'>
         <img src={LoginBg} alt="Auth image" className='w-full h-full object-cover'/>
         <div className="absolute inset-0 bg-[#9A6605] opacity-50" />
       </div>

        <div className='bg-[#9A6605] p-8 md:p-12 flex flex-col justify-center'>
          <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-white mb-1'>Email</label>
                <input 
                    type='email'
                    placeholder='example@gmail.com'
                    required
                    className='w-full bg-[#EDE0E0] rounded-xl px-4 py-3 text-black focus:outline-none transition'
                    onChange={(e) => setFormData({...formData, email: e.target.value }) }
                />
                {error.email && <p className='text-[#FBBEBE] text-sm'>{error.email}</p>}
              </div>

              <div>
                <label className='block text-sm text-white font-medium mb-1'>Password</label>
                <input 
                    type='password'
                    placeholder='••••••••'
                    required
                    className='w-full bg-[#EDE0E0] rounded-xl px-4 py-3 text-black focus:outline-none transition'
                    onChange={(e) => setFormData({...formData, password: e.target.value }) }
                />
                {error.password && <p className='text-[#FBBEBE] text-sm'>{error.password}</p>}
              </div>

              <button
                type='submit'
                disabled={loading}
                className='cursor-pointer w-full bg-[#E9C788] hover:bg-[#6B4705] text-white font-bold py-3 rounded-xl mt-4 transition duration-200 disabled:opacity-50 shadow-lg shadow-blue-900/20'
              >
                {loading ? 'logging...' : 'Login'}
              </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}

export default AdminLogin
