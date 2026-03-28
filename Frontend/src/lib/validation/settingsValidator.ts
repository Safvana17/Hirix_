import { z } from 'zod'

export const updateProfileSchema = z.object({
  // id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be at most 30 characters'),

  legalName: z
    .string()
    .trim()
    .min(2, 'Legal name must be at least 2 characters')
    .max(50, 'Legal name must be at most 50 characters')
    .regex(/^[a-zA-Z ]+$/, 'Only letters and spaces allowed')
    .optional(),

  domain: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+\.[a-z]{2,}$/, 'Invalid domain')
    .optional(),

  website: z
    .string()
    .trim()
    .url('Invalid URL')
    .optional(),

  teamSize: z
    .number()
    .min(1, 'Team size must be at least 1'),

  about: z
    .string()
    .trim()
    .max(500, 'About must be under 500 characters')
    .optional(),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .optional(),

  streetName: z.string().trim().optional(),
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),

  pinCode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, 'Pin code must be 6 digits')
    .optional(),

  primaryContactName: z.string().trim().optional(),

  email: z
    .string()
    .trim()
    .email('Invalid email')
    .optional(),

  billingEmail: z
    .string()
    .trim()
    .email('Invalid email')
    .optional(),
})

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