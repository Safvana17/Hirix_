import React from 'react'
import type {UseFormWatch,} from "react-hook-form";
import { State } from 'country-state-city'
import type { ICountry } from 'country-state-city'
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import type { z } from 'zod'

import { updateProfileSchema } from '../../../../lib/validation/settingsValidator'

type ProfileFormValues = z.infer<typeof updateProfileSchema>

interface CompanyAddressInformationProps {
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  countries: ICountry[]
  selectedCountry: string
  watch: UseFormWatch<ProfileFormValues>
  // setSelectedCountry: React.Dispatch<React.SetStateAction<string>>
  setValue: UseFormSetValue<ProfileFormValues>
}

const CompanyAddressInformation: React.FC<CompanyAddressInformationProps> = ({
  register,
  errors,
  countries,
  selectedCountry,
  // setSelectedCountry,
  watch,
  setValue,
}) => {

  const selectedState =
  State.getStatesOfCountry(selectedCountry).find(
    s => s.name === watch("state")
  )?.isoCode ?? "";
  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-xl font-bold text-gray-800 pt-4 mb-5">
        Address Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="streetName">Street Address</label>

          <input
            {...register('streetName')}
            id="streetName"
            placeholder="123 Tech Lane"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.streetName && (
            <p className="text-red-500 text-sm">
              {errors.streetName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="city">City</label>

          <input
            {...register('city')}
            id="city"
            placeholder="City"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.city && (
            <p className="text-red-500 text-sm">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label>Country</label>

          <select
            value={selectedCountry}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
            onChange={(e) => {
              const isoCode = e.target.value

              // setSelectedCountry(isoCode)

              const country = countries.find(
                (c) => c.isoCode === isoCode
              )

              setValue('country', country?.name || '')
              setValue('state', '')
            }}
          >
            <option value="">Select Country</option>

            {countries.map((country) => (
              <option
                key={country.isoCode}
                value={country.isoCode}
              >
                {country.name}
              </option>
            ))}
          </select>

          {errors.country && (
            <p className="text-red-500 text-sm">
              {errors.country.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label>State / Province</label>

          <select
              value={selectedState}
              disabled={!selectedCountry}
              onChange={(e) => {
                  const state = State.getStatesOfCountry(selectedCountry).find(
                      s => s.isoCode === e.target.value
                  );

                  setValue("state", state?.name || "");
              }}
          >
            <option value="">Select State</option>

            {State.getStatesOfCountry(selectedCountry).map((state) => (
              <option
                key={state.isoCode}
                value={state.isoCode}
              >
                {state.name}
              </option>
            ))}
          </select>

          {errors.state && (
            <p className="text-red-500 text-sm">
              {errors.state.message}
            </p>
          )}
        </div>



        <div className="space-y-2">
          <label htmlFor="pinCode">Zip / Postal Code</label>

          <input
            {...register('pinCode')}
            id="pinCode"
            placeholder="94105"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.pinCode && (
            <p className="text-red-500 text-sm">
              {errors.pinCode.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyAddressInformation