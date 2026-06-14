import React from "react";
import { useForm } from "react-hook-form";
import { CandidateType, type CandidateProfileForm } from "../../../types/candidate";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store";
// import { Upload, User2 } from "lucide-react";

const CandidateProfileInfo: React.FC = () => {
  // const { user } = useSelector((state: RootState) => state.auth)
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<CandidateProfileForm>();

  const candidateType = watch("candidateType");

  const onSubmit = (data: CandidateProfileForm) => {
    const payload = {
      ...data,
      skills: data.skills
        ?.split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      interestedRoles: data.interestedRoles
        ?.split(",")
        .map((role) => role.trim())
        .filter(Boolean),
    };

    console.log(payload);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold mb-8">
          Candidate Profile
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
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
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="border rounded-lg p-3"
                />
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

                <input
                  {...register("degree")}
                  placeholder="Degree"
                  className="border rounded-lg p-3"
                />

                <input
                  type="number"
                  {...register("graduationYear", {
                    valueAsNumber: true,
                  })}
                  placeholder="Graduation Year"
                  className="border rounded-lg p-3"
                />
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

                <input
                  {...register("designation")}
                  placeholder="Designation"
                  className="border rounded-lg p-3"
                />

                <input
                  type="number"
                  {...register("yearsOfExperience", {
                    valueAsNumber: true,
                  })}
                  placeholder="Years of Experience"
                  className="border rounded-lg p-3"
                />
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

              <input
                {...register("interestedRoles")}
                placeholder="Frontend Developer, Backend Developer"
                className="w-full border rounded-lg p-3"
              />
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

              <input
                {...register("githubUrl")}
                placeholder="GitHub URL"
                className="border rounded-lg p-3"
              />

              <input
                {...register("portfolioUrl")}
                placeholder="Portfolio URL"
                className="border rounded-lg p-3"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfileInfo;