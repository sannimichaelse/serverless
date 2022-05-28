import * as AWS from "aws-sdk";

export const uploadToS3 = async (event: any) => {
  const s3 = new AWS.S3();

  AWS.config.update({
    region: "us-west-1",
    accessKeyId: process.env.SPOKE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPOKE_AWS_SECRET_ACCESS_KEY,
  });

  const buffer = Buffer.from(JSON.stringify(event.body));
  const params = {
    Bucket: process.env.BUCKET,
    Key: "spokespeople.json",
    Body: buffer,
    ContentType: "application/json",
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err: any, data: any) => {
      if (err) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ message: err.stack }),
        });
      } else {
        return reject({
          statusCode: 200,
          body: "Upload Successfull",
        });
      }
    });
  })
};

export async function handler(event: any) {
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: "Welcome to serverless",
    };
  }

  return uploadToS3(event);
}
