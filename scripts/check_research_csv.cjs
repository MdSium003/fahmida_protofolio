const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const content = fs.readFileSync(path.join(__dirname, '../public/data/research.csv'), 'utf8');
const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });

console.log('====================================================');
console.log('RESEARCH.CSV INSPECTION & MAPPING CHECK');
console.log('====================================================');
console.log('Total Row Count:', parsed.data.length);
console.log('Existing Columns:', parsed.meta.fields);
console.log('\nSample Row 1:');
console.log(JSON.stringify(parsed.data[0], null, 2));

console.log('\nAll Rows Summary:');
parsed.data.forEach((r, idx) => {
  console.log(`[${idx + 1}] ID: ${r.id} | Status: ${r.status} | Year: ${r.year} | Title: ${r.title ? r.title.replace(/\n/g, ' ').slice(0, 60) : ''}...`);
});
