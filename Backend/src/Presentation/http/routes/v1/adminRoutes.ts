import  Express  from "express";
import { iCategoryController, iTokenService, IUserManagementController } from "../../controllers/factory";
import { authHandler } from "../../middlewares/authMiddleware";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { verifyCsrf } from "../../middlewares/csrfVerify";
import { deleteCategorySchema } from "../../validators/categoryValidator";

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
router.get(ROUTES.ADMIN.CATEGORY.GET_ALL, authHandler(iTokenService), iCategoryController.getAllCategory)
router.delete(ROUTES.ADMIN.CATEGORY.DELETE, authHandler(iTokenService), verifyCsrf, iCategoryController.deleteCategory)
router.put(ROUTES.ADMIN.CATEGORY.EDIT, authHandler(iTokenService), verifyCsrf, iCategoryController.editCategory)
export default router;               