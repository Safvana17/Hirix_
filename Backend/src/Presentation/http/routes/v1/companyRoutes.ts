import  Express  from "express";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { authHandler } from "../../middlewares/authMiddleware";
import { iCompanyQuestionController, iCompanySettingsController, iJobRoleController, iTokenService } from "../../controllers/factory";
import { verifyCsrf } from "../../middlewares/csrfVerify";
import { upload } from "../../middlewares/imageUpload";
import { validate } from "../../middlewares/validate";
import { createQuestionSchema, editQuestionSchema } from "../../validators/questionValidator";

const router = Express.Router()

//settings

router.get(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), iCompanySettingsController.getCompanyProfile)
router.put(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), verifyCsrf, iCompanySettingsController.updateProfile)
router.put(ROUTES.COMPANY.SETTINGS.PROFILE_IMAGE, authHandler(iTokenService), verifyCsrf, upload.single('profileLogo'), iCompanySettingsController.uploadProfileImage)
router.put(ROUTES.COMPANY.SETTINGS.PASSWORD, authHandler(iTokenService),verifyCsrf, iCompanySettingsController.changePassword)
router.put(ROUTES.COMPANY.SETTINGS.ACCOUNT, authHandler(iTokenService), verifyCsrf, iCompanySettingsController.deleteAccount)
router.post(ROUTES.COMPANY.SETTINGS.RESTORE_LINK, iCompanySettingsController.requestRestoreLink)
router.get(ROUTES.COMPANY.SETTINGS.DETAILS, iCompanySettingsController.getDeletedAccountDetails)
router.put(ROUTES.COMPANY.SETTINGS.RESTORE, iCompanySettingsController.confirmRestoreAccount)

//job role
router.post(ROUTES.COMPANY.JOBROLE.CREATE, authHandler(iTokenService), verifyCsrf, iJobRoleController.createJobRole)
router.get(ROUTES.COMPANY.JOBROLE.BASE, authHandler(iTokenService), verifyCsrf, iJobRoleController.getAllJobRoles)
router.put(ROUTES.COMPANY.JOBROLE.EDIT, authHandler(iTokenService), verifyCsrf, iJobRoleController.editJobRole)
router.put(ROUTES.COMPANY.JOBROLE.STATUS, authHandler(iTokenService), verifyCsrf, iJobRoleController.updateStatus)
router.delete(ROUTES.COMPANY.JOBROLE.DELETE, authHandler(iTokenService), verifyCsrf, iJobRoleController.deleteJobRole)

//questions
router.post(ROUTES.COMPANY.QUESTION.CREATE, authHandler(iTokenService), verifyCsrf, validate(createQuestionSchema, 'body'), iCompanyQuestionController.createQuestion)
router.get(ROUTES.COMPANY.QUESTION.BASE, authHandler(iTokenService), iCompanyQuestionController.getAllQuestions)
router.put(ROUTES.COMPANY.QUESTION.EDIT, authHandler(iTokenService), verifyCsrf, validate(editQuestionSchema, 'body'), iCompanyQuestionController.editQuestion)
router.delete(ROUTES.COMPANY.QUESTION.DELETE, authHandler(iTokenService), verifyCsrf, iCompanyQuestionController.deleteQuestion)
export default router;