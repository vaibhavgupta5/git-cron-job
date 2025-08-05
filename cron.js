import cron from "node-cron";
import fs from "fs";
import { exec } from "child_process";

function updateFile() {
  const date = new Date();
  const formattedDate = date.toISOString();
  fs.writeFile("date.txt", `Last run: ${formattedDate}\n`, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("File updated successfully");
      pushToGit(formattedDate);
    }
  });
}

function pushToGit(formattedDate) {
  const message = `Auto update on ${formattedDate}`;

  const cmd = `
    git add date.txt &&
    git commit -m "${message}" &&
    git push origin main
  `;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Git error:", error.message);
      return;
    }
    if (stderr) console.warn("⚠️ Git stderr:", stderr);
    console.log("🚀 Git push complete:\n", stdout);
  });
}


cron.schedule("30 2 * * *", () => {
  updateFile();
  console.log("Running a task every day at 2:30 AM");
});
