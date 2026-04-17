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
        CANNOT_DEACTIVATE_FREE_PLAN: 'You cannot deactivate free plan',
        ALREADY_DELETED: 'The plan is already deleted',
        CANNOT_DELETE_ACTIVE_PLAN: 'You cannot delete active plan, first you need to deactivate it.',
        UPDATE_STATUS_FAILED: 'Failed to update plan status',
        CANNOT_DELETE_FREE_PLAN: 'You canot delete free plan',
        CANNOT_FIND_SUBCRIPTION_DETAILS: 'Subcription details are not found',
        MISSING_FREE_PLAN: 'Free plan for this target is missing',
        INVALID_BILLING_CYCLE: 'For free plan billing cycle must be FOREVER',
        INACTIVE_PLAN: 'The plan is deactivated',
        DELETED_PLAN: 'The plan is deleted',
        ALREADY_SUBSCRIBED: 'Already subscribed to this plan',
        DOESNOT_REQUIRE_PAYMENT: 'Free plan does not require payment',
        PAYMENT_NOT_FOUND: 'Payment not found',
        INVALID_PAYMENT_SIGNATURE: 'Invalid payment signature',
    }
}