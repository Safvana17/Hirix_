import { ITextFormatterService } from "../../Application/interface/service/ITextFormattingService";

export class TextFormatService implements ITextFormatterService{
    format(content: string): string {
        return content.replace(/\n/g, '<br />')
    }
}