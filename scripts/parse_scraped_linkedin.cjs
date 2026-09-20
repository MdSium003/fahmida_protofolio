const fs = require('fs');
const readline = require('readline');

async function extract() {
  const transcriptPath = 'C:/Users/mdsiu/.gemini/antigravity-ide/brain/585626e7-9ba1-4c5f-b578-4c9b88b706c0/.system_generated/logs/transcript_full.jsonl';
  if (!fs.existsSync(transcriptPath)) {
    console.log('Transcript file not found');
    return;
  }

  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let foundUrls = new Set();
  let domTexts = [];

  for await (const line of rl) {
    if (line.includes('fahmida-sultana-naznin') || line.includes('media.licdn.com') || line.includes('licdn.com') || line.includes('browser_get_dom')) {
      try {
        const item = JSON.parse(line);
        const text = typeof item.content === 'string' ? item.content : JSON.stringify(item.content || '');
        const regex = /https:\/\/[^\s"'<>\\]+licdn\.com[^\s"'<>\\]*/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          foundUrls.add(match[0]);
        }
        if (text.includes('Fahmida Sultana Naznin') || text.includes('Experience') || text.includes('Education')) {
          domTexts.push({ step: item.step_index, length: text.length, snippet: text.slice(0, 300) });
        }
      } catch { /* non-fatal */ }
    }
  }

  console.log('--- FOUND IMAGE & MEDIA URLS ---');
  console.log(Array.from(foundUrls));
  console.log('\n--- DOM TEXT STEPS ---');
  console.log(domTexts);
}

extract();
