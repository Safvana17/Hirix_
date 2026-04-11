import { z } from 'zod'
import jobRoleStatus from '../../../Domain/enums/jobRoleStatus'


export const createJobRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Job role name must be atleast 2 character')
        .max(50, "Name must be atmost 50 characters")
        .regex(/^[A-Za-z]+( [A-Za-z]+)*$/),
    skills: z
        .array(z.string().min(1, "Skill cannot be empty"))
        .min(1, "At least one skill is required"),
    experienceMin: z
        .number()
        .min(0),
    experienceMax: z
        .number()
        .min(0),
    openings: z
        .number()
        .min(1)
})


export const EditJobRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Job role name must be atleast 2 character')
        .max(50, "Name must be atmost 50 characters")
        .regex(/^[A-Za-z]+( [A-Za-z]+)*$/),
    skills: z
        .array(z.string().min(1, "Skill cannot be empty"))
        .min(1, "At least one skill is required"),
    experienceMin: z
        .number()
        .min(0),
    experienceMax: z
        .number()
        .min(0),
    openings: z
        .number()
        .min(1)
})
export const JobRoleQuerySchema = z.object({
    search: z.string().optional(),
    status: z.nativeEnum(jobRoleStatus).optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10)
})

export const updateJobRoleSchema = z.object({
    status: z.nativeEnum(jobRoleStatus)
})

export const deleteJobRoleSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/)
})


// import { z } from 'zod'
// import jobRoleStatus from '../../../Domain/enums/jobRoleStatus'

// // 🔹 Common ObjectId validator
// const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')

// // 🔹 Base Schema (Reusable)
// const jobRoleBaseSchema = z.object({
//   name: z
//     .string()
//     .trim()
//     .min(2, 'Job role name must be atleast 2 character')
//     .max(50, "Name must be atmost 50 characters")
//     .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, 'Invalid job role name format'),

//   skills: z
//     .array(z.string().min(1, "Skill cannot be empty"))
//     .min(1, "At least one skill is required"),

//   experienceMin: z
//     .number()
//     .min(0, "Minimum experience cannot be negative"),

//   experienceMax: z
//     .number()
//     .min(0, "Maximum experience cannot be negative"),

//   openings: z
//     .number()
//     .min(1, "At least one opening is required")
// }).refine(
//   (data) => data.experienceMax >= data.experienceMin,
//   {
//     message: "experienceMax must be greater than or equal to experienceMin",
//     path: ["experienceMax"]
//   }
// )


// // ✅ Create Job Role (POST)
// export const createJobRoleSchema = z.object({
//   body: jobRoleBaseSchema
// })


// // ✅ Edit Job Role (PATCH / PUT - partial update)
// export const editJobRoleSchema = z.object({
//   params: z.object({
//     id: objectId
//   }),
//   body: jobRoleBaseSchema.partial()
// })


// // ✅ Get Job Roles (Query)
// export const jobRoleQuerySchema = z.object({
//   query: z.object({
//     search: z.string().optional(),
//     status: z.nativeEnum(jobRoleStatus).optional(),
//     page: z.coerce.number().min(1).default(1),
//     limit: z.coerce.number().min(1).max(100).default(10)
//   })
// })


// // ✅ Update Job Role Status (PATCH)
// export const updateJobRoleStatusSchema = z.object({
//   params: z.object({
//     id: objectId
//   }),
//   body: z.object({
//     status: z.nativeEnum(jobRoleStatus)
//   })
// })


// // ✅ Delete Job Role (DELETE)
// export const deleteJobRoleSchema = z.object({
//   params: z.object({
//     id: objectId
//   })
// })