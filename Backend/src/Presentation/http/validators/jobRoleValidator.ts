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