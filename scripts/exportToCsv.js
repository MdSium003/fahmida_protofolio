import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://qmkxkqxbhyxkqqyfshex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFta3hrcXhiaHl4a3FxeWZzaGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODA3NjMsImV4cCI6MjA3OTc1Njc2M30.Aqvws61yjb30_Vek9C0rE9RBtY8ctwlugPucEmgsvG8';

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
  'home_social_links',
  'education_history',
  'experience_history',
  'simple_languages',
  'simple_frameworks',
  'simple_tools',
  'fahmida_projects',
  'fahmida_project_sources',
  'awards',
  'award_topics',
  'award_media',
  'volunteer_history',
  'upcycling_projects',
  'fahmida_blogs',
  'fahmida_blog_media',
  'fahmida_blog_links',
  'projects',
  'topics',
  'project_topics',
  'authors',
  'project_authors',
  'project_links',
  'project_media'
];

const outDir = path.resolve('public/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function exportAll() {
  console.log('Fetching data from Supabase...');
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.warn(`Could not fetch table ${table}:`, error.message);
        continue;
      }
      if (data && data.length > 0) {
        const csv = Papa.unparse(data);
        fs.writeFileSync(path.join(outDir, `${table}.csv`), csv, 'utf8');
        console.log(`✓ Exported ${table}.csv (${data.length} rows)`);
      } else {
        console.log(`- Table ${table} is empty`);
        fs.writeFileSync(path.join(outDir, `${table}.csv`), '', 'utf8');
      }
    } catch (err) {
      console.error(`Error on ${table}:`, err.message);
    }
  }
  console.log('Finished exporting to public/data/*.csv');
}

exportAll();
