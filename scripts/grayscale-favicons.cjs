const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "public", "favicon");
(async () => {
  const files = fs.readdirSync(dir).filter((f) => f.startsWith("favicon") && f.endsWith(".png"));
  for (const file of files) {
    const p = path.join(dir, file);
    const buf = await sharp(p).grayscale().toBuffer();
    fs.writeFileSync(p, buf);
    console.log("desaturated:", file);
  }
})();