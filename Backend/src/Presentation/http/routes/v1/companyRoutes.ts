import  Express  from "express";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { authHandler } from "../../middlewares/authMiddleware";
import { iCompanySettingsController, iJobRoleController, iTokenService } from "../../controllers/factory";
import { verifyCsrf } from "../../middlewares/csrfVerify";
import { upload } from "../../middlewares/imageUpload";

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


export default router;