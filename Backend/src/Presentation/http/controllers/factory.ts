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
import { RegisterCompanyUsecase } from "../../../Application/company/usecases/auth/register.company.usecase";
import { VerifyRegisterCompanyUsecase } from "../../../Application/company/usecases/auth/verifyRegister.company.usecase";
import { ResendOtpCompanyUsecase } from "../../../Application/company/usecases/auth/resendOtp.company.usecase";
import { LoginCompanyUsecase } from "../../../Application/company/usecases/auth/login.company.usecase";
import { CompanyForgotPasswordUsecase } from "../../../Application/company/usecases/auth/forgotPassword.company.usecase";
import { CompanyResetPasswordUsecase } from "../../../Application/company/usecases/auth/resetPassword.company.usecase";
import { CandidateGoogleLoginUsecase } from "../../../Application/candidate/useCases/auth/googleLogin.candidate.usecase";
import { CompanyGoogleLoginUsecase } from "../../../Application/company/usecases/auth/company.googleLogin.usecase";
import { UnifiedGetMeUsecase } from "../../../Application/common/usecases/unified.getme.usecase";
import { UnifiedRefreshTokenUsecase } from "../../../Application/common/usecases/unified.refreshToken.usecase";
import { AdminGetAllCompaniesUsecase } from "../../../Application/admin/usecases/userManagement/admin.getAllCompanies.usecase";
import { AdminGetAllCandidates } from "../../../Application/admin/usecases/userManagement/admin.getAllCandidates";
import { VerifyCandidateForgotPasswordOtpUsecase } from "../../../Application/candidate/useCases/auth/verifyForgotpasswordOtp.candidate.usecase";
import { VerifyCompanyOtpForForgotPasswordUsecase } from "../../../Application/company/usecases/auth/company.verifyOtpForForgotpassword.usecse";
import { GetCompanyProfileUsecase } from "../../../Application/company/usecases/settings/company.getProfile.usecase";
import { UploadCompanyProfileImageUsecase } from "../../../Application/company/usecases/settings/company.uploadProfileImage.usecase";
import { CompanyChangePasswordUsecase } from "../../../Application/company/usecases/settings/company.changePassword.usecase";
import { DeleteAccountUsecase } from "../../../Application/company/usecases/settings/company.deleteAccount.usecase";
import { GetDeletedAccountDetailsUsecase } from "../../../Application/company/usecases/settings/company.getDeletedAccountDetails.usecase";
import { ConfirmRestoreAccountUsecase } from "../../../Application/company/usecases/settings/company.confirmRestoreAccount.usecase";
import { UpdateCompanyProfileUsecase } from "../../../Application/company/usecases/settings/updateProfile.company.usecase";
import { SendRestoreAccountEmailUsecase } from "../../../Application/company/usecases/settings/company.sendRestoreAccountEmail.usecase";
import { CreateJobRolesUsecase } from "../../../Application/company/usecases/jobRoles/jobRoles.create.usecase";
import { GetAllJobRolesUsecase } from "../../../Application/company/usecases/jobRoles/jobRoles.getAll.usecase";
import { EditJobRoleUsecase } from "../../../Application/company/usecases/jobRoles/jobRole.edit.usecase";
import { UpdateJobRoleStatusUsecase } from "../../../Application/company/usecases/jobRoles/jobRole.updateStatus.usecase";
import { DeleteJobRoleUsecase } from "../../../Application/company/usecases/jobRoles/jobRole.delete.usecase";
import { AdminAddCategoryUsecase } from "../../../Application/admin/usecases/category/addCategory.admin.usecase";
import { GetAllCategoryUsecase } from "../../../Application/admin/usecases/category/getAllCategory.admin.usecase";
import { AdminDeleteCategoryUsecase } from "../../../Application/admin/usecases/category/deleteCategory.admin.usecase";
import { AdminEditCategoryUsecase } from "../../../Application/admin/usecases/category/editCategory.admin.usecase";
import { AdminCreateQuestionUsecase } from "../../../Application/admin/usecases/question/admin.createQuestion.usecase";
import { AdminGetAllQuestionsUsecase } from "../../../Application/admin/usecases/question/admin.getAllQuestion.usecase";
import { AdminEditQuestionUsecase } from "../../../Application/admin/usecases/question/admin.editQuestion.usecase";
import { AdminDeleteQuestionUsecase } from "../../../Application/admin/usecases/question/admin.deleteQuestion.usecase";
import { CompanyCreateQuestionUsecase } from "../../../Application/company/usecases/question/company.createQuestion.usecase";
import { CompanyGetAllQuestionsUsecase } from "../../../Application/company/usecases/question/company.getAllQuestions.usecase";
import { CompanyEditQuestionUsecase } from "../../../Application/company/usecases/question/company.editQuestion.usecase";
import { CompanyDeleteQuestionUsecase } from "../../../Application/company/usecases/question/company.deleteQuestion.usecase";
import { AdminGetAllPracticeQuestionUsecase } from "../../../Application/admin/usecases/question/admin.getAllPracticeQuestions.usecase";
import { CompanyVerifyRegisterOtpUsecase } from "../../../Application/company/usecases/auth/company.verifyRegisterOtp.usecase";
import { AdminCreateSubscriptionPlnUsecase } from "../../../Application/admin/usecases/subscriptionPlan/subscriptionPlan.admin.create.usecase";
import { AdminGetAllSubscriptionPlanUsecase } from "../../../Application/admin/usecases/subscriptionPlan/subscriptionPlan.admin.getAll.usecase";
import { AdminEditSubscriptionPlanUsecase } from "../../../Application/admin/usecases/subscriptionPlan/subscriptionPlan.admin.edit.usecase";
import { AdminUpdateSubscriptionPlanStausUsecase } from "../../../Application/admin/usecases/subscriptionPlan/subscriptionPlan.admin.updateStatus.usecase";
import { AdminDeleteSubscriptionPlanUsecase } from "../../../Application/admin/usecases/subscriptionPlan/subscriptionPlan.admin.delete.usecase";
import { CompanyGetAllPlanUsecase } from "../../../Application/company/usecases/subscription/company.getAll.plan.usecase";
import { CompanyGetCurrentPlanUsecase } from "../../../Application/company/usecases/subscription/company.getCurrentPlan.usecase";
import { CompanyChangeSubscriptionUsecase } from "../../../Application/company/usecases/subscription/company.changeSubscription.usecase";
import { CompanyMakePaymentUsecase } from "../../../Application/company/usecases/subscription/company.makePayment.usecase";
import { CompanyConfirmPaymentUsecase } from "../../../Application/company/usecases/subscription/company.confirmPayment.usecase";
import { CompanyPaymentFailureUsecase } from "../../../Application/company/usecases/subscription/company.paymentFailure.usecase";
import { CompanyGetBillingHistoryUsecase } from "../../../Application/company/usecases/subscription/company.getBillingHistory.usecase";
import { CompanyCancelSubscriptionUsecase } from "../../../Application/company/usecases/subscription/company.cancelSubscription.usecase";
import { CompanyDownloadInvoiceUsecase } from "../../../Application/company/usecases/subscription/company.downloadInvoice.usecase";
import { CandidateGetAllPlanUsecase } from "../../../Application/candidate/useCases/subscription/candidate.getAllPlan.usecase";
import { CandidateConfirmPaymentUsecase } from "../../../Application/candidate/useCases/subscription/candidate.confirmPayment.usecase";
import { AdminCreateEmailTemplateUsecase } from "../../../Application/admin/usecases/settings/admin.createEmailTemplate.usecase";
import { AdminEditTemplateUsecase } from "../../../Application/admin/usecases/settings/admin.editTemplate.usecase";
import { AdminCreateNotificationRuleUsecase } from "../../../Application/admin/usecases/settings/admin.createNotificationRule.usecase";
import { AdminGetAllNotificationRuleUsecase } from "../../../Application/admin/usecases/settings/admin.getAllNotificationRule.usecase";





