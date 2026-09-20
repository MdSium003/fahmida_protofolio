import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../public/data');

const DATA_CONFIGS = [
  {
    fileName: 'projects.csv',
    requiredFields: ['id', 'title'],
    booleanFields: ['is_featured'],
    numericFields: ['featured_order', 'year'],
  },
  {
    fileName: 'research.csv',
    requiredFields: ['id', 'title'],
    booleanFields: ['is_featured', 'has_demo'],
    numericFields: ['featured_order', 'year'],
  },
  {
    fileName: 'awards.csv',
    requiredFields: ['id', 'title'],
    booleanFields: ['is_featured', 'showcase_home'],
    numericFields: ['featured_order', 'year'],
  },
  {
    fileName: 'blogs.csv',
    requiredFields: ['id', 'title'],
    booleanFields: ['is_featured'],
    numericFields: ['featured_order'],
  },
  {
    fileName: 'skills.csv',
    requiredFields: ['id', 'category', 'name'],
    booleanFields: ['is_primary'],
    numericFields: ['display_order'],
  },
  {
    fileName: 'education.csv',
    requiredFields: ['id', 'institution', 'degree_level'],
    booleanFields: [],
    numericFields: ['start_year', 'end_year'],
  },
  {
    fileName: 'experience.csv',
    requiredFields: ['id', 'job_title', 'company'],
    booleanFields: [],
    numericFields: ['sort_order'],
  },
  {
    fileName: 'volunteer.csv',
    requiredFields: ['id', 'role', 'organization'],
    booleanFields: [],
    numericFields: ['sort_order'],
  },
  {
    fileName: 'leadership.csv',
    requiredFields: ['id', 'role', 'organization'],
    booleanFields: [],
    numericFields: ['sort_order'],
  },
  {
    fileName: 'social_links.csv',
    requiredFields: ['id', 'platform', 'url'],
    booleanFields: [],
    numericFields: ['sort_order'],
  },
  {
    fileName: 'moments.csv',
    requiredFields: ['id', 'image_url'],
    booleanFields: [],
    numericFields: ['display_order'],
  },
  {
    fileName: 'media_mentions.csv',
    requiredFields: ['id', 'title', 'outlet', 'media_type'],
    booleanFields: ['is_featured'],
    numericFields: ['display_order'],
  },
  {
    fileName: 'news.csv',
    requiredFields: ['id', 'title'],
    booleanFields: ['is_featured'],
    numericFields: ['sort_order'],
  },
  {
    fileName: 'upcycling.csv',
    requiredFields: ['id', 'title'],
    booleanFields: [],
    numericFields: ['display_order'],
  },
];

function validateBoolean(val) {
  if (val === undefined || val === null || val === '') return true;
  const s = String(val).trim().toLowerCase();
  return ['true', 'false', '1', '0', 'yes', 'no'].includes(s);
}

function validateNumeric(val) {
  if (val === undefined || val === null || val === '') return true;
  return !isNaN(Number(val));
}

function runValidation() {
  console.log('\n======================================================');
  console.log('🔍 PORTFOLIO CSV DATA ARCHITECTURE VALIDATION');
  console.log('======================================================\n');

  let totalFiles = 0;
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const config of DATA_CONFIGS) {
    totalFiles++;
    const filePath = path.join(DATA_DIR, config.fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ [MISSING FILE] ${config.fileName} does not exist at ${filePath}`);
      totalErrors++;
      continue;
    }

    const rawContent = fs.readFileSync(filePath, 'utf8');
    if (!rawContent.trim()) {
      console.warn(`⚠️ [EMPTY FILE] ${config.fileName} is empty.`);
      totalWarnings++;
      continue;
    }

    const parsed = Papa.parse(rawContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors && parsed.errors.length > 0) {
      console.error(`❌ [PARSING ERROR] ${config.fileName} has syntax/CSV delimiter errors:`);
      parsed.errors.forEach(e => {
        console.error(`   - Row ${e.row}: ${e.message}`);
      });
      totalErrors += parsed.errors.length;
    }

    const rows = parsed.data || [];
    const seenIds = new Set();
    let fileErrors = 0;

    rows.forEach((row, idx) => {
      const rowNum = idx + 2; // +1 for 1-based index, +1 for CSV header row

      // 1. Check ID uniqueness & existence
      const rowId = row.id !== undefined && row.id !== null ? String(row.id).trim() : '';
      if (!rowId) {
        console.error(`❌ [${config.fileName}: Row ${rowNum}] Missing required unique 'id'.`);
        fileErrors++;
      } else {
        if (seenIds.has(rowId)) {
          console.error(`❌ [${config.fileName}: Row ${rowNum}] Duplicate ID detected: "${rowId}". IDs must be globally unique per file.`);
          fileErrors++;
        }
        seenIds.add(rowId);
      }

      // 2. Check required fields
      for (const reqField of config.requiredFields) {
        if (reqField === 'id') continue;
        const val = row[reqField];
        if (val === undefined || val === null || String(val).trim() === '') {
          console.error(`❌ [${config.fileName}: Row ${rowNum}] Missing required field "${reqField}".`);
          fileErrors++;
        }
      }

      // 3. Check boolean fields
      for (const boolField of config.booleanFields) {
        if (row[boolField] !== undefined && !validateBoolean(row[boolField])) {
          console.error(`❌ [${config.fileName}: Row ${rowNum}] Invalid boolean value for "${boolField}": "${row[boolField]}". Expected "true" or "false".`);
          fileErrors++;
        }
      }

      // 4. Check numeric fields
      for (const numField of config.numericFields) {
        if (row[numField] !== undefined && !validateNumeric(row[numField])) {
          console.error(`❌ [${config.fileName}: Row ${rowNum}] Invalid numeric value for "${numField}": "${row[numField]}".`);
          fileErrors++;
        }
      }
    });

    if (fileErrors === 0) {
      console.log(`✅ [VALID] ${config.fileName.padEnd(18)} (${rows.length.toString().padStart(2)} rows) - Schema & integrity passed.`);
    } else {
      totalErrors += fileErrors;
    }
  }

  console.log('\n------------------------------------------------------');
  if (totalErrors === 0) {
    console.log(`🎉 ALL ${totalFiles} CSV DATASETS VALIDATED SUCCESSFULLY! 0 errors.\n`);
    process.exit(0);
  } else {
    console.error(`💥 DATA VALIDATION FAILED: Found ${totalErrors} errors across portfolio CSV files.`);
    console.error(`Please fix the CSV issues above before building or committing.\n`);
    process.exit(1);
  }
}

runValidation();
