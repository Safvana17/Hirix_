import { NotificationEntity } from "../../../../Domain/entities/notification.entity";
import { AppError } from "../../../../Domain/errors/app.error";
import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { INotificationRepository } from "../../../../Domain/repositoryInterface/notification.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IMailService } from "../../../interface/service/IMailService";
import { ITemplateRenderService } from "../../../interface/service/ITemplateRenderService";
import { ProcessNotificationEventInputDTO, ProcessNotificationEventOutputDTO } from "../../dtos/settings/admin.notification.dto";
import { IAdminProcessNotificationUsecase } from "../../interfaces/settings/IAdmin.processNotification.usecase";

export class AdminProcessNotificationEventUsecase implements IAdminProcessNotificationUsecase{
    constructor(
        private _notificationRepository: INotificationRepository,
        private _notificationRuleRepository: INotificationRuleRepository,
        private _templateRepository: ITemplateRepository,
        private _mailService: IMailService,
        private _templateRender: ITemplateRenderService
    ) {}

    async execute(request: ProcessNotificationEventInputDTO): Promise<ProcessNotificationEventOutputDTO> {
        const rules = await this._notificationRuleRepository.findByEvent(request.event)
        if(rules.length === 0){
            throw new AppError(settingsMessages.error.NOTIFICATION_RULE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        for(let rule of rules){
            if(!rule.isActive){
                continue
            }
            const template = await this._templateRepository.findByKey(rule.templateKey)
            if(!template || !template.isActive || template.isDeleted){
                continue
            }

            for(let recipient of request.recipients){
                if(rule.channel === 'EMAIL'){
                    if(!recipient.email || !template.subject){
                        continue
                    }
                    const subject = this._templateRender.render(template.subject, request.variables)
                    const body = this._templateRender.render(template.body, request.variables)

                    await this._mailService.send({
                        to: recipient.email,
                        subject,
                        html: body
                    })
                }
                if(rule.channel === 'IN_APP'){
                    if(!recipient.recipientId || !template.title){
                        continue
                    }
                    const title = this._templateRender.render(template.title, request.variables)
                    const message = this._templateRender.render(template.body, request.variables)

                    const notification = new NotificationEntity(
                        '',
                        recipient.recipientId,
                        recipient.recipientType,
                        request.event,
                        title,
                        message,
                        false,
                        request.metaData ?? {}
                    )

                    await this._notificationRepository.create(notification)
                }
            }
        }

        return{
            success: true
        }
    }
}