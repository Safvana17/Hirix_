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
import { IDynamicEmailBuilderService } from "../../../interface/service/IDynamicTemplateBuilder.service";
import { IMailService } from "../../../interface/service/IMailService";
import { ProcessNotificationEventInputDTO, ProcessNotificationEventOutputDTO } from "../../dtos/settings/admin.notification.dto";
import { IAdminProcessNotificationUsecase } from "../../interfaces/settings/IAdmin.processNotification.usecase";

export class AdminProcessNotificationEventUsecase implements IAdminProcessNotificationUsecase {
  constructor(
    private _notificationRepository: INotificationRepository,
    private _notificationRuleRepository: INotificationRuleRepository,
    private _templateRepository: ITemplateRepository,
    private _mailService: IMailService,
    private _dynamicEmailBuilder: IDynamicEmailBuilderService,
    private _adminRepository: IAdminRepository
  ) {}


  async execute(request: ProcessNotificationEventInputDTO): Promise<ProcessNotificationEventOutputDTO> {
    const rules = await this._notificationRuleRepository.findByEvent(request.event)
    if (rules.length === 0) {
      throw new AppError( settingsMessages.error.NOTIFICATION_RULE_NOT_FOUND, statusCode.NOT_FOUND)
    }

    logger.info("process notification variables")
    logger.info(request.variables)

    for (const rule of rules) {
      if (!rule.isActive) {
        continue
      }
      const template = await this._templateRepository.findByKey(rule.templateKey)
      if (!template || !template.isActive || template.isDeleted) {
        continue
      }

      for (const target of request.recipients) {
        let resolvedRecipient = [target];
        if (target.recipientType === userRole.Admin && !target.recipientId ) {
          const admins = await this._adminRepository.findAll()
          resolvedRecipient = admins.map((admin) => ({
            recipientId: admin.id,
            recipientType: userRole.Admin,
            email: admin.getEmail(),
          }))
        }

        for (const recipient of resolvedRecipient) {
          if (rule.channel === "EMAIL") {
            if (!recipient.email || !template.fields) {
              continue
            }
            const {html, subject} = this._dynamicEmailBuilder.buildEmail(template, request.variables)
            await this._mailService.send({
              to: recipient.email,
              subject,
              html,
            })

            logger.info("mail sent")
          }

          if (rule.channel === "IN_APP") {
            if (!recipient.recipientId) {
              continue
            }
            const {title, message} = this._dynamicEmailBuilder.buildNotification(template, request.variables)
            const notification = new NotificationEntity(
              "",
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

    return {
      success: true,
    }
  }
}