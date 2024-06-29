
export interface IUploader {
    deleteObject(key: string): Promise<void>;
    singleUpload(userId:string, postType:string): Promise<string>;
    multipleUploads(userId: string, postType:string, count:number): Promise<string[]>;
}