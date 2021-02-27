const aws = require('aws-sdk');
const awsCredentials = require('./account.json');
aws.config.update({
    accessKeyId: awsCredentials.accessKeyId,
    secretAccessKey: awsCredentials.secretAccessKey,
    region: awsCredentials.region
})