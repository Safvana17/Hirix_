import React from 'react'
import type {
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form'
import type { z } from 'zod'

import { updateProfileSchema } from '../../../../lib/validation/settingsValidator'

type ProfileFormValues = z.infer<typeof updateProfileSchema>

interface CompanyContactInformationProps {
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
}

const CompanyContactInformation: React.FC<CompanyContactInformationProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-xl font-bold text-gray-800 pt-4">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div className="space-y-2">
          <label htmlFor="primaryContactName">
            Primary Contact Name
          </label>

          <input
            {...register('primaryContactName')}
            id="primaryContactName"
            placeholder="Jane Doe"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.primaryContactName && (
            <p className="text-red-500 text-sm">
              {errors.primaryContactName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email">
            Primary Contact Email
          </label>

          <input
            {...register('email')}
            id="email"
            placeholder="jane@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="billingEmail">
            Billing Email
          </label>

          <input
            {...register('billingEmail')}
            id="billingEmail"
            placeholder="billing@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.billingEmail && (
            <p className="text-red-500 text-sm">
              {errors.billingEmail.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber">
            Phone Number
          </label>

          <input
            {...register('phoneNumber')}
            id="phoneNumber"
            placeholder="+1 234 567 8900"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyContactInformation