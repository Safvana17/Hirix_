import  Express  from "express";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { authHandler } from "../../middlewares/authMiddleware";
import { iCompanyAnalyticsController, ICompanyInterviewController, iCompanyQuestionController, iCompanySettingsController, iCompanySubscriptionController, iCompanyTestController, iJobRoleController, iTokenService, iUnifiedSettingsController } from "../../controllers/factory";
import { verifyCsrf } from "../../middlewares/csrfVerify";
import { imageUpload } from "../../middlewares/profilePicUpload";
import { validate } from "../../middlewares/validate";
import { createQuestionSchema, editQuestionSchema } from "../../validators/questionValidator";
import { createJobRoleSchema, EditJobRoleSchema, updateJobRoleSchema} from "../../validators/jobRoleValidator";
import { changePasswordSchema, deleteAccountSchema, sendRestoreLinkSchema, updateProfileSchema } from "../../validators/settingsValidator";
import { CancelSubscriptionSchema, ChangeSubscriptionSchema, ConfirmPaymnetSchema, GetInvoiceSchema, MakePaymentSchema, MarkFailureSchema, PaymnetQuerySchema, startTrialSchema } from "../../validators/subscriptionValidators";
import { certificateUpload } from "../../middlewares/certificateUpload";
import { CancelTestSchema, CompanyGetAllTestSchema, CompanyGetQuestionsForTestSchema, createTestValidator, editTestValidator, ResheduleTestSchema, TestCandidateIdSchema, TestParamsSchema, ViewSnapshotSchema } from "../../validators/companyTest.validator";
import { CancelInterviewSchema, CompanyGetAllInterviewSchema, EditInterviewSchema, InterviewParamsSchema, RescheduleInterviewSchema, ScheduleInterviewSchema, UpdateInterviewResultSchema } from "../../validators/interviewValidator";
import { GetRecentActivitySchema, GetRevenueTrendByMonthSchema } from "../../validators/analyticsValidator";

const router = Express.Router()


//settings
router.get(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), iCompanySettingsController.getCompanyProfile)
router.put(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), verifyCsrf,certificateUpload.single('certificateFile'), validate(updateProfileSchema, 'body'), iCompanySettingsController.updateProfile)
router.put(ROUTES.COMPANY.SETTINGS.PROFILE_IMAGE, authHandler(iTokenService), verifyCsrf, imageUpload.single('profileLogo'), iCompanySettingsController.uploadProfileImage)
router.put(ROUTES.COMPANY.SETTINGS.PASSWORD, authHandler(iTokenService),verifyCsrf, validate(changePasswordSchema, 'body'), iCompanySettingsController.changePassword)
router.put(ROUTES.COMPANY.SETTINGS.ACCOUNT, authHandler(iTokenService), verifyCsrf, validate(deleteAccountSchema, 'body'), iCompanySettingsController.deleteAccount)
router.post(ROUTES.COMPANY.SETTINGS.RESTORE_LINK, validate(sendRestoreLinkSchema, 'body'), iCompanySettingsController.requestRestoreLink)
router.get(ROUTES.COMPANY.SETTINGS.DETAILS, iCompanySettingsController.getDeletedAccountDetails)
router.put(ROUTES.COMPANY.SETTINGS.RESTORE, iCompanySettingsController.confirmRestoreAccount)


//job role
router.post(ROUTES.COMPANY.JOBROLE.CREATE, authHandler(iTokenService), verifyCsrf, validate(createJobRoleSchema, 'body'), iJobRoleController.createJobRole)
router.get(ROUTES.COMPANY.JOBROLE.BASE, authHandler(iTokenService), iJobRoleController.getAllJobRoles)
router.put(ROUTES.COMPANY.JOBROLE.EDIT, authHandler(iTokenService), verifyCsrf, validate(EditJobRoleSchema, 'body'), iJobRoleController.editJobRole)
router.put(ROUTES.COMPANY.JOBROLE.STATUS, authHandler(iTokenService), verifyCsrf, validate(updateJobRoleSchema, 'body'), iJobRoleController.updateStatus)
router.delete(ROUTES.COMPANY.JOBROLE.DELETE, authHandler(iTokenService), verifyCsrf, iJobRoleController.deleteJobRole)


