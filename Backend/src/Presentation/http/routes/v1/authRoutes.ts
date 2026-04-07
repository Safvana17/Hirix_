import Express from 'express'
import { iAdminAuthController, iCandidateAuthController, iCompanyAuthController, iUnifiedController, iTokenService } from '../../controllers/factory'
import { authHandler } from '../../middlewares/authMiddleware'
import { ROUTES } from '../../../../Shared/constsnts/routes'
import { validate } from '../../middlewares/validate'
import { googleLoginSchema, loginSchema } from '../../validators/loginValidator'
import { forgotPasswordSchema, otpSchema, registerSchema, resendOtpSchema, resetPasswordSchema } from '../../validators/registerValidator'
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
router.post(ROUTES.COMPANY.REGISTER, validate(registerSchema, 'body'), iCompanyAuthController.register)
router.post(ROUTES.COMPANY.VERIFY_EMAIL, iCompanyAuthController.verifyEmail)
router.post(ROUTES.COMPANY.RESEND_OTP, validate(resendOtpSchema, 'body'), iCompanyAuthController.resendOtp)
router.post(ROUTES.COMPANY.LOGIN, validate(loginSchema, 'body'), iCompanyAuthController.login)
router.post(ROUTES.COMPANY.FORGOT_PASSWORD, validate(forgotPasswordSchema, 'body'), iCompanyAuthController.forgotPassword)
router.post(ROUTES.COMPANY.VERIFY_OTP_RESET, validate(otpSchema, 'body'), iCompanyAuthController.VerifyOtpForForgotPassword)
router.post(ROUTES.COMPANY.RESET_PASSWORD, validate(resetPasswordSchema, 'body'), iCompanyAuthController.resetPassword)
router.post(ROUTES.COMPANY.GOOGLE, validate(googleLoginSchema, 'body'), iCompanyAuthController.googleLogin)


//admin
router.post(ROUTES.ADMIN.LOGIN, validate(loginSchema, 'body'), iAdminAuthController.login)



export default router;