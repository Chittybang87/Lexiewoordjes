import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const sheetPath = 'public/characters/lexie-sheet.jpeg';
const outDir = 'public/characters';

/**
 * Precise regions on the 1408×768 Lexie sheet (characters only, labels cut off).
 * Tuned by inspecting each pose.
 */
const CROPS = {
  idle: { left: 20, top: 100, width: 320, height: 195 },
  run: { left: 370, top: 105, width: 330, height: 190 },
  jump: { left: 720, top: 95, width: 320, height: 200 },
  sit: { left: 1070, top: 105, width: 310, height: 195 },
  wave: { left: 25, top: 315, width: 310, height: 200 },
  hover: { left: 365, top: 310, width: 330, height: 205 },
  victory: { left: 720, top: 300, width: 320, height: 215 },
  celebrate: { left: 1055, top: 305, width: 330, height: 210 },
  hold: { left: 30, top: 535, width: 310, height: 175 },
  wrong: { left: 360, top: 530, width: 300, height: 185 },
  bag: { left: 700, top: 535, width: 320, height: 180 },
  icon: { left: 1085, top: 545, width: 260, height: 195 },
};

/** Make near-cream / polka-dot background transparent, then trim. */
async function cutout(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = Buffer.from(data);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    // Cream / off-white sheet background (+ faint yellow dots)
    const isCream =
      r > 235 && g > 225 && b > 200 && Math.abs(r - g) < 35 && b < r + 5;
    const isSoftShadow =
      r > 210 && g > 200 && b > 185 && r < 245 && g < 235 && Math.abs(r - g) < 20;
    if (isCream || isSoftShadow) {
      px[i + 3] = 0;
    }
  }

  // Soften edges near transparency
  const w = info.width;
  const h = info.height;
  const alphaAt = (x, y) => px[(y * w + x) * 4 + 3];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      if (px[i + 3] === 0) continue;
      let transparentNeighbors = 0;
      if (alphaAt(x - 1, y) === 0) transparentNeighbors++;
      if (alphaAt(x + 1, y) === 0) transparentNeighbors++;
      if (alphaAt(x, y - 1) === 0) transparentNeighbors++;
      if (alphaAt(x, y + 1) === 0) transparentNeighbors++;
      if (transparentNeighbors >= 2) {
        // Keep solid character edges; only feather pure cream fringes already keyed
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        if (r > 220 && g > 210 && b > 190) px[i + 3] = 0;
      }
    }
  }

  return sharp(px, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 8 })
    .png();
}

await mkdir(outDir, { recursive: true });

for (const [name, region] of Object.entries(CROPS)) {
  const cropped = await sharp(sheetPath).extract(region).png().toBuffer();
  const out = await cutout(cropped);
  const file = path.join(outDir, `lexie-${name}.png`);
  await out.toFile(file);
  const meta = await sharp(file).metadata();
  console.log(`✓ lexie-${name}.png  ${meta.width}×${meta.height}`);
}

// Aliases used by the game
await sharp(path.join(outDir, 'lexie-celebrate.png')).toFile(
  path.join(outDir, 'lexie-happy.png'),
);
await sharp(path.join(outDir, 'lexie-icon.png'))
  .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/favicon.png');

console.log('done');
