import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { CandidateType, type CandidateProfileForm } from "../../../types/candidate";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
//import { Upload, User2 } from "lucide-react";
import { getCandidateProfile, updateProfile } from "../../../redux/slices/features/settingsSlice/candidateSettingsSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateProfileSchema } from "../../../lib/validation/settingsValidator";
import toast from "react-hot-toast";

const CandidateProfileInfo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { candidate, loading } = useSelector((state: RootState) => state.candidateSettings)

  useEffect(() => {
    if(user){
      dispatch(getCandidateProfile({id: user.id}))
    }
  }, [user, dispatch])

  const profileData = useMemo(() => ({
      name: candidate?.name || user?.name,
      email: candidate?.email || user?.email,
      candidateType: candidate?.candidateType || CandidateType.STUDENT, 
      college: candidate?.college || '',
      degree: candidate?.degree || '',
      graduationYear: candidate?.graduationYear || undefined,
      company: candidate?.company || '',
      designation: candidate?.designation || '',
      yearsOfExperience: candidate?.yearsOfExperience || undefined,
      skills: Array.isArray(candidate?.skills) ? candidate.skills.join(', ') : candidate?.skills || "",
      interestedRoles: Array.isArray(candidate?.interestedRoles) ? candidate.interestedRoles.join(', ') : candidate?.interestedRoles || "",
      linkedinUrl: candidate?.linkedinUrl || '',
      githubUrl: candidate?.githubUrl || '',
      portfolioUrl: candidate?.portfolioUrl || '',

  }), [candidate, user])

  const { register, handleSubmit, watch, reset, formState: { errors} } = useForm<CandidateProfileForm>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: profileData
  })

  useEffect(() => {
    if(candidate || user){
      reset(profileData)
    }
  }, [profileData, reset, candidate, user])
  
  const candidateType = watch("candidateType");
  
  const onSubmit = async (data: CandidateProfileForm) => {
    if(!user?.id) {
      console.log('not id found')
      return
    }
    try {
      console.log('inside submit')

      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if(value !== undefined && value !== null){
          formData.append(key, String(value))
        }
      })

const payload = {
  ...data,
  skills:
    data.skills?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) ?? [],

  interestedRoles:
    data.interestedRoles?.split(",")
      .map((role) => role.trim())
      .filter(Boolean) ?? [],
};


      
      await dispatch(updateProfile({ id: user.id, candidate: payload })).unwrap()
      // await dispatch(getCandidateProfile({id: user.id}))

      toast.success('Your profile has been updated successfully')
    } catch (error) {
      console.log('update error: ', error)
      toast.error(typeof error === 'string' ? error : 'Failed to update profile')
    } 
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold mb-8">
          Candidate Profile
        </h1>

<form
  onSubmit={handleSubmit(
    onSubmit,
    (errors) => {
      console.log("VALIDATION ERRORS", errors);
    }
  )}
  className="space-y-8"
>
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
        {/* <div className="flex justify-center py-6">
          <div className="relative w-32 h-32">
            {company?.profileLogo?(
            <img
              src={company?.profileLogo}
              alt="Company Logo"
              className="w-full h-full object-cover rounded-full border"
            />): (
                <div className="w-full h-full flex items-center justify-center rounded-full border bg-gray-100">
                  <User2 className='w-16 h-16 text-gray-400' />
                </div>
            )}

            <label className="absolute bottom-0 right-0 bg-[#C89A44] text-white p-2 rounded-full cursor-pointer hover:bg-[#634815]">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>
               <Upload className='w-3 h-3' />
            </label>
          </div>
        </div> */}

                <input
                  {...register("name")}
                  placeholder="Name"
                  className="border rounded-lg p-3"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="border rounded-lg p-3"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Candidate Type
                </label>

                <select
                  {...register("candidateType")}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select Type</option>
                  <option value={CandidateType.STUDENT}>
                    Student
                  </option>
                  <option value={CandidateType.FRESHER}>
                    Fresher
                  </option>
                  <option value={CandidateType.PROFESSIONAL}>
                    Professional
                  </option>
                </select>
                {errors.candidateType && <p className="text-red-500 text-sm">{errors.candidateType.message}</p>}
              </div>
            </div>
          </div>

          {/* Student Section */}
          {candidateType === CandidateType.STUDENT && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Education Details
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  {...register("college")}
                  placeholder="College"
                  className="border rounded-lg p-3"
                />
                {errors.college && <p className="text-red-500 text-sm">{errors.college.message}</p>}

                <input
                  {...register("degree")}
                  placeholder="Degree"
                  className="border rounded-lg p-3"
                />
                {errors.degree && <p className="text-red-500 text-sm">{errors.degree.message}</p>}

                <input
                  type="number"
                  {...register("graduationYear", {
                    setValueAs: (v) => v === "" ? undefined : Number(v),
                  })}
                  placeholder="Graduation Year"
                  className="border rounded-lg p-3"
                />
                {errors.graduationYear && <p className="text-red-500 text-sm">{errors.graduationYear.message}</p>}
              </div>
            </div>
          )}

          {/* Professional Section */}
          {candidateType === CandidateType.PROFESSIONAL && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Professional Details
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  {...register("company")}
                  placeholder="Company"
                  className="border rounded-lg p-3"
                />
                {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}

                <input
                  {...register("designation")}
                  placeholder="Designation"
                  className="border rounded-lg p-3"
                />
                {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}

                <input
                  type="number"
                  {...register("yearsOfExperience", {
                    setValueAs: (v) => v === "" ? undefined : Number(v),
                  })}
                  placeholder="Years of Experience"
                  className="border rounded-lg p-3"
                />
                {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience.message}</p>}
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Skills & Interests
            </h2>

            <div className="space-y-4">
              <input
                {...register("skills")}
                placeholder="React, Node.js, MongoDB"
                className="w-full border rounded-lg p-3"
              />
              {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message}</p>}

              <input
                {...register("interestedRoles")}
                placeholder="Frontend Developer, Backend Developer"
                className="w-full border rounded-lg p-3"
              />
              {errors.interestedRoles && <p className="text-red-500 text-sm">{errors.interestedRoles.message}</p>}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Social Links
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                {...register("linkedinUrl")}
                placeholder="LinkedIn URL"
                className="border rounded-lg p-3"
              />
              {errors.linkedinUrl && <p className="text-red-500 text-sm">{errors.linkedinUrl.message}</p>}

              <input
                {...register("githubUrl")}
                placeholder="GitHub URL"
                className="border rounded-lg p-3"
              />
              {errors.githubUrl && <p className="text-red-500 text-sm">{errors.githubUrl.message}</p>}

              <input
                {...register("portfolioUrl")}
                placeholder="Portfolio URL"
                className="border rounded-lg p-3"
              />
              {errors.portfolioUrl && <p className="text-red-500 text-sm">{errors.portfolioUrl.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              { loading ? 'Updating...' :  'Update Profile' }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfileInfo;