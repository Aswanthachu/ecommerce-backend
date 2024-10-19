import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import storage from "../config/gcsConfig";

export async function processAndUploadImage(
  file: Express.Multer.File,
  bucketName: string
): Promise<string> {
  const processedImage = await sharp(file.buffer)
    .resize({ width: 800, height: 800, fit: "inside" })
    .toFormat("png")
    .toBuffer();

  const filename = uuidv4() + ".png";

  const bucket = storage.bucket(bucketName);
  const fileObject = bucket.file(filename);
  await fileObject.save(processedImage);

  // await fileObject.makePublic();
  const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

  return imageUrl;
}
