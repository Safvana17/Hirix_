import  Express  from "express";
import { iAdminQuestionController, iCategoryController, iTokenService, IUserManagementController } from "../../controllers/factory";
import { authHandler } from "../../middlewares/authMiddleware";
import { ROUTES } from "../../../../Shared/constsnts/routes";
import { verifyCsrf } from "../../middlewares/csrfVerify";
import { validate } from "../../middlewares/validate";
import { createQuestionSchema, editQuestionSchema } from "../../validators/questionValidator";

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

//questions
router.post(ROUTES.ADMIN.QUESTION.CREATE,authHandler(iTokenService), validate(createQuestionSchema, 'body'), iAdminQuestionController.createQuestion)
router.get(ROUTES.ADMIN.QUESTION.GET_ALL, authHandler(iTokenService), iAdminQuestionController.getAllQuestions)
router.put(ROUTES.ADMIN.QUESTION.EDIT, authHandler(iTokenService), verifyCsrf, validate(editQuestionSchema, 'body'), iAdminQuestionController.editQuestion)
router.delete(ROUTES.ADMIN.QUESTION.DELETE, authHandler(iTokenService), verifyCsrf, iAdminQuestionController.deleteQuestion)
export default router;               