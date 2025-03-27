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

console.log("AWS Access Key:", AWS_ACCESS_KEY_ID ? "Loaded" : "Missing");
console.log("AWS Secret Key:", AWS_SECRET_ACCESS_KEY ? "Loaded" : "Missing");
console.log("S3 Bucket:", BUCKET_NAME);

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !PROJECT_ID || !BUCKET_NAME) {
  console.error("Missing required environment variables!");
  process.exit(1);
}

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const project_id = PROJECT_ID;
const bucket_name = BUCKET_NAME;

async function uploadFilesRecursively(directoryPath, project_id, basePath = directoryPath) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      await uploadFilesRecursively(filePath, project_id, basePath);
    } else {
      let relativePath = path.relative(basePath, filePath);
      let key = "";

      if (file === "index.html") {
        key = `__outputs/${project_id}/index.html`; // Place index.html in __outputs/{project_id}
      } else {
        // Ensure `assets/` does not get duplicated
        if (relativePath.startsWith("assets/")) {
          relativePath = relativePath.replace(/^assets\//, "");
        }
        key = `assets/${relativePath}`; // All other files go inside assets/
      }

      console.log(`Uploading: ${filePath} → S3 Key: ${key}`);

      const command = new PutObjectCommand({
        Bucket: bucket_name,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: mime.lookup(filePath) || "application/octet-stream",
      });

      try {
        await s3.send(command);
        console.log(`✅ Uploaded: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file}:`, error);
      }
    }
  }
}

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

    if (!fs.existsSync(distFolderPath)) {
      console.error("❌ Error: dist folder does not exist.");
      return;
    }

    console.log("Uploading Files to S3...");
    await uploadFilesRecursively(distFolderPath, project_id);
    console.log("✅ Upload Complete.");
  });
}

init();
