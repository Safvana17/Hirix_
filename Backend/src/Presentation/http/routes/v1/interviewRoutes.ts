import Express from 'express'
import { ROUTES } from '../../../../Shared/constsnts/routes';
import { GetInterviewAccessParamsSchema, InterviewRunCodeSchema } from '../../validators/interviewValidator';
import { validate } from '../../middlewares/validate';
import { IUnifiedInterviewController } from '../../controllers/factory';

const router = Express.Router()

router.get(ROUTES.COMMON.INTERVIEW.GET_ACCESS, validate(GetInterviewAccessParamsSchema, 'params'), IUnifiedInterviewController.getInterviewAccess)
router.patch(ROUTES.COMMON.INTERVIEW.JOIN, validate(GetInterviewAccessParamsSchema, 'params'), IUnifiedInterviewController.joinInterview)
router.patch(ROUTES.COMMON.INTERVIEW.END, validate(GetInterviewAccessParamsSchema, 'params'), IUnifiedInterviewController.endInterview)
router.post(ROUTES.COMMON.INTERVIEW.RUN_CODE, validate(InterviewRunCodeSchema, 'body'), IUnifiedInterviewController.runCode )
router.patch(ROUTES.COMMON.INTERVIEW.CANDIDATE_LEFT, validate(GetInterviewAccessParamsSchema, 'params'), IUnifiedInterviewController.candidateLeft)

export default router;