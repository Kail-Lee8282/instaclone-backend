import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (file, userId, folderName: String) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objFileName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instarclone-kyile",
      Key: objFileName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();

  return Location;
};
