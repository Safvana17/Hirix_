import React, { useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'
import changePassswordImage from '../../../assets/images/changePassword.jpg'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { changePassword } from '../../../redux/slices/features/settingsSlice/companySettingsSlice'
import { changePasswordSchema } from '../../../lib/validation/settingsValidator'
import { ZodError } from 'zod'


const ChangePassword: React.FC= () => {

  const dispatch = useDispatch<AppDispatch>()
  const { loading} = useSelector((state: RootState) => state.companySettings)
  const {user} = useSelector((state: RootState) => state.auth)
  const id = user?.id


  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '' 
  })
  const [localError, setLocalError] = useState<Record<string, string>>({})

  const validate = () => {
    try {
      changePasswordSchema.parse(formData)
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
    console.log('submit clicked')
    if(!validate()){
      console.log('VALIDATION FAILED', localError)
       return
    } 
    if(!id){
        toast.error('Company not found')
        return
    }

    try{
      await dispatch(changePassword({id, oldPassword: formData.oldPassword, newPassword: formData.newPassword, confirmPassword: formData.confirmPassword})).unwrap()
      toast('Your password changed successfully.')
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    }catch(error){
      toast.error(typeof error === 'string' ? error : 'Failed to change password')
    }
  }

  return (
    <AuthLayout title='Change Passwrd' subtitle='Enter your new password'>
      <div className='grid grid-cols-1 md:grid-cols-2 min-h-[600px]'>
       <div className='relative h-full'>
         <img src={changePassswordImage} alt="Auth image" className='w-full h-full object-cover'/>
         <div className="absolute inset-0 bg-[#9A6605] opacity-50" />
       </div>
        <div className='bg-[#9A6605] p-8 md:p-12 flex flex-col justify-center'>
          <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm text-white font-medium mb-1'>Current Password</label>
                <input 
                    type='password'
                    placeholder='••••••••'
                    required
                    className='w-full bg-[#EDE0E0] rounded-xl px-4 py-3 text-black outline-none'
                    onChange={(e) => setFormData({...formData, oldPassword: e.target.value }) }
                />
                {localError.oldPassword && <p className='text-[#FBBEBE] text-sm'>{localError.oldPassword}</p>}
              </div>
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
                disabled={loading || !id}
                className='cursor-pointer w-full bg-[#E9C788] hover:bg-[#6B4705] py-3 mt-3 rounded-xl text-white font-bold'
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
          </form>
        </div>
      </div>

    </AuthLayout>
  )
}

export default ChangePassword
