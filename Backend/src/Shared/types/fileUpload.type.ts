
export interface FileUpload {
    filename: string
    mimetype: string
    size: number
    buffer?: Buffer
    path?: string
}