import { S3 } from "aws-sdk";
import { getBoundary, Parse } from "parse-multipart";

const BUCKET = process.env.BUCKET;

const s3 = new S3();

const extractFile = (event: any) => {
  const boundary = getBoundary(event.headers["content-type"]);
  const parts = Parse(Buffer.from(event.body, "base64"), boundary);
  const [{ filename, data }] = parts;

  return {
    filename,
    data,
  };
};

export async function handler(event: any) {
  try {
    const { filename, data } = extractFile(event);
    await s3
      .putObject({
        Bucket: BUCKET,
        Key: filename,
        ACL: "public-read",
        Body: data,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        link: `https://${BUCKET}.s3.amazonaws.com/${filename}`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.stack }),
    };
  }
}
