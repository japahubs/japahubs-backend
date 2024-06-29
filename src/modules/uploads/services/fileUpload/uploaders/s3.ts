import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { IUploader } from "../uploader";

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  bucketName: string;
};

export class AWSS3Uploader implements IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config.update({
      region: config.region || "ca-central-1",
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });
    this.s3 = new AWS.S3();
    this.config = config;
  }

  protected async createSignedUrl(userId: string, postType:string): Promise<string> {
    const fileName = `${userId}/${postType}/${uuidv4()}.jpeg`;

    const params = {
      Bucket: this.config.bucketName,
      Key: fileName,
      Expires: 900,
    };

    const url = await this.s3.getSignedUrlPromise("putObject", params);
    return url;
  }

  public async singleUpload(userId: string, postType:string): Promise<string> {
    return await this.createSignedUrl(userId, postType);
  }

  public async multipleUploads(userId: string, postType:string, count:number): Promise<string[]> {
    const preSignedUrls: string[] = [];
    for (let i = 0; i < count; i++) {
      const preSignedUrl = await this.createSignedUrl(userId, postType);
      preSignedUrls.push(preSignedUrl);
    }
    return preSignedUrls;
  }

  public async deleteObject(key: string): Promise<void> {
    const params = {
      Bucket: this.config.bucketName,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }
}
