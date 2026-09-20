import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesDir = path.join(rootDir, 'public', 'images');
const wallDir = path.join(rootDir, 'public', 'wall');
const wallThumbsDir = path.join(wallDir, 'thumbs');

// Ensure thumbs dir exists
if (!fs.existsSync(wallThumbsDir)) {
  fs.mkdirSync(wallThumbsDir, { recursive: true });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

async function optimizeHeroPortrait() {
  const inputPath = path.join(imagesDir, 'fahmida.png');
  const outputPath = path.join(imagesDir, 'fahmida.webp');

  if (!fs.existsSync(inputPath)) {
    console.warn('Hero portrait fahmida.png not found.');
    return;
  }

  const originalSize = fs.statSync(inputPath).size;
  await sharp(inputPath)
    .rotate()
    .webp({ quality: 85, effort: 6 })
    .toFile(outputPath);

  const optimizedSize = fs.statSync(outputPath).size;
  const saved = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
  console.log(`✨ Hero Portrait: ${formatBytes(originalSize)} -> ${formatBytes(optimizedSize)} (Saved ${saved}%)`);
}

async function optimizeWallThumbnails() {
  const files = fs.readdirSync(wallDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext) && !file.startsWith('thumb_');
  });

  console.log(`\n🖼️  Generating compact DriftWall thumbnails for ${files.length} images...`);
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const inputPath = path.join(wallDir, file);
    const parsed = path.parse(file);
    const outputName = `thumb_${parsed.name}.webp`;
    const outputPath = path.join(wallThumbsDir, outputName);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    await sharp(inputPath)
      .rotate()
      .resize({ width: 360, height: 240, fit: 'cover', position: 'center' })
      .webp({ quality: 80, effort: 5 })
      .toFile(outputPath);

    const optimizedSize = fs.statSync(outputPath).size;
    totalOptimized += optimizedSize;

    console.log(`  ✓ ${file} (${formatBytes(originalSize)}) -> thumbs/${outputName} (${formatBytes(optimizedSize)})`);
  }

  // Generate dynamic manifest JSON in public/data/wall_images.json
  const dataDir = path.join(rootDir, 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const manifest = files.map((file, idx) => {
    const parsed = path.parse(file);
    return {
      id: idx + 1,
      image: `/wall/${file}`,
      thumb: `/wall/thumbs/thumb_${parsed.name}.webp`,
      filename: file
    };
  });

  fs.writeFileSync(
    path.join(dataDir, 'wall_images.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
  console.log(`  📝 Saved manifest public/data/wall_images.json (${manifest.length} images)`);

  const totalSaved = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
  console.log(`\n🎉 DriftWall Thumbnails Complete!`);
  console.log(`   Original Total:  ${formatBytes(totalOriginal)}`);
  console.log(`   Thumbnail Total: ${formatBytes(totalOptimized)}`);
  console.log(`   Data Reduction:  ${totalSaved}% reduction for hero wall!`);
}

async function run() {
  console.log('======================================================');
  console.log('🚀 AUTOMATED PORTFOLIO IMAGE OPTIMIZATION PIPELINE');
  console.log('======================================================\n');
  try {
    await optimizeHeroPortrait();
    await optimizeWallThumbnails();
    console.log('\n✅ All images successfully optimized!');
  } catch (err) {
    console.error('❌ Error during image optimization:', err);
    process.exit(1);
  }
}

run();
