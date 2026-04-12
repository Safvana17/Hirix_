import z from "zod";
import { BillingCycle, TargetType } from "../../../Domain/enums/subscription";

export const createSubscriptionPlanSchema = z
  .object({
    planName: z
      .string()
      .trim()
      .min(1, "Plan name is required")
      .regex(
        /^[A-Za-z0-9 ]+$/,
        "Plan name must contain only letters, numbers, and spaces"
      ),
    target: z.nativeEnum(TargetType),
    price: z
      .number({ message: "Price must be a number" })
      .min(0, "Price cannot be negative"),
    billingCycle: z.nativeEnum(BillingCycle),
    durationDays: z.number(),
    maxCandidates: z
      .number()
      .min(1, "Candidate limit must be at least one")
      .nullable(),
    maxTestsPerMonth: z
      .number()
      .min(1, "Maximum test limit must be at least one")
      .nullable(),
    features: z
      .array(z.string().trim().min(1, "Feature cannot be empty"))
      .min(1, "At least one feature is required"),
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