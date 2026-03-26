import  Express  from "express";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { authHandler } from "../../middlewares/authMiddleware";
import { iCompanySettingsController, iTokenService } from "../../controllers/factory";
import { verifyCsrf } from "../../middlewares/csrfVerify";

const router = Express.Router()

router.get(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), iCompanySettingsController.getCompanyProfile)
router.put(ROUTES.COMPANY.SETTINGS.PROFILE, authHandler(iTokenService), verifyCsrf, iCompanySettingsController.updateProfile)

export default router;