//questions
router.post(ROUTES.COMPANY.QUESTION.CREATE, authHandler(iTokenService), verifyCsrf, validate(createQuestionSchema, 'body'), iCompanyQuestionController.createQuestion)
router.get(ROUTES.COMPANY.QUESTION.BASE, authHandler(iTokenService), iCompanyQuestionController.getAllQuestions)
router.put(ROUTES.COMPANY.QUESTION.EDIT, authHandler(iTokenService), verifyCsrf, validate(editQuestionSchema, 'body'), iCompanyQuestionController.editQuestion)
router.delete(ROUTES.COMPANY.QUESTION.DELETE, authHandler(iTokenService), verifyCsrf, iCompanyQuestionController.deleteQuestion)


//subscription
router.get(ROUTES.COMPANY.SUBSCRIPTION.GET_ALL, authHandler(iTokenService), iCompanySubscriptionController.getAllPlan)
router.get(ROUTES.COMPANY.SUBSCRIPTION.GET_CURRENT, authHandler(iTokenService), iCompanySubscriptionController.getCurrentPlan)
router.post(ROUTES.COMPANY.SUBSCRIPTION.CHANGE_SUBSCRIPTION, authHandler(iTokenService), verifyCsrf, validate(ChangeSubscriptionSchema, 'body'), iCompanySubscriptionController.changePlan)
router.post(ROUTES.COMPANY.SUBSCRIPTION.MAKE_PAYMENT, authHandler(iTokenService), verifyCsrf, validate(MakePaymentSchema, 'body'), iCompanySubscriptionController.makePayment)
router.post(ROUTES.COMPANY.SUBSCRIPTION.CONFIRM_PYMENT, authHandler(iTokenService), verifyCsrf, validate(ConfirmPaymnetSchema, 'body'), iCompanySubscriptionController.confirmPayment)
router.patch(ROUTES.COMPANY.SUBSCRIPTION.MARK_FAILURE, authHandler(iTokenService), verifyCsrf, validate(MarkFailureSchema, 'body'), iCompanySubscriptionController.markFailed)
router.get(ROUTES.COMPANY.SUBSCRIPTION.GET_BILLING_HISTORY, authHandler(iTokenService), validate(PaymnetQuerySchema, 'query'), iCompanySubscriptionController.getBillingHistory)
router.patch(ROUTES.COMPANY.SUBSCRIPTION.CANCEL, authHandler(iTokenService),verifyCsrf, validate(CancelSubscriptionSchema, 'params'), iCompanySubscriptionController.cancelSubscription)
router.get(ROUTES.COMPANY.SUBSCRIPTION.INVOICE, authHandler(iTokenService), validate(GetInvoiceSchema, 'params'), iCompanySubscriptionController.getInvoice)
router.post(ROUTES.COMPANY.SUBSCRIPTION.START_TRIAL, authHandler(iTokenService), verifyCsrf, validate(startTrialSchema, 'params'), iCompanySubscriptionController.startTrial)


//notifications
router.get(ROUTES.COMMON.GET_NOTIFICATIONS, authHandler(iTokenService), iUnifiedSettingsController.getNotification)
router.patch(ROUTES.COMMON.MARK_READ, authHandler(iTokenService), verifyCsrf, iUnifiedSettingsController.markAllAsRead)


