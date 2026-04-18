import { JobRolesEntity } from "../../../../Domain/entities/JobRoles.entity";
import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CreateJobRolesInputDTO, CreateJobRolesOutputDTO } from "../../dtos/jobRoles/jobRoles.create.dto";
import { ICreateJobRolesUsecase } from "../../interfaces/jobRoles/iJobRols.create.usecase";

export class CreateJobRolesUsecase implements ICreateJobRolesUsecase {
    constructor(
        private _comapnyRepository: ICompanyRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _jobRolesRepository: IJobRepository
    ) {}


    /**
     * 
     * @param request name, skills, experience and openings
     * @returns new job role
     */
    async execute(request: CreateJobRolesInputDTO): Promise<CreateJobRolesOutputDTO> {
        const comapny = await this._comapnyRepository.findById(request.companyId)
        if(!comapny){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const subscription = await this._subscriptionRepository.findCurrentByUserId(comapny.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const plan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const now = new Date()
        const jobRoleLimit = plan.maxJobRolesPerMonth
        if(jobRoleLimit != null){
           const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
           const endOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0, 23, 59, 59)
           const currentCount = await this._jobRolesRepository.CountJobRoleInMonth(comapny.id, startOfMonth, endOfMonth)
           if(currentCount >= jobRoleLimit){
            throw new AppError(JobRoleMessages.error.JOBROLE_LIMIT_EXCEEDED, statusCode.BAD_REQUEST, 'FEATURE_LOCKED')
           }
        }
        
        const existing = await this._jobRolesRepository.findActiveByName(request.name, request.companyId)
        if(existing ){
            throw new AppError(JobRoleMessages.error.ALREADY_EXIST, statusCode.CONFLICT)
        }

        if(request.experienceMin > request.experienceMax){
            throw new AppError(JobRoleMessages.error.INVALID_EXPERIENCE, statusCode.BAD_REQUEST)
        }

        if(request.openings < 1){
            throw new AppError(JobRoleMessages.error.INVALID_OPENINGS, statusCode.BAD_REQUEST)
        }
        
        const jobRole = new JobRolesEntity(
            "",
            request.name,
            request.skills,
            request.experienceMin,
            request.experienceMax,
            request.openings,
            true,
            false,
            request.companyId,
            jobRoleStatus.Active
        )

        const newJobRole = await this._jobRolesRepository.create(jobRole)

        return { 
            name: newJobRole.name,
            skills: newJobRole.skills,
            experienceMin: newJobRole.experienceMin,
            experienceMax: newJobRole.experienceMax,
            openings: newJobRole.openings,
            status: newJobRole.status    
        }
    }
}