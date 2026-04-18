import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { JobRolesQueryDTO, PaginatedJobRolesDTO } from "../../dtos/jobRoles/jobRole.getAll.dto";
import { IGetAllJobRolesUsecase } from "../../interfaces/jobRoles/iJobRoles.getAll.usecase";

export class GetAllJobRolesUsecase implements IGetAllJobRolesUsecase {
    constructor(
        private _comapnyRepository: ICompanyRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    /**
     * 
     * @param request 
     * @returns - all job roles
     */
    async execute(request: JobRolesQueryDTO): Promise<PaginatedJobRolesDTO> {
        const comapny = await this._comapnyRepository.findById(request.userId)
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
        let currentCount = 0
        if(jobRoleLimit != null){
           const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
           const endOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0, 23, 59, 59)
           currentCount = await this._jobRoleRepository.CountJobRoleInMonth(comapny.id, startOfMonth, endOfMonth)
        }
        const {data, totalPages, totalCount} = await this._jobRoleRepository.findAllFiltered(request)
        return {
            jobRoles: data.map((d) => ({
                id: d.id,
                name: d.name,
                skills: d.skills,
                experienceMin: d.experienceMin,
                experienceMax: d.experienceMax,
                openings: d.openings,
                status: d.status
            })),
            totalCount,
            totalPages,
            featureLocked: currentCount >= jobRoleLimit!
        }
    }
}