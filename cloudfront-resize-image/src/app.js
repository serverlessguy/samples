// WARNING: THIS SOLUTION IS AN EXAMPLE ONLY AND IS NOT MEANT FOR PRODUCTION!

const { S3 } = require("aws-sdk");
const sharp = require("sharp");

// 1. Load the base image from S3.
// 2. Resize the image.
// 3. Return the resized image (base64 encoded).

exports.handler = async (event) => {
  // Return a transparent 1x1 pixel if an error occurs.
  let response = {
    statusCode: 200,
    headers: {
      "Content-Type": "image/png",
    },
    body: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    isBase64Encoded: true,
  };
  try {
    // Log the event received through API Gateway from CloudFront.
    console.log("Event:\n", JSON.stringify(event, null, 2));

    const s3 = new S3();

    //const contentType = event.headers["content-type"];
    //const method = event.requestContext.http.method;
    //const queryString = event.queryStringParameters;

    const path = event.rawPath;
    const bucket = process.env.S3BucketName;
    const matchPath = path.match(/((\d+)x(\d+))\/(.*)/);

    /*
      Format of path: /100x150/example.jpg
      matchPath[0]: 100x150/example.jpg
      matchPath[1]: 100x150
      matchPath[2]: 100  << Width
      matchPath[3]: 150  << Height
      matchPath[4]: example.jpg  << Key
    */

    const w = parseInt(matchPath[2]);
    const h = parseInt(matchPath[3]);
    const key = "original/" + matchPath[4];
    console.log("Width: ", w);
    console.log("Height: ", h);
    console.log("Key: ", key);

    // 1. Load the original image from S3.
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const s3Object = await s3.getObject(params).promise();

    // 2. Resize the image.
    const resized = await sharp(s3Object.Body).resize({ width: w, height: h }).toBuffer();

    // 3. Return the resized image.
    response = {
      statusCode: 200,
      headers: {
        "Content-Type": s3Object.ContentType,
      },
      body: resized.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e) {
    console.error(e);
  }
  return response;
};
