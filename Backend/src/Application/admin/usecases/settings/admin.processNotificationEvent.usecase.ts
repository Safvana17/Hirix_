import { NotificationEntity } from "../../../../Domain/entities/notification.entity";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import IAdminRepository from "../../../../Domain/repositoryInterface/iAdmin.repository";
import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { INotificationRepository } from "../../../../Domain/repositoryInterface/notification.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IMailService } from "../../../interface/service/IMailService";
import { ITemplateRenderService } from "../../../interface/service/ITemplateRenderService";
import { ITextFormatterService } from "../../../interface/service/ITextFormattingService";
import { ProcessNotificationEventInputDTO, ProcessNotificationEventOutputDTO } from "../../dtos/settings/admin.notification.dto";
import { IAdminProcessNotificationUsecase } from "../../interfaces/settings/IAdmin.processNotification.usecase";

export class AdminProcessNotificationEventUsecase implements IAdminProcessNotificationUsecase{
    constructor(
        private _notificationRepository: INotificationRepository,
        private _notificationRuleRepository: INotificationRuleRepository,
        private _templateRepository: ITemplateRepository,
        private _mailService: IMailService,
        private _templateRender: ITemplateRenderService,
        private _textFormatService: ITextFormatterService,
        private _adminRepository: IAdminRepository
    ) {}

    async execute(request: ProcessNotificationEventInputDTO): Promise<ProcessNotificationEventOutputDTO> {
        const rules = await this._notificationRuleRepository.findByEvent(request.event)
        if(rules.length === 0){
            throw new AppError(settingsMessages.error.NOTIFICATION_RULE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        logger.info('process notification variables')
        logger.info(request.variables)
        for(let rule of rules){
            if(!rule.isActive){
                continue
            }
            const template = await this._templateRepository.findByKey(rule.templateKey)
            if(!template || !template.isActive || template.isDeleted){
                continue
            }

            for(let target  of request.recipients){
                let resolvedRecipient = [target]
                if(target.recipientType === userRole.Admin && !target.recipientId){
                    const admins = await this._adminRepository.findAll()
                    resolvedRecipient = admins.map((admin) => ({
                        recipientId: admin.id,
                        recipientType: userRole.Admin,
                        email: admin.getEmail()
                    }))
                }
                for (const recipient of resolvedRecipient){
                    if(rule.channel === 'EMAIL'){
                        if(!recipient.email || !template.subject){
                            continue
                        }
                        const subject = this._templateRender.render(template.subject, request.variables)
                        const rawBody = this._templateRender.render(template.body, request.variables)
                        const title = this._templateRender.render(template.title ?? '', request.variables)
                        const footerText = this._templateRender.render(template.footerText ?? '', request.variables)
                        const ctaText = this._templateRender.render(template.ctaText ?? '', request.variables)
                        const ctaUrl = this._templateRender.render(template.ctaUrl ?? '', request.variables)
                        const otpLabel = this._templateRender.render(template.otpLabel ?? '', request.variables)
                        const expiryText = this._templateRender.render(template.expiryText ?? '', request.variables)
                        const supportText = this._templateRender.render(template.supportText ?? '', request.variables)

                        const formattedBody = this._textFormatService.format(rawBody)
                        console.log('layout input:', {
                                otpCode: request.variables.otpCode,
                                showOtpBox: template.showOtpBox,
                                otpLabel,
                                expiryText
                                })
                        const html = this._mailService.build({
                            title,
                            body: formattedBody,
                            footerText,
                            ctaText,
                            ctaUrl,
                            otpCode: request.variables.otpCode,
                            otpLabel,
                            expiryText,
                            supportEmail: request.variables.supportEmail,
                            supportText,
                            platformName: request.variables.platformName ?? 'Hirix',
                            showOtpBox: template.showOtpBox ?? false
                        })
                        await this._mailService.send({
                            to: recipient.email,
                            subject,
                            html
                        })
                        logger.info('mail sent')
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
        }

        return{
            success: true
        }
    }
}