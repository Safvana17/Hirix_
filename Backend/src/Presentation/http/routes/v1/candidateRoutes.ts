import Express from 'express'
import { ROUTES } from '../../../../Shared/constsnts/routes'
import { authHandler } from '../../middlewares/authMiddleware'
import { iCandidateSubscriptionController, iPracticeLibraryController, iTokenService } from '../../controllers/factory'
import { verifyCsrf } from '../../middlewares/csrfVerify'
import { ChangeSubscriptionSchema, ConfirmPaymnetSchema, MakePaymentSchema, MarkFailureSchema, PaymnetQuerySchema } from '../../validators/subscriptionValidators'
import { validate } from '../../middlewares/validate'


const router = Express.Router()

//practice
router.get(ROUTES.CANDIDATE.PRACTICE.GET_ALL, authHandler(iTokenService), iPracticeLibraryController.getAllPracticeQuestions)

//subscription
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_ALL, authHandler(iTokenService), iCandidateSubscriptionController.getAllPlan)
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_CURRENT, authHandler(iTokenService), iCandidateSubscriptionController.getCurrentPlan)
router.post(ROUTES.CANDIDATE.SUBSCRIPTION.CHANGE_SUBSCRIPTION, authHandler(iTokenService), verifyCsrf, validate(ChangeSubscriptionSchema, 'body'), iCandidateSubscriptionController.changePlan)
router.post(ROUTES.CANDIDATE.SUBSCRIPTION.MAKE_PAYMENT, authHandler(iTokenService), verifyCsrf, validate(MakePaymentSchema, 'body'), iCandidateSubscriptionController.makePayment)
router.post(ROUTES.CANDIDATE.SUBSCRIPTION.CONFIRM_PYMENT, authHandler(iTokenService), verifyCsrf, validate(ConfirmPaymnetSchema, 'body'), iCandidateSubscriptionController.confirmPayment)
router.patch(ROUTES.CANDIDATE.SUBSCRIPTION.MARK_FAILURE, authHandler(iTokenService), verifyCsrf, validate(MarkFailureSchema, 'body'), iCandidateSubscriptionController.markFailed)
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_BILLING_HISTORY, authHandler(iTokenService), validate(PaymnetQuerySchema, 'query'), iCandidateSubscriptionController.getBillingHistory)





export default router