//repositories
import { CandidateRepository } from "../../../Infrastructure/repositories/candidate.repository";
import { OtpRepository } from "../../../Infrastructure/services/OtpStore";
import { AdminLoginUsecase } from "../../../Application/admin/usecases/auth/AdminLoginUsecase";
import { CompanyRepository } from "../../../Infrastructure/repositories/companyRepository";
import { AdminRepository } from "../../../Infrastructure/repositories/admin.repository";
import { JobRolesRepository } from "../../../Infrastructure/repositories/jobRoles.repository";
import { CategoryRepository } from "../../../Infrastructure/repositories/category.repository";
import { QuestionRepository } from "../../../Infrastructure/repositories/question.repository";
import { SubscriptionPlanRepository } from "../../../Infrastructure/repositories/subscriptionPlan.repository";
import { PaymentRepository } from "../../../Infrastructure/repositories/payment.repository";



//services
import { HashService } from "../../../Infrastructure/services/HashService";
import { OtpService } from "../../../Infrastructure/services/OtpService";
import { TokenService } from "../../../Infrastructure/services/TokenService";
import { MailService } from "../../../Infrastructure/services/MailService";
import { GoogleAuthService } from "../../../Infrastructure/services/GoogleAuthService";
import userRole from "../../../Domain/enums/userRole.enum";
import UserEntity from "../../../Domain/entities/user.entity";
import { UnifiedLogoutUsecase } from "../../../Application/common/usecases/unified.logout.usecase";
import { AdminGetCompanyUsecase } from "../../../Application/admin/usecases/userManagement/admin.getCompany.usecase";
import { AdminUpdateCompanyStatus } from "../../../Application/admin/usecases/userManagement/admin.updateCompanyStatus.usecase";
import { AdminUpdateCandidateStatus } from "../../../Application/admin/usecases/userManagement/admin.updateCandidateStatus.usecase";
import { AdminApproveCompanyUsecase } from "../../../Application/admin/usecases/userManagement/admin.approveCompany.usecase";
import { AdminRejectCompanyUsecase } from "../../../Application/admin/usecases/userManagement/admin.rejectCompany.usecase";
import { IAuthRepository } from "../../../Domain/repositoryInterface/iAuth.repository";
import { CompanySettingsController } from "./company/companySettingsController";
import { JobRolesController } from "./company/jobRoleController";
import { CategoryController } from "./admin/categoryController";
import { AdminQestionController } from "./admin/adminQuestionController";
import { CompanyQuestionController } from "./company/companyQuestionController";
import { CandidateGetAllPracticeQuestionsUsecase } from "../../../Application/candidate/useCases/practiceLibrary/candidate.getAllPracticeQuestion.usecase";
import { PracticeLibraryController } from "./candidate/practiceQuestionController";
import { SubscriptionPlanController } from "./admin/subscriptionPlanController";
import { CompanySubscriptionController } from "./company/subscriptionController";
import { SubscriptionRepository } from "../../../Infrastructure/repositories/subscription.repository";
import { RazorpayService } from "../../../Infrastructure/services/RazorpayService";
import { PdfService } from "../../../Infrastructure/services/PdfService";
import { CandidateSubscriptionController } from "./candidate/subscriptionController";
import { CandidateGetCurrentPlanUsecse } from "../../../Application/candidate/useCases/subscription/candidate.getCurrentPlan.usecase";
import { CandidateChangeSubscriptionUsecase } from "../../../Application/candidate/useCases/subscription/candidate.changeSubscription.usecase";
import { CandidateMakePaymentUsecase } from "../../../Application/candidate/useCases/subscription/candidate.makePayment.usecase";
import { CandidateMarkPaymentFailureUsecase } from "../../../Application/candidate/useCases/subscription/candidate.markPaymentFailure.usecase";
import { CandidateGetBillingHistoryUsecase } from "../../../Application/candidate/useCases/subscription/candidate.getBillingHistory.usecase";
import { CandidateCancelSubscriptionUsecase } from "../../../Application/candidate/useCases/subscription/candidate.cancelSubscription.usecase";
import { CandidateGetInvoiceUsecase } from "../../../Application/candidate/useCases/subscription/candidate.getInvoice.usecase";
import { TemplateRepository } from "../../../Infrastructure/repositories/template.repository";
import { AdminSettingsController } from "./admin/settingsController";
import { AdminGetAllTemplatesUsecase } from "../../../Application/admin/usecases/settings/admin.getAllTemplates.usecase";
import { NotificationRuleRepository } from "../../../Infrastructure/repositories/notificationRule.repository";


