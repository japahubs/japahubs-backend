import { AWSS3Uploader } from './uploaders/s3';

const s3Uploader = new AWSS3Uploader({ 
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: 'test-graphql-uploads'
});

export {s3Uploader}