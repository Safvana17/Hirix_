import  Express  from "express";
import { iCategoryController, iTokenService, IUserManagementController } from "../../controllers/factory";
import { authHandler } from "../../middlewares/authMiddleware";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { verifyCsrf } from "../../middlewares/csrfVerify";

const router = Express.Router()

//User management

//company
router.get(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.BASE,authHandler(iTokenService), IUserManagementController.getAllCompanies)
router.get(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.BY_ID,authHandler(iTokenService), IUserManagementController.getCompanyById)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.STATUS, authHandler(iTokenService),verifyCsrf, IUserManagementController.updateCompanyStatus)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.APPROVE, authHandler(iTokenService),verifyCsrf, IUserManagementController.approveCompany)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.REJECT, authHandler(iTokenService), verifyCsrf, IUserManagementController.rejectCompany)

//candidate
router.get(ROUTES.ADMIN.USER_MANAGEMENT.CANDIDATES.BASE, authHandler(iTokenService), IUserManagementController.getAllCandidates)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.CANDIDATES.STATUS, authHandler(iTokenService), verifyCsrf, IUserManagementController.updateCandidateStatus)


//category
router.post(ROUTES.ADMIN.CATEGORY.CREATE, authHandler(iTokenService), verifyCsrf, iCategoryController.addCategory)

export default router;               