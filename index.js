const aws = require("aws-sdk");
const awsCredentials = require("./json/account.json");
const arns = require("./arns.json");
const fs = require('fs');

aws.config.update({
    accessKeyId: awsCredentials.accessKeyId,
    secretAccessKey: awsCredentials.secretAccessKey,
    region: awsCredentials.region,
    apiVersions: {
        rekognition: "2016-06-27",
        s3: "2006-03-01",
        kinesis: "2013-12-02",
        kinesisvideo: "2017-09-30",
        kinesisvideoarchivedmedia: "2017-09-30"
    },
});

// console.log(aws.config);         Testing line
var s3Bucket = new aws.S3();
var kinesis = new aws.Kinesis();
var kinesisvideo = new aws.KinesisVideo();

const labelDetectionFromVideo = async () => {
    var rekognition = new aws.Rekognition();
    var response = (await rekognition.startLabelDetection({
        Video: { S3Object: { Bucket: "videosbucket2021", Name: "demoVideo.mp4" } },
        ClientRequestToken: "LabelDetectionToken",
        MinConfidence: 50
    }).promise());

    if (response.JobId != undefined) {
        // console.error("jobId Found");
        console.log(">>> Job Id: ", response.JobId);
        var labelResponse = await rekognition.getLabelDetection({
            JobId: response.JobId,
            MaxResults: 50
        }).promise();

        console.log(">>> Label Detection Response: ", labelResponse);

        var nextTokenResponse = await rekognition.getLabelDetection({
            JobId: response.JobId,
            NextToken: labelResponse.NextToken,
            MaxResults: 10
        }).promise();
        console.log(">>> Next Token Reponse: ", nextTokenResponse);

        nextTokenResponse.Labels.forEach((label, index) => {
            let res = label.Label;
            console.log(index + 1, " -> ", res);
            if (res.Instances.length != 0) {
                console.log(">>> Object: ", res.Instances[0]);
            }
        })
    } else {
        console.error("Something went wrong");
    }
};

// const streamListing = () => {
//     var response = (await kinesis.listStreams().promise()).StreamNames;
//     console.log(response);
//     response.forEach(async (stream, index) => {
//         var streamDescResponse = await kinesis.describeStream({
//             StreamName: stream
//         }).promise();

//         console.log(">>> Stream Description: ", streamDescResponse);
//         console.log(streamDescResponse.StreamDescription.Shards);
//         fs.writeFile(`json/stream-${stream}.json`, JSON.stringify(streamDescResponse), (error) => {
//             if (error) {
//                 console.log(error);
//                 return;
//             }
//             console.log("File Written Successfully");
//         });
//     });
// }

// const awsKinesisVideoArcheiveMediaApir = () => {
//     // AWS Kinesis Video Archieve Media Service
//     var archiveMedia = new aws.KinesisVideoArchivedMedia();
//     var response = await archiveMedia.getClip({
//         ClipFragmentSelector: {
//             FragmentSelectorType: "SERVER_TIMESTAMP",
//             TimestampRange: {
//                 StartTimestamp: new Date,
//                 EndTimestamp: new Date
//             }
//         },
//         StreamARN: arns.videoS3Bucket.arn,
//         StreamName: arns.videoS3Bucket.key
//     }).promise();
//     console.log(response);
// }

const testingVideoAwsService = async () => {


}

testingVideoAwsService()