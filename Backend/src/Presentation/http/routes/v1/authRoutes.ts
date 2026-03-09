import Express from 'express'
import { iAdminAuthController, iCandidateAuthController, iCompanyAuthController, iUnifiedController, iTokenService } from '../../controllers/factory'
import { authHandler } from '../../middlewares/authMiddleware'
const router = Express.Router()


router.get('/me', authHandler(iTokenService), iUnifiedController.getMe)
router.post('/refresh', iUnifiedController.refreshToken)
router.post('/logout', iUnifiedController.logout )

//candidate
router.post('/candidate/register', iCandidateAuthController.register)
router.post('/candidate/verifyotp', iCandidateAuthController.VerifyOtp)
router.post('/candidate/resendotp', iCandidateAuthController.resendOtp)
router.post('/candidate/login', iCandidateAuthController.login)
router.post('/candidate/forgotpassword', iCandidateAuthController.forgotPassword)
router.post('/candidate/resetpassword', iCandidateAuthController.resetPassword)
router.post('/candidate/google-login', iCandidateAuthController.googleLogin)

//company
router.post('/company/register', iCompanyAuthController.register)
router.post('/company/verifyotp', iCompanyAuthController.verifyOtp)
router.post('/company/resendotp', iCompanyAuthController.resendOtp)
router.post('/company/login', iCompanyAuthController.login)
router.post('/company/forgotpassword', iCompanyAuthController.forgotPassword)
router.post('/company/resetpassword', iCompanyAuthController.resetPassword)
router.post('/company/google-login', iCompanyAuthController.googleLogin)


//admin
router.post('/admin/login', iAdminAuthController.login)



export default router;