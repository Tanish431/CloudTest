const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const serverless = require('serverless-http');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Configure AWS SDK with Storj S3 credentials
const s3 = new AWS.S3({
    endpoint: 'https://gateway.storjshare.io', // Storj S3 Gateway URL
    accessKeyId: 'jwunqxipxgbytxq63hm4zlkibbma',           // Replace with your Access Key
    secretAccessKey: 'j27at75qoft476p6ba2iwsxc6v4oyc5caxnmb6jnxxzs6m7airl3s',       // Replace with your Secret Key
    s3ForcePathStyle: true,                   // Required for Storj
});

const BUCKET_NAME = 'fileruntrial';

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: req.file.originalname,
            Body: req.file.buffer,
        };

        const data = await s3.upload(params).promise();
        res.status(200).send({
            message: 'File uploaded successfully!',
            fileUrl: data.Location,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

module.exports.handler = serverless(app);
