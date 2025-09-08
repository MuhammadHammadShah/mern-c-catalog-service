import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import config from "config";
import { FileData, FileStorage } from "../types/storage";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("s3.region"),
            credentials: {
                accessKeyId: config.get("s3.accessKeyId"),
                secretAccessKey: config.get("s3.secretAccessKey"),
            },
        });
    }

    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get("s3.bucket"),
            Key: data.filename,
            Body: data.fileData,
        };

        // todo add proper file data types
        // @ts-ignore
        await this.client.send(new PutObjectCommand(objectParams));
    }

    delete(fileName: string): Promise<void> {
        throw new Error("Method not implemented");
    }
    getObjectUri(fileName: string): string {
        throw new Error("Method not implemented");
    }
}
