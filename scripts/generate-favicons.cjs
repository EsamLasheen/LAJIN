const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, "..", "public", "favicon");

// 8-point star polygon (same geometry as the cursor mark)
const star = (cx, cy, R) => {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a1 = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const a2 = a1 + Math.PI / 8;
    pts.push(`${(cx + R * Math.cos(a1)).toFixed(1)},${(cy + R * Math.sin(a1)).toFixed(1)}`);
    pts.push(`${(cx + R * 0.45 * Math.cos(a2)).toFixed(1)},${(cy + R * 0.45 * Math.sin(a2)).toFixed(1)}`);
  }
  return pts.join(" ");
};

const svg = (bg, fg, size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="42" fill="${bg}"/>
  <polygon points="${star(96, 96, 62)}" fill="${fg}"/>
  <circle cx="96" cy="96" r="10" fill="${bg}"/>
</svg>`;

(async () => {
  const variants = [
    { name: "light", bg: "#ffffff", fg: "#111111" },
    { name: "dark", bg: "#111111", fg: "#f5f5f5" },
  ];
  const sizes = [32, 128, 180, 192];
  for (const v of variants) {
    for (const s of sizes) {
      const file = path.join(dir, `favicon-${v.name}-${s}-bw.png`);
      await sharp(Buffer.from(svg(v.bg, v.fg, s))).png().toFile(file);
      console.log("created:", path.basename(file));
    }
  }
})();