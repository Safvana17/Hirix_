export interface IS3Service {
    generateUploadUrl(params: { folder: string; fileName: string; contentType: string}): Promise<{ key: string; uploadUrl: string}>
}