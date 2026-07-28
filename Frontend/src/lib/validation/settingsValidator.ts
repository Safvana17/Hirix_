import { z } from 'zod'
import { CandidateType } from '../../types/candidate'


export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be at most 30 characters"),

  legalName: z
    .string()
    .trim()
    .min(2, "Legal name must be at least 2 characters")
    .max(50, "Legal name must be at most 50 characters")
    .regex(/^[a-zA-Z ]+$/, "Only letters and spaces allowed")
    .optional(),

  domain: z.string().trim().optional(),

  website: z
    .string()
    .trim()
    .url("Invalid URL")
    .optional(),

  teamSize: z
    .number()
    .min(1, "Team size must be at least 1"),

  about: z
    .string()
    .trim()
    .max(500, "About must be under 500 characters")
    .optional(),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
    .optional(),

  streetName: z.string().trim().optional(),

  country: z
    .string()
    .trim()
    .min(1, "Country is required"),

  state: z
    .string()
    .trim()
    .min(1, "State is required"),

  city: z
    .string()
    .trim()
    .min(1, "City is required"),

  pinCode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Pin code must be 6 digits")
    .optional(),

  primaryContactName: z
    .string()
    .trim()
    .min(1, "Primary contact name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional(),

  billingEmail: z
    .string()
    .trim()
    .email("Invalid email")
    .optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .trim()
    .min(6, 'Password must contain atleast 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, "Password must contain uppercase, lowercase, number and special character"),
  newPassword: z
    .string()
    .trim()
    .min(6, 'Password must contain atleast 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, "Password must contain uppercase, lowercase, number and special character"),
  confirmPassword: z
    .string()
})
.refine(data => data.newPassword === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
})

export const deleteAccountSchema = z.object({
  reason: z.enum([
    'TOO_EXPENSIVE',
    'BUGS',
    'NOT_USEFUL',
    'SWITCHED_PLATFORM',
    'OTHER'
  ], {
    message: 'Please select a reason'
  }),

  feedback: z.string().optional(),
  password: z
    .string()
    .trim()
    .min(6, 'Password must contain atleast 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, "Password must contain uppercase, lowercase, number and special character"),
})


export const candidateProfileSchema = z.object({
  // profilePicture: z
  //   .string()
  //   .url("Invalid profile picture URL")
  //   .optional()
  //   .or(z.literal("")),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be at most 30 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email'),

  candidateType: z.nativeEnum(CandidateType).optional(),
  college: z
    .string()
    .trim()
    .max(100, "College name cannot exceed 100 characters")
    .optional(),
  degree: z
    .string()
    .trim()
    .max(100, "Degree cannot exceed 100 characters")
    .optional(),
  graduationYear: z
    .number()
    .min(1950, "Invalid graduation year")
    .max(new Date().getFullYear() + 10, "Invalid graduation year")
    .optional(),
  company: z
    .string()
    .trim()
    .max(100, "Company name cannot exceed 100 characters")
    .optional(),
  designation: z
    .string()
    .trim()
    .max(100, "Designation cannot exceed 100 characters")
    .optional(),
  yearsOfExperience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years")
    .optional(),
  skills: z
    .string()
    .optional(),
  interestedRoles: z
    .string()
    .optional(),

  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .optional()
    .or(z.literal("")),

  githubUrl: z
    .string()
    .url("Invalid GitHub URL")
    .optional()
    .or(z.literal("")),

  portfolioUrl: z
    .string()
    .url("Invalid Portfolio URL")
    .optional()
    .or(z.literal("")),
})