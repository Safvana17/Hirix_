import Express from 'express'
import { ROUTES } from '../../../../Shared/constsnts/routes'
import { authHandler } from '../../middlewares/authMiddleware'
import { iCandidateAnalyticsController, iCandidateSettingsController, iCandidateSubscriptionController, ICandidateTestController, iPracticeLibraryController, iTokenService, iUnifiedSettingsController } from '../../controllers/factory'
import { verifyCsrf } from '../../middlewares/csrfVerify'
import { CancelSubscriptionSchema, ChangeSubscriptionSchema, ConfirmPaymnetSchema, GetInvoiceSchema, MakePaymentSchema, MarkFailureSchema, PaymnetQuerySchema, startTrialSchema } from '../../validators/subscriptionValidators'
import { validate } from '../../middlewares/validate'
import { CandidateRunCodeSchema, GenerateSnapshotUrlSchema, saveAnswerSchema, SaveSnapshotSchema, submitTestSchema, TestCandidateLoginSchema, TestTokenSchema } from '../../validators/companyTest.validator'
import { createQuestionSchema, questionParamsSchema, submitPraticeAnswerSchema } from '../../validators/questionValidator'
import { GetPaymentHistorySchema } from '../../validators/analyticsValidator'
import { candidateProfileSchema, changePasswordSchema } from '../../validators/settingsValidator'


const router = Express.Router()

//practice
router.get(ROUTES.CANDIDATE.PRACTICE.GET_ALL, authHandler(iTokenService), iPracticeLibraryController.getAllPracticeQuestions)
router.get(ROUTES.CANDIDATE.PRACTICE.GET_BY_ID, authHandler(iTokenService), validate(questionParamsSchema, 'params'), iPracticeLibraryController.getQuestionById)
router.get(ROUTES.CANDIDATE.PRACTICE.GET_RELATED, authHandler(iTokenService), validate(questionParamsSchema, 'params'), iPracticeLibraryController.getRelatedQuestions)
router.post(ROUTES.CANDIDATE.PRACTICE.SUBMIT,authHandler(iTokenService), verifyCsrf, validate(questionParamsSchema, 'params'), validate(submitPraticeAnswerSchema, 'body'), iPracticeLibraryController.submitAnswer)
router.get(ROUTES.CANDIDATE.PRACTICE.GET_EXPLANATION, authHandler(iTokenService), validate(questionParamsSchema, 'params'), iPracticeLibraryController.getExplanation)

//subscription
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_ALL, authHandler(iTokenService), iCandidateSubscriptionController.getAllPlan)
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_CURRENT, authHandler(iTokenService), iCandidateSubscriptionController.getCurrentPlan)
router.post(ROUTES.CANDIDATE.SUBSCRIPTION.CHANGE_SUBSCRIPTION, authHandler(iTokenService), verifyCsrf, validate(ChangeSubscriptionSchema, 'body'), iCandidateSubscriptionController.changePlan)
router.post(ROUTES.CANDIDATE.SUBSCRIPTION.MAKE_PAYMENT, authHandler(iTokenService), verifyCsrf, validate(MakePaymentSchema, 'body'), iCandidateSubscriptionController.makePayment)
router.post(ROUTES.CANDIDATE.SUBSCRIPTION.CONFIRM_PYMENT, authHandler(iTokenService), verifyCsrf, validate(ConfirmPaymnetSchema, 'body'), iCandidateSubscriptionController.confirmPayment)
router.patch(ROUTES.CANDIDATE.SUBSCRIPTION.MARK_FAILURE, authHandler(iTokenService), verifyCsrf, validate(MarkFailureSchema, 'body'), iCandidateSubscriptionController.markFailed)
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_BILLING_HISTORY, authHandler(iTokenService), validate(PaymnetQuerySchema, 'query'), iCandidateSubscriptionController.getBillingHistory)
router.patch(ROUTES.CANDIDATE.SUBSCRIPTION.CANCEL, authHandler(iTokenService), verifyCsrf, validate(CancelSubscriptionSchema, 'params'), iCandidateSubscriptionController.cancelSubscription)
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.INVOICE, authHandler(iTokenService), validate(GetInvoiceSchema, 'params'), iCandidateSubscriptionController.getInvoice)
router.post(ROUTES.CANDIDATE.SUBSCRIPTION.START_TRIAL, authHandler(iTokenService), verifyCsrf, validate(startTrialSchema, 'params'), iCandidateSubscriptionController.startTrial)

