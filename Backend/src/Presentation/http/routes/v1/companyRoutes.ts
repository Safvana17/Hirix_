import  Express  from "express";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { authHandler } from "../../middlewares/authMiddleware";
import { iCompanyQuestionController, iCompanySettingsController, iCompanySubscriptionController, iJobRoleController, iTokenService, iUnifiedSettingsController } from "../../controllers/factory";
import { verifyCsrf } from "../../middlewares/csrfVerify";
import { upload } from "../../middlewares/imageUpload";
import { validate } from "../../middlewares/validate";
import { createQuestionSchema, editQuestionSchema } from "../../validators/questionValidator";
import { createJobRoleSchema, EditJobRoleSchema, updateJobRoleSchema} from "../../validators/jobRoleValidator";
import { changePasswordSchema, deleteAccountSchema, sendRestoreLinkSchema, updateProfileSchema } from "../../validators/settingsValidator";
import { CancelSubscriptionSchema, ChangeSubscriptionSchema, ConfirmPaymnetSchema, GetInvoiceSchema, MakePaymentSchema, MarkFailureSchema, PaymnetQuerySchema } from "../../validators/subscriptionValidators";

const router = Express.Router()

//settings

router.get(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), iCompanySettingsController.getCompanyProfile)
router.put(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), verifyCsrf,upload.single('certificateFile'), validate(updateProfileSchema, 'body'), iCompanySettingsController.updateProfile)
router.put(ROUTES.COMPANY.SETTINGS.PROFILE_IMAGE, authHandler(iTokenService), verifyCsrf, upload.single('profileLogo'), iCompanySettingsController.uploadProfileImage)
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

//notifications
router.get(ROUTES.COMMON.GET_NOTIFICATIONS, authHandler(iTokenService), iUnifiedSettingsController.getNotification)
router.patch(ROUTES.COMMON.MARK_READ, authHandler(iTokenService), verifyCsrf, iUnifiedSettingsController.markAllAsRead)






export default router;