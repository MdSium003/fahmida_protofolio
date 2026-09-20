const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');

async function downloadImages() {
  const transcriptPath = 'C:/Users/mdsiu/.gemini/antigravity-ide/brain/585626e7-9ba1-4c5f-b578-4c9b88b706c0/.system_generated/logs/transcript_full.jsonl';
  const outDir = path.join(__dirname, '../public/wall/scraped');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let foundUrls = new Set();
  for await (const line of rl) {
    if (line.includes('media.licdn.com/dms/image')) {
      const matches = line.match(/https:\/\/media\.licdn\.com\/dms\/image\/[^\s"'<>\\]+/g);
      if (matches) {
        matches.forEach(u => {
          // clean trailing punctuation if any
          const clean = u.replace(/[)\]},;\\]+$/, '');
          foundUrls.add(clean);
        });
      }
    }
  }

  console.log('Found', foundUrls.size, 'media URLs to download.');
  let i = 0;
  for (const url of foundUrls) {
    i++;
    const ext = url.includes('.png') ? 'png' : 'jpg';
    let filename = `linkedin_media_${i}.${ext}`;
    if (url.includes('company-logo')) filename = `company_logo_${i}.${ext}`;
    if (url.includes('feedshare')) filename = `post_image_${i}.${ext}`;
    
    const filePath = path.join(outDir, filename);
    await new Promise((resolve) => {
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          const stream = fs.createWriteStream(filePath);
          res.pipe(stream);
          stream.on('finish', () => {
            console.log(`Downloaded: ${filename}`);
            resolve();
          });
        } else {
          console.log(`Failed (${res.statusCode}): ${filename}`);
          resolve();
        }
      }).on('error', (err) => {
        console.log(`Error downloading ${filename}:`, err.message);
        resolve();
      });
    });
  }
}

downloadImages();