//notifications
router.get(ROUTES.COMMON.GET_NOTIFICATIONS, authHandler(iTokenService), iUnifiedSettingsController.getNotification)
router.patch(ROUTES.COMMON.MARK_READ, authHandler(iTokenService), verifyCsrf, iUnifiedSettingsController.markAllAsRead)

//test
router.get(ROUTES.CANDIDATE.TEST.GET_BY_TOKEN, validate(TestTokenSchema, 'params'), ICandidateTestController.getTestByToken)
router.post(ROUTES.CANDIDATE.TEST.TEST_LOGIN, validate(TestTokenSchema, 'params'), validate(TestCandidateLoginSchema, 'body'), ICandidateTestController.candidateLogin)
router.patch(ROUTES.CANDIDATE.TEST.START, validate(TestTokenSchema, 'params'), ICandidateTestController.startTest)
router.post(ROUTES.CANDIDATE.TEST.RUN_CODE, validate(TestTokenSchema, 'params'), validate(CandidateRunCodeSchema, 'body'), ICandidateTestController.runCode)
router.post(ROUTES.CANDIDATE.TEST.SUBMIT, validate(TestTokenSchema, 'params'), validate(submitTestSchema, 'body'), ICandidateTestController.submittest)
router.patch(ROUTES.CANDIDATE.TEST.TERMINATE, validate(TestTokenSchema, 'params'),validate(submitTestSchema, 'body'), ICandidateTestController.terminateTest)
router.post(ROUTES.CANDIDATE.TEST.SUBMIT_QUESTION, validate(TestTokenSchema, 'params'), validate(createQuestionSchema, 'body'), ICandidateTestController.submitQuestion)
router.get(ROUTES.CANDIDATE.TEST.GET_CATEGORIES, validate(TestTokenSchema, 'params'), ICandidateTestController.getAllCategories)
router.post(ROUTES.CANDIDATE.TEST.SAVE_ANSWER, validate(TestTokenSchema, 'params'), validate(saveAnswerSchema, 'body'), ICandidateTestController.saveAnswers)
router.patch(ROUTES.CANDIDATE.TEST.WARNING_COUNT, validate(TestTokenSchema, 'params'), ICandidateTestController.warningCount)
router.post(ROUTES.CANDIDATE.TEST.GET_UPLOAD_URL, validate(TestTokenSchema, 'params'), validate(GenerateSnapshotUrlSchema, 'body'), ICandidateTestController.generateUrl)
router.patch(ROUTES.CANDIDATE.TEST.SAVE_SNAPSHOT, validate(TestTokenSchema, 'params'), validate(SaveSnapshotSchema, 'body'), ICandidateTestController.saveSnapshot)

//dashboard
router.get(ROUTES.CANDIDATE.ANALYTICS.SUMMERY, authHandler(iTokenService), iCandidateAnalyticsController.getSummery)
router.get(ROUTES.CANDIDATE.ANALYTICS.TEST_HISTORY, authHandler(iTokenService), validate(GetPaymentHistorySchema, 'query'), iCandidateAnalyticsController.testHistory)

//settings
router.put(ROUTES.CANDIDATE.SETTINGS.CHANGE_PASSWORD, authHandler(iTokenService), verifyCsrf, validate(changePasswordSchema, 'body'), iCandidateSettingsController.changePassword)
router.get(ROUTES.CANDIDATE.SETTINGS.INTERVIEW_HISTORY, authHandler(iTokenService), verifyCsrf, validate(PaymnetQuerySchema, 'query'), iCandidateSettingsController.interviewHistory)
router.put(ROUTES.CANDIDATE.SETTINGS.PROFILE, authHandler(iTokenService), verifyCsrf, validate(candidateProfileSchema, 'body'), iCandidateSettingsController.updateProfile)
router.get(ROUTES.CANDIDATE.SETTINGS.PROFILE, authHandler(iTokenService), iCandidateSettingsController.getProfile)

export default router