const iCandidateRepository = new CandidateRepository()
const iCompanyRepository = new CompanyRepository()
const iAdminRepository = new AdminRepository()
const iOtpRepository = new OtpRepository(redisClient)
const iJobRoleRepository = new JobRolesRepository()
const iCategoryRepository = new CategoryRepository()
const iQuestionRepository = new QuestionRepository()
const iSubscriptionPlanRepository = new SubscriptionPlanRepository()
const iSubscriptionRepository = new SubscriptionRepository()
const iPaymentRepository = new PaymentRepository()
const iTemplateREpository = new TemplateRepository()
const iNotificationRuleRepository = new NotificationRuleRepository()



const iHashService = new HashService()
const iOtpService = new OtpService()
export const iTokenService = new TokenService()
const iMailService = new MailService()
const iGoogleAuthService = new GoogleAuthService()
const iRazorpayService = new RazorpayService()
const iPdfService = new PdfService()

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
    iMailService,
    iSubscriptionRepository,
    iSubscriptionPlanRepository
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

const iVerifyCandidateForgotPasswordOtp = new VerifyCandidateForgotPasswordOtpUsecase(
    iCandidateRepository,
    iOtpService,
    iOtpRepository,
    iTokenService
)

const iResetPassword = new ResetPasswordUsecase(
    iCandidateRepository,
    iOtpService,
    iOtpRepository,
    iHashService,
    iTokenService
)

