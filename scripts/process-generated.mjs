import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const srcDir = path.join(
  process.env.USERPROFILE || '',
  '.cursor/projects/c-Users-ogoossent-source-repos-Blueywoordjes/assets',
);
const outDir = 'public/characters';

const files = {
  'lexie-anim-wave.jpg': 'lexie-wave.png',
  'lexie-anim-wave2.jpg': 'lexie-wave-2.png',
  'lexie-anim-happy.jpg': 'lexie-happy.png',
  'lexie-anim-victory.jpg': 'lexie-victory.png',
  'lexie-anim-confused.jpg': 'lexie-wrong.png',
  'lexie-anim-idle.jpg': 'lexie-idle.png',
  'lexie-anim-run.jpg': 'lexie-run.png',
};

async function keyGreen(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = Buffer.from(data);
  const w = info.width;
  const h = info.height;

  const idx = (x, y) => (y * w + x) * 4;

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];

    // Distance from pure green screen
    const greenDominance = g - Math.max(r, b);
    const isScreen =
      (g > 90 && greenDominance > 35) ||
      (g > 180 && r > 100 && b > 100 && g >= r && g >= b && greenDominance > 15) ||
      (g > 220 && r > 180 && b > 180 && greenDominance > 8);

    if (isScreen) {
      px[i + 3] = 0;
      continue;
    }

    // Despill: pull green out of edge pixels near screen color
    if (greenDominance > 8 && g > 80) {
      const pull = Math.min(greenDominance, 60);
      px[i + 1] = Math.max(0, g - pull);
      // Slightly reduce alpha on fringy greens
      if (greenDominance > 25) {
        px[i + 3] = Math.round(px[i + 3] * (1 - Math.min(0.85, greenDominance / 90)));
      }
    }
  }

  // Second pass: kill leftover green-ish fringe next to transparent pixels
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = idx(x, y);
      if (px[i + 3] === 0) continue;
      let nearClear = false;
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        if (px[idx(x + dx, y + dy) + 3] === 0) nearClear = true;
      }
      if (!nearClear) continue;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      if (g > r + 15 && g > b + 15) {
        px[i + 3] = 0;
      } else if (r > 200 && g > 200 && b > 200 && Math.min(r, g, b) > 190) {
        // leftover white halo from jpg compression near edge
        px[i + 3] = Math.round(px[i + 3] * 0.15);
      }
    }
  }

  await sharp(px, {
    raw: { width: w, height: h, channels: 4 },
  })
    .trim({ threshold: 4 })
    .png()
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(`✓ ${path.basename(outputPath)}  ${meta.width}×${meta.height}`);
}

await mkdir(outDir, { recursive: true });

for (const [src, dest] of Object.entries(files)) {
  await keyGreen(path.join(srcDir, src), path.join(outDir, dest));
}

await sharp(path.join(outDir, 'lexie-wave.png'))
  .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/favicon.png');

console.log('done');
