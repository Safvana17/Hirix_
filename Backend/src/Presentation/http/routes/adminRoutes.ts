import  Express  from "express";
import { IUserManagementController } from "../controllers/factory";
// import { authHandler } from "../middlewares/authMiddleware";

const router = Express.Router()

router.get('/getallcompanies',IUserManagementController.getAllCompanies)
router.get('/getallcandidates',IUserManagementController.getAllCandidates)


export default router;