export const subscriptionPlanMessages = {
    success: {
       PLAN_CREATED: 'Plan created successfully',
    },
    error: {
        ALREADY_EXISTS: 'Plan with same target already exists',
        PRICE_MUST_BE_ZERO: 'For free plan price must be zero',
        INVALID_DURATIONDAYS: 'Invalid duration days',
        CANNOT_BE_NEGATIVE_VALUE: 'Limits cannot be less than one',
        FEATURES_CANNOT_BE_EMPTY: 'Plan features cannot be empty',
        CANNOT_DENY_ADMIN_QUESTIONS_ACCESS: 'Company must atleast use admin questions',
        REQUIRES_PREMIUM_ACCESS: 'Detailed feedback requires premium access',
        NOT_FOUND: 'Subscription plan not found',
    }
}