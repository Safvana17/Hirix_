import Express from 'express'
import { ROUTES } from '../../../../Shared/constsnts/routes';
import { GetInterviewAccessParamsSchema } from '../../validators/interviewValidator';
import { validate } from '../../middlewares/validate';
import { IUnifiedInterviewController } from '../../controllers/factory';

const router = Express.Router()

router.get(ROUTES.COMMON.INTERVIEW.GET_ACCESS, validate(GetInterviewAccessParamsSchema, 'params'), IUnifiedInterviewController.getInterviewAccess)
router.patch(ROUTES.COMMON.INTERVIEW.JOIN, validate(GetInterviewAccessParamsSchema, 'params'), IUnifiedInterviewController.joinInterview)
router.patch(ROUTES.COMMON.INTERVIEW.END, validate(GetInterviewAccessParamsSchema, 'params'), IUnifiedInterviewController.endInterview)



export default router;