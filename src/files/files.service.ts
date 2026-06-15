import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('AWS_S3_BUCKET', '');
    this.s3 = new S3Client({
      region: this.config.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
  }

  async upload(dto: { base64: string; key: string; contentType?: string }) {
    const buffer = Buffer.from(dto.base64, 'base64');
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: dto.key,
        Body: buffer,
        ContentType: dto.contentType || 'application/octet-stream',
      }),
    );
    return { key: dto.key, message: 'File uploaded successfully' };
  }

  async list(prefix?: string) {
    const result = await this.s3.send(
      new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix }),
    );
    return (
      result.Contents?.map((item) => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
      })) || []
    );
  }

  async get(key: string) {
    const result = await this.s3.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    return {
      body: result.Body,
      contentType: result.ContentType,
    };
  }

  async delete(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    return { key, message: 'File deleted successfully' };
  }
}
