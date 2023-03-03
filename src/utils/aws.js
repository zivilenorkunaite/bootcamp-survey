import AWS from 'aws-sdk';

const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_KEY;
const region = process.env.REACT_APP_AWS_REGION;
const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

export const uploadFileToS3 = (filename, data) => {
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: data,
    ContentType: 'application/json',
  };

  return s3.upload(params).promise();
};
