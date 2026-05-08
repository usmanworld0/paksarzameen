const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sequencesDir = path.join(__dirname, 'public', 'sequences');
const outputDir = path.join(__dirname, 'public', 'sequences_v2');
const sequences = Array.from({length: 12}, (_, i) => `seq${i + 1}`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  console.log('Starting extreme optimization of 2880 WebP image frames...');
  
  for (const seq of sequences) {
    const seqPath = path.join(sequencesDir, seq);
    const outSeqPath = path.join(outputDir, seq);
    
    if (!fs.existsSync(seqPath)) continue;
    if (!fs.existsSync(outSeqPath)) {
      fs.mkdirSync(outSeqPath, { recursive: true });
    }
    
    const files = fs.readdirSync(seqPath).filter(f => f.endsWith('.webp') && !f.includes('.temp'));
    console.log(`Processing ${files.length} frames in ${seq}...`);
    
    const batchSize = 20;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (file) => {
        const inputPath = path.join(seqPath, file);
        const outputPath = path.join(outSeqPath, file);
        
        try {
          if (!fs.existsSync(outputPath)) {
            await sharp(inputPath)
              .resize({ width: 1000, withoutEnlargement: true })
              .webp({ quality: 35, effort: 4 })
              .toFile(outputPath);
          }
        } catch (err) {
          console.error(`Error processing ${inputPath}:`, err);
        }
      }));
    }
  }
  
  console.log('Optimization complete! All WebP frames highly compressed to sequences_v2.');
}

optimizeImages().catch(console.error);
