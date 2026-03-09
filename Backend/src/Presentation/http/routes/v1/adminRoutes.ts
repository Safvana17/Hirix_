import  Express  from "express";
import { iTokenService, IUserManagementController } from "../../controllers/factory";
import { authHandler } from "../../middlewares/authMiddleware";

const router = Express.Router()

router.get('/getallcompanies',authHandler(iTokenService), IUserManagementController.getAllCompanies)
router.get('/getallcandidates', authHandler(iTokenService), IUserManagementController.getAllCandidates)
router.get('/company/:id',authHandler(iTokenService), IUserManagementController.getCompanyById)
router.patch('/company/updatestatus/:id', authHandler(iTokenService), IUserManagementController.updateCompanyStatus)
router.patch('/candidate/updatestatus/:id', authHandler(iTokenService), IUserManagementController.updateCandidateStatus)

export default router;