import React, { useEffect } from 'react'
import AuthLayout from '../../layouts/AuthLayout'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getDeletedAccountDetails, restoreAccount } from '../../../redux/slices/features/settingsSlice/companySettingsSlice'
import toast from 'react-hot-toast'
import { ROUTES } from '../../../constants/routes'
import { getMe } from '../../../redux/slices/features/auth/authSlice'


const RestoreAccount: React.FC= () => {

    const {loading, restorePreview} = useSelector((state: RootState) => state.companySettings)
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    useEffect(() => {
      if(token){
        dispatch(getDeletedAccountDetails({token}))
      }
    }, [token, dispatch])

    const handleRestore = async() => {
      try {
        if(!token){
          console.log('token is missing')
          return
        }
        const result = await dispatch(restoreAccount({token}))
        if(restoreAccount.fulfilled.match(result)){
          toast.success('Your account is restored.')
          dispatch(getMe())
          navigate(ROUTES.COMPANY.DASHBOARD)
        }else{
          toast.error('Failed to restore account')
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Failed to restore account');
        }
      }
    }
  return (
    <AuthLayout title='Restore Your Company Account' subtitle='Your account was deactivated. You can restore it within 30 days.'>
      {restorePreview && (
        <div className="mb-6">
          <div className="p-5 space-y-4">

            {/* Title */}
            <p className="text-sm text-white text-left">
              You're about to restore this account:
            </p>

            {/* Name */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Company Name</p>
              <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 font-medium">
                {restorePreview.name}
              </div>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Email Address</p>
              <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-700">
                {restorePreview.email}
              </div>
            </div>

          </div>
        </div>
      )}

        <button
          onClick={handleRestore}
          disabled={loading}
          className="w-full bg-[#E9C788] hover:bg-[#6B4705] text-white font-bold py-3 rounded-xl transition mt-4 inline-block"
        >
          {loading ? 'Restoring...' : 'Restore Account'}
        </button>
    </AuthLayout>
  )
}

export default RestoreAccount

