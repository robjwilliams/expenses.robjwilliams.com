import fs from "fs";
import path from "path";
import os from "os";

const downloadDir = path.join(os.tmpdir(), "tmp");

fs.readdir(downloadDir, (err, files) => {
  if (err) {
    return console.error("Unable to scan directory:", err);
  }
  // Print all file names
  files.forEach((file) => {
    console.log("Downloaded file:", file);
  });
});
