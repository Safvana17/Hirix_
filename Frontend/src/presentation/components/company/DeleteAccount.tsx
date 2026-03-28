import React, { useState } from 'react'
import ConfirmationModal from '../modal/ConfirmationModal'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { deleteAccount } from '../../../redux/slices/features/settingsSlice.ts/companySettingsSlice'
import toast from 'react-hot-toast'
import { deleteAccountSchema } from '../../../lib/validation/settingsValidator'
import { ZodError } from 'zod'
import { logoutUser } from '../../../redux/slices/features/auth/authSlice'

const deleteReasons = [
  { value: 'TOO_EXPENSIVE', label: 'Platform is too expensive' },
  { value: 'BUGS', label: 'Too many bugs' },
  { value: 'NOT_USEFUL', label: 'Not useful as expected' },
  { value: 'SWITCHED_PLATFORM', label: 'Switched to another platform' },
  { value: 'OTHER', label: 'Other' }
]

const DeleteAccount: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { loading } = useSelector((state: RootState) => state.companySettings)

  const id = user?.id

  const [formData, setFormData] = useState({
    password: '',
    reason: '',
    feedback: ''
  })

  const [localError, setLocalError] = useState<Record<string, string>>({})

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  })

  const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
    setModalConfig({ ...config, isOpen: true })
  }

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }))
  }

  const validate = () => {
    try {
      deleteAccountSchema.parse(formData)
      setLocalError({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach(issue => {
          const field = issue.path[0]
          if (typeof field === 'string' || typeof field === 'number') {
            errors[field] = issue.message
          }
        })
        setLocalError(errors)
      }
      return false
    }
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()

    if (!id) {
      toast.error('Company not found')
      return
    }

    if (!validate()) return

    openModal({
      title: 'Delete Account',
      message:
        'Are you sure you want to delete your company account? This action is irreversible after 30 days.',
      type: 'danger',

      onConfirm: async () => {
        try {
          await dispatch(
            deleteAccount({
              id,
              reason: formData.reason,
              feedback: formData.feedback,
              password: formData.password
            })
          ).unwrap()

          toast.success(
            'Your account has been deleted. You can restore it within 30 days.'
          )

          dispatch(logoutUser())
        } catch (error) {
          if (typeof error === 'string') {
            toast.error(error) // backend message (ex: Invalid password)
          } else {
            toast.error('Failed to delete account')
          }
        } finally {
          closeModal()
        }
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-red-200">

      <h2 className="text-2xl font-bold text-red-600 mb-2">
        Delete Account
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        This action is irreversible after 30 days. Please proceed carefully.
      </p>

      {/* WARNING BOX */}
      <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
        <p className="font-semibold mb-1">Important</p>
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>Your account will be deactivated immediately</li>
          <li>You can restore your account within 30 days</li>
          <li>After 30 days, your account will be permanently deleted</li>
        </ul>
      </div>

      <form onSubmit={handleDelete} className="space-y-5">

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {localError.password && (
            <p className="text-red-500 text-sm">{localError.password}</p>
          )}
        </div>

        {/* REASON */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for leaving
          </label>
          <select
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Select a reason</option>
            {deleteReasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {localError.reason && (
            <p className="text-red-500 text-sm">{localError.reason}</p>
          )}
        </div>

        {/* FEEDBACK */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Feedback (optional)
          </label>
          <textarea
            value={formData.feedback}
            onChange={(e) =>
              setFormData({ ...formData, feedback: e.target.value })
            }
            rows={4}
            placeholder="Tell us more..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? 'Deleting...' : 'Delete My Account'}
        </button>

      </form>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  )
}

export default DeleteAccount