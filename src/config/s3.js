
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
});

const BUCKET = process.env.AWS_BUCKET_NAME;

const uploadImage = async (fileBuffer, filename, contentType) => {
    const key = `products/${Date.now()}-${filename}`;

    await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType
    }));

    const endpoint = process.env.AWS_ENDPOINT_URL_S3.replace('https://', '');
    return `https://${endpoint}/${BUCKET}/${key}`;
};

const deleteImage = async (key) => {
    await s3.send(new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key
    }));
};

module.exports = { s3, uploadImage, deleteImage, BUCKET };