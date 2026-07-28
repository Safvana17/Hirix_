export interface IS3Service {
    generateUploadUrl(params: { folder: string; fileName: string; contentType: string}): Promise<{ key: string; uploadUrl: string}>
    generateViewUrl( key: string): Promise<string>
    uploadFile(folder: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>
    deleteFile(key: string): Promise<void>
}