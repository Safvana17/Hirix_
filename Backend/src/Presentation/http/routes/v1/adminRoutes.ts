import  Express  from "express";
import { iTokenService, IUserManagementController } from "../../controllers/factory";
import { authHandler } from "../../middlewares/authMiddleware";
import { ROUTES } from "../../../../Shared/constsnts/routes";

const router = Express.Router()

//User management

//company
router.get(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.BASE,authHandler(iTokenService), IUserManagementController.getAllCompanies)
router.get(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.BY_ID,authHandler(iTokenService), IUserManagementController.getCompanyById)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.STATUS, authHandler(iTokenService), IUserManagementController.updateCompanyStatus)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.APPROVE, authHandler(iTokenService), IUserManagementController.approveCompany)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.COMPANIES.REJECT, authHandler(iTokenService), IUserManagementController.rejectCompany)

//candidate
router.get(ROUTES.ADMIN.USER_MANAGEMENT.CANDIDATES.BASE, authHandler(iTokenService), IUserManagementController.getAllCandidates)
router.patch(ROUTES.ADMIN.USER_MANAGEMENT.CANDIDATES.STATUS, authHandler(iTokenService), IUserManagementController.updateCandidateStatus)


export default router;               