const iCandidateGoogleLogin = new CandidateGoogleLoginUsecase(
    iCandidateRepository,
    iTokenService,
    iHashService,
    iGoogleAuthService,
)
//practice
const iCandidateGetAllPracticeQuestions = new CandidateGetAllPracticeQuestionsUsecase(
    iCandidateRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository,
    iQuestionRepository
)

//subscription
const iCandidateGetAllPlans = new CandidateGetAllPlanUsecase(
    iSubscriptionPlanRepository
)
const iCandidateGetCurrentPlan = new CandidateGetCurrentPlanUsecse(
    iCandidateRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository
)
const iCandidateChangeSubscription = new CandidateChangeSubscriptionUsecase(
    iCandidateRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository
)
const iCandidateMakePayment = new CandidateMakePaymentUsecase(
    iCandidateRepository,
    iSubscriptionPlanRepository,
    iRazorpayService,
    iSubscriptionRepository,
    iPaymentRepository
)
const iCandidateConfirmPayment = new CandidateConfirmPaymentUsecase(
    iCandidateRepository,
    iPaymentRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository,
    iRazorpayService,
)
const iCandidateMarkFailure = new CandidateMarkPaymentFailureUsecase(
    iCandidateRepository,
    iPaymentRepository,
    iSubscriptionRepository
)
const iCandidateGetBillingHistory = new CandidateGetBillingHistoryUsecase (
    iCandidateRepository,
    iPaymentRepository
)
const iCandidateCancelSubscription = new CandidateCancelSubscriptionUsecase(
    iCandidateRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository
)
const iCandidateGetInvoice = new CandidateGetInvoiceUsecase(
    iCandidateRepository,
    iPaymentRepository,
    iSubscriptionPlanRepository,
    iSubscriptionRepository,
    iPdfService
)
//company
const iRegisterCompany = new RegisterCompanyUsecase(
      iCompanyRepository,
      iHashService,
      iOtpService,
      iOtpRepository,
      iMailService,
      iSubscriptionPlanRepository,
      iSubscriptionRepository
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
    iHashService,
    iMailService
)

const iCompanyVerifyRegisterOtp = new CompanyVerifyRegisterOtpUsecase(
    iCompanyRepository,
    iOtpRepository,
    iOtpService
)
const iCompanyForgotPassword = new CompanyForgotPasswordUsecase(
    iCompanyRepository,
    iMailService,
    iOtpService,
    iOtpRepository
)

