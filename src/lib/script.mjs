import "dotenv/config";
import { exec } from "child_process";
import path from "path";
import fs, { createReadStream } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import { fileURLToPath } from "url"; 





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, PROJECT_ID, BUCKET_NAME } = process.env;

// Validate environment variables
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !PROJECT_ID || !BUCKET_NAME) {
  console.error("Missing required environment variables!");
  process.exit(1);
}

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  },
});



const project_id = process.env.PROJECT_ID;
const bucket_name = process.env.BUCKET_NAME;

async function init() {
  console.log("Executing Script.js .......");
  const outDirPath = path.join(__dirname, "output");

  const p = exec(`npm install && npm run build`, { cwd: outDirPath });

  p.stdout.on("data", (data) => console.log(data));
  p.stderr.on("data", (data) => console.error(`Error: ${data}`));

  p.on("close", async (code) => {
    console.log(`Build Complete with code: ${code}`);
    if (code !== 0) {
      console.error("Build failed!");
      return;
    }

    const distFolderPath = path.join(outDirPath, "dist");
    const files = fs.readdirSync(distFolderPath);

    console.log("Uploading Files to S3");

    for (const file of files) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;

      const key = `__outputs/${project_id}/${file}`;
      const command = new PutObjectCommand({
        Bucket: bucket_name,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: mime.lookup(filePath) || "application/octet-stream",
      });

      try {
        await s3.send(command);
        console.log(`Uploaded ${file} to S3`);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error);
      }
    }

    console.log("Upload Complete");
  });
}

init();
