import { redisClient } from "../../../Infrastructure/config/redis.config";
//controllers
import { CandidateAuthController } from "./candidate/authController";
import { CompanyAuthController } from "./company/authController";
import { AdminAuthController } from "./admin/authController";
import { UnifiedAuthController } from "./common/unifiedAuthController";
import { UserManagementController } from "./admin/userManagementController";

//use case
import { RegisterCandidateUsecase } from "../../../Application/candidate/useCases/auth/register.candidate.usecase";
import { VerifyRegisterCandidateOtpUsecase } from "../../../Application/candidate/useCases/auth/verifyRegister.candidate.usecase";
import { ForgotPasswordUsecase  } from "../../../Application/candidate/useCases/auth/forgotPassword.candidate.usecase";
import { ResetPasswordUsecase } from "../../../Application/candidate/useCases/auth/resetPassword.candidate.usecase";
import { LoginCandidateUsecase } from "../../../Application/candidate/useCases/auth/login.candidate.usecase";
import { ResendOtpUsecase } from "../../../Application/candidate/useCases/auth/resendOtp.candidate.usecase";
import { RegisterCompanyUsecase } from "../../../Application/company/usecases/register.company.usecase";
import { VerifyRegisterCompanyUsecase } from "../../../Application/company/usecases/verifyRegister.company.usecase";
import { ResendOtpCompanyUsecase } from "../../../Application/company/usecases/resendOtp.company.usecase";
import { LoginCompanyUsecase } from "../../../Application/company/usecases/login.company.usecase";
import { CompanyForgotPasswordUsecase } from "../../../Application/company/usecases/forgotPassword.company.usecase";
import { CompanyResetPasswordUsecase } from "../../../Application/company/usecases/resetPassword.company.usecase";
import { CandidateGoogleLoginUsecase } from "../../../Application/candidate/useCases/auth/googleLogin.candidate.usecase";
import { CompanyGoogleLoginUsecase } from "../../../Application/company/usecases/company.googleLogin.usecase";
import { UnifiedGetMeUsecase } from "../../../Application/common/usecases/unified.getme.usecase";
import { UnifiedRefreshTokenUsecase } from "../../../Application/common/usecases/unified.refreshToken.usecase";
import { AdminGetAllCompaniesUsecase } from "../../../Application/admin/usecases/userManagement/admin.getAllCompanies.usecase";
import { AdminGetAllCandidates } from "../../../Application/admin/usecases/userManagement/admin.getAllCandidates";



//repositories
import { CandidateRepository } from "../../../Infrastructure/repositories/candidate.repository";
import { OtpRepository } from "../../../Infrastructure/services/OtpStore";
import { AdminLoginUsecase } from "../../../Application/admin/usecases/auth/AdminLoginUsecase";
import { CompanyRepository } from "../../../Infrastructure/repositories/companyRepository";
import { AdminRepository } from "../../../Infrastructure/repositories/admin.repository";


//services
import { HashService } from "../../../Infrastructure/services/HashService";
import { OtpService } from "../../../Infrastructure/services/OtpService";
import { TokenService } from "../../../Infrastructure/services/TokenService";
import { MailService } from "../../../Infrastructure/services/MailService";
import { GoogleAuthService } from "../../../Infrastructure/services/GoogleAuthService";
import userRole from "../../../Domain/enums/userRole.enum";
import UserEntity from "../../../Domain/entities/user.entity";
import { IBaseRepository } from "../../../Domain/repositoryInterface/iBase.repository";
import { UnifiedLogoutUsecase } from "../../../Application/common/usecases/unified.logout.usecase";
import { AdminGetCompanyUsecase } from "../../../Application/admin/usecases/userManagement/admin.getCompany.usecase";
import { AdminUpdateCompanyStatus } from "../../../Application/admin/usecases/userManagement/admin.updateCompanyStatus.usecase";
import { AdminUpdateCandidateStatus } from "../../../Application/admin/usecases/userManagement/admin.updateCandidateStatus.usecase";



const iCandidateRepository = new CandidateRepository()
const iCompanyRepository = new CompanyRepository()
const iAdminRepository = new AdminRepository()
const iOtpRepository = new OtpRepository(redisClient)

const iHashService = new HashService()
const iOtpService = new OtpService()
export const iTokenService = new TokenService()
const iMailService = new MailService()
const iGoogleAuthService = new GoogleAuthService()


