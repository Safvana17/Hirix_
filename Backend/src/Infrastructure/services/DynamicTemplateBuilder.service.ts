import { BuildNotificationTemplate, BuilEmailTemplate, IDynamicEmailBuilderService } from "../../Application/interface/service/IDynamicTemplateBuilder.service";
import { ITemplateRenderService } from "../../Application/interface/service/ITemplateRenderService";
import { ITextFormatterService } from "../../Application/interface/service/ITextFormattingService";
import { TemplateEntity, TemplateField } from "../../Domain/entities/Template.entity";
import { TemplateFieldPurpose } from "../../Domain/enums/notification";

export class DynamicEmailBuilderService implements IDynamicEmailBuilderService {
    constructor(
        private _templateRender: ITemplateRenderService,
        private _textFormatter: ITextFormatterService
    ) {}

    buildEmail(template: TemplateEntity, variables: Record<string, string>): BuilEmailTemplate {
        const subject = this.getTextByPurpose(template, "SUBJECT", variables)
        const title = this.getTextByPurpose(template, 'TITLE', variables)
        const sections = template.fields.filter((field) => field.purpose !== 'SUBJECT' && field.purpose !== 'TITLE')
                .sort((a, b) => a.order - b.order)
                .map((field) => this.buildSection(field, template, variables))
                .filter((section) => section.length > 0)
        
        const html = this.wrapLayout({title, sections, signatureName: variables.signatureName?? variables.companyName ?? variables.platformName ?? "Hirix"})

        return {
            subject,
            html
        }
    }

    buildNotification(template: TemplateEntity, variables: Record<string, string>): BuildNotificationTemplate {
        const title = this.getTextByPurpose(template, 'TITLE', variables)
        const message = template.fields.filter((field) => field.purpose !== 'SUBJECT' && field.purpose !== 'TITLE')
                .sort((a, b) => a.order - b.order)
                .map((field) => {
                    const value = template.values[field.name]
                    if(value === undefined || value === null) return ""
                    if(field.type === 'button' || field.type === 'checkbox') return ""
                    const renderValue = this._templateRender.render(String(value), variables)
                    return renderValue.trim()
                })
                .filter(Boolean)
                .join("\n\n")
        return {
            title,
            message
        }
    }

    private getTextByPurpose(template: TemplateEntity, purpose: TemplateFieldPurpose, variables: Record<string, string>): string {
        const field = template.fields.find((item) => item.purpose === purpose)
        if(!field) return ""
        const value = template.values[field.name]
        if(typeof value !== 'string') return ""
        return this._templateRender.render(value, variables)
    }

    private buildSection(field: TemplateField, template: TemplateEntity, variables: Record<string, string>): string {
        const value = template.values[field.name]
        if(field.type === 'button'){
            return this.buildButtonSection(value, variables)
        }
        if(field.purpose === 'OTP_CODE') {
            const renderedValue = this._templateRender.render(String(value), variables)
            return `
              <div style="text-align:center; margin:24px 0;">
                <div style="font-size:13px; color:#6b7280; margin-bottom:10px">
                   OTP
                </div>
                <div style="display:inline-block; padding:14px 28px; font-size:32px; font-weight:bold; letter-spacing:8px; background:#f3f4f6; border:1px dashed #9ca3af; border-radius:10px; color:#111827">
                  ${renderedValue}
                </div>
              </div>
            `
        }
        if(field.type === 'checkbox') return ""
        if(value === undefined || value === null) return ""
        const renderValue = this._templateRender.render(String(value), variables)
        if(!renderValue.trim()) return ""
        
        return `
           <div style="font-size:15px; color:#374151; line-height:1.8; margin:0 0 16px 0;">
             ${this._textFormatter.format(renderValue)}
           </div>
        `
    }

    private buildButtonSection(value: unknown, variables: Record<string, string>): string {
        if(!value || typeof value !== 'object') return ""
        const buttonValue = value as {
            text?: string,
            url?: string
        }
        const text = this._templateRender.render(buttonValue.text ?? "", variables)
        const url = this._templateRender.render(buttonValue.url ?? "", variables)
        if(!text.trim() || !url.trim()) return ""

        return `
           <div>
              <a
                href="${url}"
                style="display:inline-block; padding:12px; background:#6B4705; color:#ffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:14px"
              >
                ${text}
              </a>
           </div>
        `
    }

    private wrapLayout(input: {title?: string, sections: string[], signatureName: string}): string {
        return `
           <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px 16px;">
              <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; padding:32px; border:1px solid #e5e7eb;">
                    ${input.title 
                        ? `<h2 style="margin:0 0 24px 0; font-size:24px; color:#111827; text-align:center;">${input.title}</h2>`
                        : ""
                    }
                    ${input.sections.join("")}
                    <div style="margin-top:28px; padding-top:18px; border-top:1px solid #e5e7eb;">
                      <p style="margin:0; font-size:14px; color:#6b7280;">
                          Best regards,<br />
                          The ${input.signatureName} Team
                      </p>
                    </div>
              </div>
           </div>
        `
    }
}