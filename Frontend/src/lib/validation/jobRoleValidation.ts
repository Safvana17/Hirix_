import { z } from 'zod'


export const createJobRoleScheama = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Job role name must be atleast 2 character')
        .max(50, "Name must be atmost 50 characters")
        .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, 'Job role name must contain only letters and space'),
    // skills: z
    //     .array(z.string().min(1, "Skill cannot be empty"))
    //     .min(1, "At least one skill is required"),
    experienceMin: z
        .number()
        .min(0),
    experienceMax: z
        .number()
        .min(0),
    openings: z
        .number()
        .min(1, 'Openings must be atleast one')
})


export const EditJobRoleScheama = z.object({
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