//candidates
const iVerifyRegisterCandidate = new VerifyRegisterCandidateOtpUsecase(
    iCandidateRepository,
    iOtpRepository,
    iOtpService,
    iTokenService
)
const iRegisterCandidate = new RegisterCandidateUsecase(
    iCandidateRepository,
    iHashService,
    iOtpService,
    iOtpRepository,
    iMailService
)

const iResendOtp = new ResendOtpUsecase(
    iCandidateRepository,
    iOtpService,
    iOtpRepository,
    iMailService
)

const iLoginCandidate = new LoginCandidateUsecase(
    iCandidateRepository,
    iTokenService,
    iHashService
)

const iForgotPassword = new ForgotPasswordUsecase(
    iCandidateRepository,
    iOtpService,
    iOtpRepository,
    iMailService
)

const iResetPassword = new ResetPasswordUsecase(
    iCandidateRepository,
    iOtpService,
    iOtpRepository,
    iHashService
)

const iCandidateGoogleLogin = new CandidateGoogleLoginUsecase(
    iCandidateRepository,
    iTokenService,
    iHashService,
    iGoogleAuthService,
)


//company
const iRegisterCompany = new RegisterCompanyUsecase(
      iCompanyRepository,
      iOtpService,
      iOtpRepository,
      iHashService,
      iMailService
)

const iVerifyCompany = new VerifyRegisterCompanyUsecase(
    iCompanyRepository,
    iOtpService,
    iOtpRepository
)

const iResendOtpCompny = new ResendOtpCompanyUsecase(
    iCompanyRepository,
    iMailService,
    iOtpRepository,
    iOtpService
)

const iLoginCompany = new LoginCompanyUsecase(
    iCompanyRepository,
    iTokenService,
    iHashService
)

const iCompanyForgotPassword = new CompanyForgotPasswordUsecase(
    iCompanyRepository,
    iMailService,
    iOtpService,
    iOtpRepository
)

const iCompanyResetPassword = new CompanyResetPasswordUsecase(
    iCompanyRepository,
    iOtpRepository,
    iOtpService,
    iHashService
)

const iCompanyGoogleLogin = new CompanyGoogleLoginUsecase(
    iCompanyRepository,
    iTokenService,
    iHashService,
    iGoogleAuthService
)


//admin
const iLoginAdmin = new AdminLoginUsecase(
    iAdminRepository,
    iHashService,
    iTokenService
)


//unified
const repositoryRegistry = new Map<userRole, IBaseRepository<UserEntity>>([
    [userRole.Candidate, iCandidateRepository],
    [userRole.Company, iCompanyRepository],
    [userRole.Admin, iAdminRepository]
]);


const iUnifiedGetMe = new UnifiedGetMeUsecase(
    repositoryRegistry
)

const iUnifiedRefreshToken = new UnifiedRefreshTokenUsecase(
    repositoryRegistry,
    iTokenService,
    iHashService
)
const iUnifiedLogout = new UnifiedLogoutUsecase(
    repositoryRegistry,
    iHashService,
    iTokenService
)

//userManagement

const iGetAllCompanies = new AdminGetAllCompaniesUsecase(
    iCompanyRepository
)

const iGetAllCandidates = new AdminGetAllCandidates(
    iCandidateRepository
)

const iGetCompany = new AdminGetCompanyUsecase(
    iCompanyRepository
)

const iUpdateCompanyStatus = new AdminUpdateCompanyStatus(
    iCompanyRepository
)

const iUpdateCandidateStatus = new AdminUpdateCandidateStatus(
    iCandidateRepository
)

//controller
export const iUnifiedController = new UnifiedAuthController(
    iUnifiedGetMe,
    iUnifiedRefreshToken,
    iUnifiedLogout
)

export const iCandidateAuthController = new CandidateAuthController(
    iRegisterCandidate,
    iVerifyRegisterCandidate,
    iResendOtp,
    iLoginCandidate,
    iForgotPassword,
    iResetPassword,
    iCandidateGoogleLogin,
)

export const iCompanyAuthController = new CompanyAuthController(
    iRegisterCompany,
    iVerifyCompany,
    iResendOtpCompny,
    iLoginCompany,
    iCompanyForgotPassword,
    iCompanyResetPassword,
    iCompanyGoogleLogin,
  
)

export const iAdminAuthController = new AdminAuthController(
    iLoginAdmin,
)

export const IUserManagementController = new UserManagementController(
    iGetAllCompanies,
    iGetAllCandidates,
    iGetCompany,
    iUpdateCompanyStatus,
    iUpdateCandidateStatus
)