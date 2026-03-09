import  Express  from "express";
import { IUserManagementController } from "../controllers/factory";
// import { authHandler } from "../middlewares/authMiddleware";

const router = Express.Router()

router.get('/getallcompanies',IUserManagementController.getAllCompanies)
router.get('/getallcandidates',IUserManagementController.getAllCandidates)
router.get('/company/:id', IUserManagementController.getCompanyById)
router.patch('/company/updatestatus/:id', IUserManagementController.updateCompanyStatus)
router.patch('/candidate/updatestatus/:id', IUserManagementController.updateCandidateStatus)

export default router;