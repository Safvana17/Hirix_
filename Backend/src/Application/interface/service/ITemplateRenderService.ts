export interface ITemplateRenderService {
    render(content: string, variables: Record<string, string>): string
}