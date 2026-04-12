import z from "zod";


export const createSubscriptionPlanSchema = z.object({
  planName: z.string().min(1),
  target: z.enum(['company', 'candidate']),
  price: z.number().min(0),
  billingCycle: z.enum(['monthly', 'yearly']),
  durationDays: z.number(),

  maxCandidates: z.number().min(1).nullable().optional(),
  maxTestsPerMonth: z.number().min(1).nullable().optional(),

  canCreateCustomQuestions: z.boolean().optional(),
  canUseAdminQuestions: z.boolean().optional(),

  canAccessPremiumQuestions: z.boolean().optional(),
  maxPracticePerDay: z.number().min(1).nullable().optional(),
  hasDetailedFeedback: z.boolean().optional(),
})
  .refine(
    (data) =>
      !(data.planName.toLowerCase() === "free" && data.price > 0),
    {
      message: "Free plan must have price 0",
      path: ["price"],
    }
  )
 .refine(
    (data) => {
      const map = {
        monthly: 30,
        yearly: 365,
      };
      return data.durationDays === map[data.billingCycle];
    },
    {
      message: "Invalid duration for selected billing cycle",
      path: ["durationDays"],
    }
  );