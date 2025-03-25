import { exec } from "child_process";
import path from "path";
import fs from "fs";
import {S3Client , PutObjectCommand, S3Client } from '@aws-sdk/client-s3'


const S3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})




async function init() {
  console.log("Executing Script.js .......");
  const outDirPath = path.join(__dirname, "output");
  const p = exec(`cd ${outDirPath} && npm install && npm run build`);


  p.stdout.on("data", function (data) {
    console.log(data);
  });

  p.stdout.on("error" , function(data){
    console.log(`Error: ${data}`);
  })

    p.on("close", async function (data) {
        console.log(`Build Complete ${data}`);
        const distFolderPath = path.join(outDirPath, "output" , "dist");
        const files = fs.readdirSync(distFolderPath , {recursive: true});

        for(const filePath of files){
            if(fs.lstatSync(filePath).isDirectory()) continue;

        }

    });




}
