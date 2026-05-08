/**
 * Deletes even-numbered frames from sequences_v2.
 * The canvas component loads every 2nd frame (FRAME_STEP=2), so
 * files 002, 004, 006...240 are never requested by the browser.
 */
const fs = require('fs');
const path = require('path');

const seqDir = path.join(__dirname, '../public/sequences_v2');
const sequences = fs.readdirSync(seqDir).filter(f =>
  fs.statSync(path.join(seqDir, f)).isDirectory()
);

let totalDeleted = 0;
let totalBytesSaved = 0;

for (const seq of sequences) {
  const seqPath = path.join(seqDir, seq);
  let seqDeleted = 0;
  let seqBytes = 0;

  for (let i = 2; i <= 240; i += 2) {
    const file = path.join(seqPath, `ezgif-frame-${String(i).padStart(3, '0')}.webp`);
    if (fs.existsSync(file)) {
      const size = fs.statSync(file).size;
      fs.unlinkSync(file);
      seqDeleted++;
      seqBytes += size;
    }
  }

  console.log(`${seq}: deleted ${seqDeleted} files, saved ${(seqBytes / 1024 / 1024).toFixed(1)}MB`);
  totalDeleted += seqDeleted;
  totalBytesSaved += seqBytes;
}

console.log(`\nTotal: deleted ${totalDeleted} files, saved ${(totalBytesSaved / 1024 / 1024).toFixed(1)}MB`);
