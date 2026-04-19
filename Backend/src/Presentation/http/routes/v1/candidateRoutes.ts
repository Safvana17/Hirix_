import Express from 'express'
import { ROUTES } from '../../../../Shared/constsnts/routes'
import { authHandler } from '../../middlewares/authMiddleware'
import { iCandidateSubscriptionController, iPracticeLibraryController, iTokenService } from '../../controllers/factory'


const router = Express.Router()

//practice
router.get(ROUTES.CANDIDATE.PRACTICE.GET_ALL, authHandler(iTokenService), iPracticeLibraryController.getAllPracticeQuestions)

//subscription
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_ALL, authHandler(iTokenService), iCandidateSubscriptionController.getAllPlan)
router.get(ROUTES.CANDIDATE.SUBSCRIPTION.GET_CURRENT, authHandler(iTokenService), iCandidateSubscriptionController.getCurrentPlan)










export default router