const iCompanyVerifyOtpForForgotPassword = new VerifyCompanyOtpForForgotPasswordUsecase(
    iCompanyRepository,
    iOtpService,
    iOtpRepository,
    iTokenService
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

const iVerifyRegisterCompany = new VerifyRegisterCompanyUsecase(
    iCompanyRepository,
    iTokenService
)

//company settings
const iUpdateCompanyProfile = new UpdateCompanyProfileUsecase(
    iCompanyRepository
)
const iGetCompanyProfle = new GetCompanyProfileUsecase(
    iCompanyRepository
)
const iUploadCompanyProfileImage = new UploadCompanyProfileImageUsecase(
    iCompanyRepository
)
const iChangeCompanyPassword = new CompanyChangePasswordUsecase (
    iCompanyRepository,
    iHashService
)
const iDeleteAccount = new DeleteAccountUsecase(
    iCompanyRepository,
    iHashService,
    iMailService
)
const iSendRestoreAccountLink = new SendRestoreAccountEmailUsecase(
    iCompanyRepository,
    iMailService,
    iTokenService
)
const iGetDeletedAccount = new GetDeletedAccountDetailsUsecase(
    iCompanyRepository,
    iTokenService
)
const iConfirmRestoreAccount = new ConfirmRestoreAccountUsecase(
    iCompanyRepository,
    iTokenService,
    iHashService
)

//company job role
const iCreateJobRole = new CreateJobRolesUsecase(
    iCompanyRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository,
    iJobRoleRepository
)
const iGetAllJobRoles = new GetAllJobRolesUsecase (
    iCompanyRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository,
    iJobRoleRepository
)
const iEditJobRole = new EditJobRoleUsecase(
    iJobRoleRepository
)
const iUpdateJobRoleStatus = new UpdateJobRoleStatusUsecase (
    iJobRoleRepository
)
const iDeleteJobRole = new DeleteJobRoleUsecase(
    iJobRoleRepository
)

//question

const iCompanyCreateQuestion = new CompanyCreateQuestionUsecase(
    iQuestionRepository,
    iCategoryRepository
)
const iCompanyGetAllQuestions = new CompanyGetAllQuestionsUsecase (
    iCompanyRepository,
    iQuestionRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository
)
const iCompanyEditQuestion = new CompanyEditQuestionUsecase(
    iQuestionRepository,
    iCategoryRepository
)
const iCompanyDeleteQuestion = new CompanyDeleteQuestionUsecase(
    iQuestionRepository
)

//subscription

const iCompanyGetAllPlans = new CompanyGetAllPlanUsecase(
    iSubscriptionPlanRepository
)
const iCompanyGetCurrentPlan = new CompanyGetCurrentPlanUsecase(
    iCompanyRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository
)
const iCompanyChangeSubscription = new CompanyChangeSubscriptionUsecase(
    iCompanyRepository,
    iSubscriptionPlanRepository,
    iSubscriptionRepository
)
const iCompanyMakePayment = new CompanyMakePaymentUsecase(
    iCompanyRepository,
    iSubscriptionPlanRepository,
    iRazorpayService,
    iSubscriptionRepository,
    iPaymentRepository
)
const iCompanyConfirmPayment = new CompanyConfirmPaymentUsecase(
    iCompanyRepository,
    iPaymentRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository,
    iRazorpayService
)
const iCompanyMarkFailure = new CompanyPaymentFailureUsecase(
    iCompanyRepository,
    iPaymentRepository,
    iSubscriptionRepository
)
const iCompanyGetBillingHistory = new CompanyGetBillingHistoryUsecase (
    iCompanyRepository,
    iPaymentRepository
)
const iCompanyCancelSubscription = new CompanyCancelSubscriptionUsecase(
    iCompanyRepository,
    iSubscriptionRepository,
    iSubscriptionPlanRepository
)
const iCompanyGetInvoice = new CompanyDownloadInvoiceUsecase(
    iCompanyRepository,
    iPaymentRepository,
    iSubscriptionPlanRepository,
    iSubscriptionRepository,
    iPdfService
)
//admin
const iLoginAdmin = new AdminLoginUsecase(
    iAdminRepository,
    iHashService,
    iTokenService
)
const iAddCategory = new AdminAddCategoryUsecase(
    iCategoryRepository
)
const iGetAllCategory = new GetAllCategoryUsecase(
    iCategoryRepository
)
const iDeleteCategory = new AdminDeleteCategoryUsecase(
    iCategoryRepository
)
const iEditCategory = new AdminEditCategoryUsecase(
    iCategoryRepository
)

//question
const iAdminCreateQuestion = new AdminCreateQuestionUsecase(
    iQuestionRepository,
    iCategoryRepository
)
const iAdminGetAllQuestions = new AdminGetAllQuestionsUsecase(
    iQuestionRepository
)
const iAdminEditQuestion = new AdminEditQuestionUsecase(
    iQuestionRepository,
    iCategoryRepository
)
const iAdminDeleteQuestion = new AdminDeleteQuestionUsecase(
    iQuestionRepository
)
const iAdminGetAllPracticeQuestions = new AdminGetAllPracticeQuestionUsecase(
    iQuestionRepository
)

//plan
const iAdminCreateSubscriptionPlan = new AdminCreateSubscriptionPlnUsecase(
    iSubscriptionPlanRepository
)
const IAdminGetAllSubscriptionPlan = new AdminGetAllSubscriptionPlanUsecase (
    iSubscriptionPlanRepository
)
const IAdminEditSubscriptionPlan = new AdminEditSubscriptionPlanUsecase(
    iSubscriptionPlanRepository
)
const iAdminUpdatePlanStatus = new AdminUpdateSubscriptionPlanStausUsecase (
    iSubscriptionPlanRepository
)
const iDeleteSubscriptionPlan = new AdminDeleteSubscriptionPlanUsecase(
    iSubscriptionPlanRepository
)

//settings
const iAdminCreateTemplate = new AdminCreateEmailTemplateUsecase(
    iTemplateREpository
)
const iAdminGetAllTemplates = new AdminGetAllTemplatesUsecase(
    iTemplateREpository
)
const iAdminEditTemplate = new AdminEditTemplateUsecase(
    iTemplateREpository
)
const iAdminCreateNotificationRule = new AdminCreateNotificationRuleUsecase (
    iNotificationRuleRepository,
    iTemplateREpository
)
const iAdminGetAllNotificationRule = new AdminGetAllNotificationRuleUsecase(
    iNotificationRuleRepository
)
//unified
const repositoryRegistry = new Map<userRole, IAuthRepository<UserEntity>>([
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

const iApproveCompany = new AdminApproveCompanyUsecase(
    iCompanyRepository,
    iMailService
)

const iRejectCompany = new AdminRejectCompanyUsecase(
    iCompanyRepository,
    iMailService
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
    iVerifyCandidateForgotPasswordOtp,
    iResetPassword,
    iCandidateGoogleLogin,
)

export const iCompanyAuthController = new CompanyAuthController(
    iRegisterCompany,
    iResendOtpCompny,
    iLoginCompany,
    iCompanyForgotPassword,
    iCompanyVerifyOtpForForgotPassword,
    iCompanyResetPassword,
    iCompanyGoogleLogin,
    iVerifyRegisterCompany,
    iCompanyVerifyRegisterOtp
)

export const iAdminAuthController = new AdminAuthController(
    iLoginAdmin,
)

export const IUserManagementController = new UserManagementController(
    iGetAllCompanies,
    iGetAllCandidates,
    iGetCompany,
    iUpdateCompanyStatus,
    iUpdateCandidateStatus,
    iApproveCompany,
    iRejectCompany
)

export const iCompanySettingsController = new CompanySettingsController(
    iUpdateCompanyProfile,
    iGetCompanyProfle,
    iUploadCompanyProfileImage,
    iChangeCompanyPassword,
    iDeleteAccount,
    iSendRestoreAccountLink,
    iGetDeletedAccount,
    iConfirmRestoreAccount
)

export const iJobRoleController = new JobRolesController(
    iCreateJobRole,
    iGetAllJobRoles,
    iEditJobRole,
    iUpdateJobRoleStatus,
    iDeleteJobRole
)

export const iCategoryController = new CategoryController(
    iAddCategory,
    iGetAllCategory,
    iDeleteCategory,
    iEditCategory
)

export const iAdminQuestionController = new AdminQestionController(
    iAdminCreateQuestion,
    iAdminGetAllQuestions,
    iAdminGetAllPracticeQuestions,
    iAdminEditQuestion,
    iAdminDeleteQuestion,
)

export const iCompanyQuestionController = new CompanyQuestionController(
    iCompanyCreateQuestion,
    iCompanyGetAllQuestions,
    iCompanyEditQuestion,
    iCompanyDeleteQuestion
)

export const iPracticeLibraryController = new PracticeLibraryController (
    iCandidateGetAllPracticeQuestions
)

export const iSubscriptionPlanController = new SubscriptionPlanController (
    iAdminCreateSubscriptionPlan,
    IAdminGetAllSubscriptionPlan,
    IAdminEditSubscriptionPlan,
    iAdminUpdatePlanStatus,
    iDeleteSubscriptionPlan
)

export const iCompanySubscriptionController = new CompanySubscriptionController(
    iCompanyGetAllPlans,
    iCompanyGetCurrentPlan,
    iCompanyChangeSubscription,
    iCompanyMakePayment,
    iCompanyConfirmPayment,
    iCompanyMarkFailure,
    iCompanyGetBillingHistory,
    iCompanyCancelSubscription,
    iCompanyGetInvoice
)

export const iCandidateSubscriptionController = new CandidateSubscriptionController(
    iCandidateGetAllPlans,
    iCandidateGetCurrentPlan,
    iCandidateChangeSubscription,
    iCandidateMakePayment,
    iCandidateConfirmPayment,
    iCandidateMarkFailure,
    iCandidateGetBillingHistory,
    iCandidateCancelSubscription,
    iCandidateGetInvoice
)

export const iAdminSettingsController = new AdminSettingsController(
    iAdminCreateTemplate,
    iAdminGetAllTemplates,
    iAdminEditTemplate,
    iAdminCreateNotificationRule,
    iAdminGetAllNotificationRule
)