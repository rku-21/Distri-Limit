const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "src", "scripts");
const targetDir = path.join(__dirname, "..", "dist", "scripts");

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Source scripts folder not found: ${sourceDir}`);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const fileName of fs.readdirSync(sourceDir)) {
  if (!fileName.endsWith(".lua")) continue;

  fs.copyFileSync(
    path.join(sourceDir, fileName),
    path.join(targetDir, fileName),
  );
}