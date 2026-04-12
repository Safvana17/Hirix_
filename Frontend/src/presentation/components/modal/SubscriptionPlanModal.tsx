import React, { useState } from 'react'
import type { ModalMode, CreatePlanPayload, TargetType, BillingCycle } from '../../../types/subscription'
import { ZodError } from 'zod'
import { createSubscriptionPlanSchema } from '../../../lib/validation/subcriptionPlanValidator'

const durationMap: Record<BillingCycle, number> = {
  monthly: 30,
  yearly: 365
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePlanPayload) => void
  mode: ModalMode
}

const SubscriptionPlanModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, mode }) => {

  const [formData, setFormData] = useState<CreatePlanPayload>({
    planName: '',
    target: 'company',
    price: 0,
    billingCycle: 'monthly',
    durationDays: 30,

    canCreateCustomQuestions: false,
    canUseAdminQuestions: true,
    maxTestsPerMonth: null,
    maxCandidates: null,
    maxInterviewsPerMonth: null,
    maxJobRolesPerMonth: null,

    canAccessPremiumQuestions: false,
    maxPracticePerDay: null,
    hasDetailedFeedback: false
  })

  const [localError, setLocalError] = useState<Record<string, string>>({})

  const validate = (data: CreatePlanPayload) => {
    try {
      createSubscriptionPlanSchema.parse(data)
      setLocalError({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const field = issue.path[0]
          if (typeof field === 'string') {
            errors[field] = issue.message
          }
        })
        setLocalError(errors)
      }
      return false
    }
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreatePlanPayload = {
      ...formData,
      planName: formData.planName.trim(),
      durationDays: durationMap[formData.billingCycle]
    }

    if (!validate(payload)) return

    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded-2xl p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-5">
          {mode === "edit" ? "Edit Plan" : "Create Plan"}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-5">

          <div>
            <label className="text-sm font-medium mb-1 block">Plan Name</label>
            <input
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.planName}
              onChange={(e) =>
                setFormData({ ...formData, planName: e.target.value })
              }
            />
            {localError.planName && <p className="text-red-500 text-xs">{localError.planName}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Price</label>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
            {localError.price && <p className="text-red-500 text-xs">{localError.price}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Target</label>
            <select
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.target}
              onChange={(e) =>
                setFormData({ ...formData, target: e.target.value as TargetType })
              }
            >
              <option value="company">Company</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Billing Cycle</label>
            <select
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.billingCycle}
              onChange={(e) =>
                setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })
              }
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {formData.target === 'company' && (
          <div className="mb-5">
            <h3 className="font-semibold mb-3">Company Capabilities</h3>

            <label className="flex items-center gap-2 mb-2 text-sm">
              <input
                type="checkbox"
                checked={formData.canCreateCustomQuestions}
                onChange={(e) =>
                  setFormData({ ...formData, canCreateCustomQuestions: e.target.checked })
                }
              />
              Allow custom question creation
            </label>

            <label className="flex items-center gap-2 mb-2 text-sm">
              <input
                type="checkbox"
                checked={formData.canUseAdminQuestions}
                onChange={(e) =>
                  setFormData({ ...formData, canUseAdminQuestions: e.target.checked })
                }
              />
              Use admin question bank
            </label>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Max Tests / Month</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxTestsPerMonth ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTestsPerMonth: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Max Candidates</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxCandidates ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxCandidates: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Max Job Roles</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxJobRolesPerMonth ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxJobRolesPerMonth: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Max Interviews</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxInterviewsPerMonth ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxInterviewsPerMonth: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>
            </div>
          </div>
        )}

        {formData.target === 'candidate' && (
          <div className="mb-5">
            <h3 className="font-semibold mb-3">Candidate Capabilities</h3>

            <label className="flex items-center gap-2 mb-2 text-sm">
              <input
                type="checkbox"
                checked={formData.canAccessPremiumQuestions}
                onChange={(e) =>
                  setFormData({ ...formData, canAccessPremiumQuestions: e.target.checked })
                }
              />
              Access premium questions
            </label>

            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">Max Practice / Day</label>
              <input
                type="number"
                className="border border-gray-300 p-2 rounded-lg w-full"
                value={formData.maxPracticePerDay ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPracticePerDay: e.target.value ? Number(e.target.value) : null
                  })
                }
              />
              <p className="text-xs text-gray-500">Leave empty for unlimited</p>
            </div>

            <label className="flex items-center gap-2 mt-3 text-sm">
              <input
                type="checkbox"
                checked={formData.hasDetailedFeedback}
                onChange={(e) =>
                  setFormData({ ...formData, hasDetailedFeedback: e.target.checked })
                }
              />
              Provide detailed feedback
            </label>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-[#65051C] text-white rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-[#0B3358] text-white rounded-lg"
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Save Changes" : "Create Plan"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default SubscriptionPlanModal