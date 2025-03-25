import { exec } from "child_process";
import path from "path";
import fs from "fs";




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
        

    });




}
