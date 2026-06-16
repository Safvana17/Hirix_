import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { IS3Service } from "../../Application/interface/service/IS3Service";

export class S3Service implements IS3Service {

    constructor (
        private readonly s3Client: S3Client,
        private readonly bucketName: string
    ) {}

    async generateUploadUrl(params: { folder: string; fileName: string; contentType: string; }): Promise<{ key: string; uploadUrl: string; }> {
        const key = `${params.folder}/${Date.now()}-${params.fileName}`
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: params.contentType
        })

        const uploadUrl = await getSignedUrl(
            this.s3Client,
            command,
            { expiresIn: 300 }
        )

        return {
            key,
            uploadUrl
        }
    }

    generateViewUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
        })

        return getSignedUrl(
            this.s3Client,
            command,
            { expiresIn: 300 }
        )
    }
}