'use strict';
var s3 = require('s3');
var AWS = require('aws-sdk');

module.exports.deployToS3 = (folder, pathOutPage, onProgress) => {
    var awsS3Client = new AWS.S3({
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        signatureVersion: 'v4',
        region: 'eu-west-2'
  });

    var client = s3.createClient({
        s3Client: awsS3Client,
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
    });

    var params = {
        localDir: folder + '/' + pathOutPage,
        deleteRemoved: true,
        s3Params: {
            Bucket: "comic-maps",
            Prefix: pathOutPage,
        },
    };
    return new Promise(function (resolve, reject) {
        var uploader = client.uploadDir(params);
        uploader.on('error', reject);
        uploader.on('progress', function() {
            onProgress && onProgress(uploader.progressAmount, uploader.progressTotal);
        });
        uploader.on('end', resolve);
    });
};