//test
router.post(ROUTES.COMPANY.TEST.CREATE, authHandler(iTokenService), verifyCsrf, validate(createTestValidator, 'body'), iCompanyTestController.createTestDraft)
router.post(ROUTES.COMPANY.TEST.PUBLISH, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), iCompanyTestController.publishTest)
router.get(ROUTES.COMPANY.TEST.GET_QUESTIONS, authHandler(iTokenService), verifyCsrf, validate(CompanyGetQuestionsForTestSchema, 'query'), iCompanyTestController.getAllQuestionsForTest)
router.get(ROUTES.COMPANY.TEST.GET_ALL, authHandler(iTokenService), validate(CompanyGetAllTestSchema, 'query'), iCompanyTestController.getAllTests)
router.delete(ROUTES.COMPANY.TEST.DELETE, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), iCompanyTestController.deleteTest )
router.patch(ROUTES.COMPANY.TEST.CANCEL, authHandler(iTokenService), verifyCsrf, validate(CancelTestSchema, 'body'), validate(TestParamsSchema, 'params'), iCompanyTestController.cancelTest)
router.patch(ROUTES.COMPANY.TEST.RESHEDULE, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), validate(ResheduleTestSchema, 'body'), iCompanyTestController.resheduleTest)
router.get(ROUTES.COMPANY.TEST.GET_BY_ID, authHandler(iTokenService), validate(TestParamsSchema, 'params'), iCompanyTestController.getTestById)
router.post(ROUTES.COMPANY.TEST.EDIT, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), validate(editTestValidator, 'body'), iCompanyTestController.editTest)
router.post(ROUTES.COMPANY.TEST.EVALUATE, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), iCompanyTestController.evaluateTest)
router.patch(ROUTES.COMPANY.TEST.SHORTLIST, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), validate(TestCandidateIdSchema, 'body'), iCompanyTestController.shortlistCandidate)
router.patch(ROUTES.COMPANY.TEST.REJECT, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), validate(TestCandidateIdSchema, 'body'), iCompanyTestController.rejectCandidate)
router.post(ROUTES.COMPANY.TEST.SCHEDULE_AGAIN, authHandler(iTokenService), verifyCsrf, validate(TestParamsSchema, 'params'), validate(createTestValidator, 'body'), iCompanyTestController.scheduleTestAgain)
router.get(ROUTES.COMPANY.TEST.GET_SNAPSHOTS, authHandler(iTokenService), verifyCsrf, validate(ViewSnapshotSchema, 'params'), iCompanyTestController.viewSnapshots)


//interview
router.post(ROUTES.COMPANY.INTERVIEW.SCHEDULE, authHandler(iTokenService), verifyCsrf, validate(ScheduleInterviewSchema, 'body'), ICompanyInterviewController.scheduleInterview)
router.get(ROUTES.COMPANY.INTERVIEW.GET_ALL, authHandler(iTokenService), verifyCsrf, validate(CompanyGetAllInterviewSchema, 'query'), ICompanyInterviewController.getAllInterviews)
router.patch(ROUTES.COMPANY.INTERVIEW.CANCEL, authHandler(iTokenService), verifyCsrf, validate(InterviewParamsSchema, 'params'), validate(CancelInterviewSchema, 'body'), ICompanyInterviewController.cancelInterview)
router.patch(ROUTES.COMPANY.INTERVIEW.RESCHEDULE, authHandler(iTokenService), verifyCsrf, validate(InterviewParamsSchema, 'params'), validate(RescheduleInterviewSchema, 'body'), ICompanyInterviewController.rescheduleInterview)
router.get(ROUTES.COMPANY.INTERVIEW.BY_ID, authHandler(iTokenService), verifyCsrf, validate(InterviewParamsSchema, 'params'), ICompanyInterviewController.getInterviewById)
router.put(ROUTES.COMPANY.INTERVIEW.EDIT, authHandler(iTokenService), verifyCsrf, validate(InterviewParamsSchema, 'params'), validate(EditInterviewSchema, 'body'), ICompanyInterviewController.editInterview)
router.patch(ROUTES.COMPANY.INTERVIEW.UPDATE_RESULT, authHandler(iTokenService), verifyCsrf, validate(InterviewParamsSchema, 'params'), validate(UpdateInterviewResultSchema, 'body'), ICompanyInterviewController.updateInterviewResult)
router.patch(ROUTES.COMPANY.INTERVIEW.SEND_OFFER, authHandler(iTokenService), validate(InterviewParamsSchema, 'params'), ICompanyInterviewController.sendOffer)


//dashboard
router.get(ROUTES.COMPANY.ANALYTICS.DASHBOARD_SUMMERY, authHandler(iTokenService), iCompanyAnalyticsController.dashboardSummery)
router.get(ROUTES.COMPANY.ANALYTICS.TEST_TREND, authHandler(iTokenService), validate(GetRevenueTrendByMonthSchema, 'query'), iCompanyAnalyticsController.testParticipationTrend)
router.get(ROUTES.COMPANY.ANALYTICS.STATUS_DISTRIBUTION, authHandler(iTokenService), validate(GetRevenueTrendByMonthSchema, 'query'), iCompanyAnalyticsController.candidateStatusDistribution)
router.get(ROUTES.COMPANY.ANALYTICS.RECENT_ACTIVITIES, authHandler(iTokenService), validate(GetRecentActivitySchema, 'query'), iCompanyAnalyticsController.getRecentActivity)


export default router;