const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sequencesDir = path.join(__dirname, 'public', 'sequences');
const sequences = Array.from({length: 12}, (_, i) => `seq${i + 1}`);

async function optimizeImages() {
  console.log('Starting optimization of 2880 image frames to WebP...');
  
  for (const seq of sequences) {
    const seqPath = path.join(sequencesDir, seq);
    if (!fs.existsSync(seqPath)) continue;
    
    const files = fs.readdirSync(seqPath).filter(f => f.endsWith('.jpg'));
    console.log(`Processing ${files.length} frames in ${seq}...`);
    
    // Process in batches of 20 to avoid memory issues
    const batchSize = 20;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (file) => {
        const inputPath = path.join(seqPath, file);
        const outputPath = path.join(seqPath, file.replace('.jpg', '.webp'));
        
        try {
          // Convert to highly compressed WebP
          await sharp(inputPath)
            .webp({ quality: 60, effort: 4 })
            .toFile(outputPath);
            
          // Delete original to save space
          fs.unlinkSync(inputPath);
        } catch (err) {
          console.error(`Error processing ${inputPath}:`, err);
        }
      }));
    }
  }
  
  console.log('Optimization complete! All frames converted to WebP.');
}

optimizeImages().catch(console.error);
