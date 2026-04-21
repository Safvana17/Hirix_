import { ITemplateRenderService } from "../../Application/interface/service/ITemplateRenderService";

export class RenderTemplateService implements ITemplateRenderService {
    render(content: string, variables: Record<string, string>): string {
        return content.replace(/\{\{(.*?)\}\}/g, (_match: string, key: string) => {
            const normalizedKey = key.trim()
            return variables[normalizedKey] ?? ""
        })
    }
}