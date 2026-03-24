import Express from 'express'
import { iAdminAuthController, iCandidateAuthController, iCompanyAuthController, iUnifiedController, iTokenService } from '../../controllers/factory'
import { authHandler } from '../../middlewares/authMiddleware'
import { ROUTES } from '../../../../Shared/constsnts/routes'
const router = Express.Router()


router.get(ROUTES.AUTH.ME, authHandler(iTokenService), iUnifiedController.getMe)
router.post(ROUTES.AUTH.REFRESH, iUnifiedController.refreshToken)
router.post(ROUTES.AUTH.LOGOUT, iUnifiedController.logout )

//candidate
router.post(ROUTES.CANDIDATE.REGISTER, iCandidateAuthController.register)
router.post(ROUTES.CANDIDATE.VERIFY_OTP, iCandidateAuthController.VerifyOtp)
router.post(ROUTES.CANDIDATE.RESEND_OTP, iCandidateAuthController.resendOtp)
router.post(ROUTES.CANDIDATE.LOGIN, iCandidateAuthController.login)
router.post(ROUTES.CANDIDATE.FORGOT_PASSWORD, iCandidateAuthController.forgotPassword)
router.post(ROUTES.CANDIDATE.VERIFY_OTP_RESET, iCandidateAuthController.VerifyOtpForForgotPassword)
router.post(ROUTES.CANDIDATE.RESET_PASSWORD, iCandidateAuthController.resetPassword)
router.post(ROUTES.CANDIDATE.GOOGLE, iCandidateAuthController.googleLogin)

//company
router.post(ROUTES.COMPANY.REGISTER, iCompanyAuthController.register)
router.post(ROUTES.COMPANY.VERIFY_EMAIL, iCompanyAuthController.verifyEmail)
router.post(ROUTES.COMPANY.RESEND_OTP, iCompanyAuthController.resendOtp)
router.post(ROUTES.COMPANY.LOGIN, iCompanyAuthController.login)
router.post(ROUTES.COMPANY.FORGOT_PASSWORD, iCompanyAuthController.forgotPassword)
router.post(ROUTES.COMPANY.VERIFY_OTP_RESET,iCompanyAuthController.VerifyOtpForForgotPassword)
router.post(ROUTES.COMPANY.RESET_PASSWORD, iCompanyAuthController.resetPassword)
router.post(ROUTES.COMPANY.GOOGLE, iCompanyAuthController.googleLogin)


//admin
router.post(ROUTES.ADMIN.LOGIN, iAdminAuthController.login)



export default router;