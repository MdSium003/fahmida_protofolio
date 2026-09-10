import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../public/data');

function readCsv(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  return Papa.parse(content, {
    header: true,
    skipEmptyLines: true
  }).data;
}

function writeCsv(fileName, data, columns) {
  const filePath = path.join(DATA_DIR, fileName);
  const csv = Papa.unparse(data, {
    columns: columns,
    quotes: true,
    newline: '\n'
  });
  fs.writeFileSync(filePath, csv + '\n', 'utf8');
  console.log(`Updated ${fileName} successfully (${data.length} rows)`);
}

// 1. Update research.csv
const researchData = readCsv('research.csv');
const updatedResearch = researchData.map(row => {
  let is_featured = 'false';
  let featured_order = '';
  if (String(row.id) === '9') {
    is_featured = 'true';
    featured_order = '1';
  } else if (String(row.id) === '4') {
    is_featured = 'true';
    featured_order = '2';
  } else if (String(row.id) === '6') {
    is_featured = 'true';
    featured_order = '3';
  } else if (String(row.id) === '1') {
    is_featured = 'true';
    featured_order = '4';
  }
  return {
    ...row,
    is_featured: row.is_featured || is_featured,
    featured_order: row.featured_order || featured_order
  };
});
const researchCols = ["id","title","thumbnail_url","description","abstract","status","award","year","topics","authors","links","media","is_featured","featured_order"];
writeCsv('research.csv', updatedResearch, researchCols);

// 2. Update awards.csv
const awardsData = readCsv('awards.csv');
const updatedAwards = awardsData.map(row => {
  let is_featured = 'false';
  let featured_order = '';
  if (String(row.id) === '4') {
    is_featured = 'true';
    featured_order = '1';
  } else if (String(row.id) === '10') {
    is_featured = 'true';
    featured_order = '2';
  } else if (String(row.id) === '5') {
    is_featured = 'true';
    featured_order = '3';
  } else if (String(row.id) === '7') {
    is_featured = 'true';
    featured_order = '4';
  } else if (String(row.id) === '9') {
    is_featured = 'true';
    featured_order = '5';
  }
  return {
    ...row,
    is_featured: row.is_featured || is_featured,
    featured_order: row.featured_order || featured_order
  };
});
const awardsCols = ["id","title","thumbnail_url","organization_name","organization_url","description","topic","year","media","is_featured","featured_order"];
writeCsv('awards.csv', updatedAwards, awardsCols);

// 3. Update blogs.csv
const blogsData = readCsv('blogs.csv');
const updatedBlogs = blogsData.map(row => {
  let is_featured = 'false';
  let featured_order = '';
  if (String(row.id) === '2') {
    is_featured = 'true';
    featured_order = '1';
  } else if (String(row.id) === '3') {
    is_featured = 'true';
    featured_order = '2';
  } else if (String(row.id) === '4') {
    is_featured = 'true';
    featured_order = '3';
  }
  return {
    ...row,
    is_featured: row.is_featured || is_featured,
    featured_order: row.featured_order || featured_order
  };
});
const blogsCols = ["id","title","thumbnail_url","description","published_date","links","media","is_featured","featured_order"];
writeCsv('blogs.csv', updatedBlogs, blogsCols);

// 4. Update skills.csv
const skillsList = [
  // Specialization Domains
  { id: 'dom_1', category: 'Domains', subcategory: 'Artificial Intelligence', name: 'Artificial Intelligence', proficiency: 'Deep Learning · ML · NLP', is_primary: 'true', icon: 'Brain', display_order: '1' },
  { id: 'dom_2', category: 'Domains', subcategory: 'Computer Vision', name: 'Computer Vision', proficiency: 'Medical AI · 3D Vision · Geometry', is_primary: 'true', icon: 'Eye', display_order: '2' },
  { id: 'dom_3', category: 'Domains', subcategory: 'Spatial Computing', name: 'Spatial Computing', proficiency: 'Unity · AR/VR · 3D Rendering', is_primary: 'true', icon: 'Box', display_order: '3' },
  { id: 'dom_4', category: 'Domains', subcategory: 'Robotics & Hardware', name: 'Robotics & Hardware', proficiency: 'Autonomous Systems · SLAM · IoT', is_primary: 'true', icon: 'Cpu', display_order: '4' },
  { id: 'dom_5', category: 'Domains', subcategory: 'Software Systems', name: 'Software Systems', proficiency: 'Full-Stack · Cloud · Architecture', is_primary: 'true', icon: 'Server', display_order: '5' },

  // Programming Languages
  { id: 'lang_1', category: 'Languages', subcategory: 'Programming Languages', name: 'Python', proficiency: '90', is_primary: 'true', icon: 'Code2', display_order: '1' },
  { id: 'lang_2', category: 'Languages', subcategory: 'Programming Languages', name: 'C++', proficiency: '85', is_primary: 'true', icon: 'Code2', display_order: '2' },
  { id: 'lang_3', category: 'Languages', subcategory: 'Programming Languages', name: 'C#', proficiency: '85', is_primary: 'true', icon: 'Code2', display_order: '3' },
  { id: 'lang_4', category: 'Languages', subcategory: 'Programming Languages', name: 'MATLAB', proficiency: '80', is_primary: 'false', icon: 'Code2', display_order: '4' },
  { id: 'lang_5', category: 'Languages', subcategory: 'Programming Languages', name: 'C', proficiency: '80', is_primary: 'false', icon: 'Code2', display_order: '5' },
  { id: 'lang_6', category: 'Languages', subcategory: 'Programming Languages', name: 'Java', proficiency: '80', is_primary: 'false', icon: 'Code2', display_order: '6' },
  { id: 'lang_7', category: 'Languages', subcategory: 'Programming Languages', name: 'Shell', proficiency: '75', is_primary: 'false', icon: 'Terminal', display_order: '7' },

  // AI & Machine Learning
  { id: 'frame_1', category: 'Frameworks', subcategory: 'AI & MACHINE LEARNING', name: 'PyTorch', proficiency: 'Machine Learning', is_primary: 'true', icon: 'Cpu', display_order: '1' },
  { id: 'frame_2', category: 'Frameworks', subcategory: 'AI & MACHINE LEARNING', name: 'TensorFlow', proficiency: 'ML Framework', is_primary: 'true', icon: 'Cpu', display_order: '2' },
  { id: 'frame_3', category: 'Frameworks', subcategory: 'AI & MACHINE LEARNING', name: 'Keras', proficiency: 'Deep Learning', is_primary: 'false', icon: 'Cpu', display_order: '3' },
  { id: 'frame_4', category: 'Frameworks', subcategory: 'AI & MACHINE LEARNING', name: 'Geomstats', proficiency: 'Statistics', is_primary: 'false', icon: 'Cpu', display_order: '4' },

  // Computer Vision & Graphics
  { id: 'frame_5', category: 'Frameworks', subcategory: 'COMPUTER VISION & GRAPHICS', name: 'OpenCV', proficiency: 'Computer Vision', is_primary: 'true', icon: 'Layers', display_order: '5' },
  { id: 'frame_6', category: 'Frameworks', subcategory: 'COMPUTER VISION & GRAPHICS', name: 'PyTorch3D', proficiency: '3D Vision', is_primary: 'true', icon: 'Layers', display_order: '6' },
  { id: 'frame_7', category: 'Frameworks', subcategory: 'COMPUTER VISION & GRAPHICS', name: 'OpenGL', proficiency: 'Graphics', is_primary: 'false', icon: 'Layers', display_order: '7' },
  { id: 'frame_8', category: 'Frameworks', subcategory: 'COMPUTER VISION & GRAPHICS', name: 'Three.js', proficiency: 'Web 3D', is_primary: 'false', icon: 'Layers', display_order: '8' },
  { id: 'frame_9', category: 'Frameworks', subcategory: 'COMPUTER VISION & GRAPHICS', name: 'AR.js', proficiency: 'Augmented Reality', is_primary: 'false', icon: 'Layers', display_order: '9' },

  // 3D Engines & Spatial Tools
  { id: 'tool_1', category: 'Tools', subcategory: '3D ENGINES & SPATIAL TOOLS', name: 'Unity', proficiency: 'Game Engine', is_primary: 'true', icon: 'Box', display_order: '1' },
  { id: 'tool_2', category: 'Tools', subcategory: '3D ENGINES & SPATIAL TOOLS', name: 'Blender', proficiency: '3D Modeling', is_primary: 'true', icon: 'Box', display_order: '2' },
  { id: 'tool_3', category: 'Tools', subcategory: '3D ENGINES & SPATIAL TOOLS', name: 'Vuforia', proficiency: 'AR Tool', is_primary: 'false', icon: 'Box', display_order: '3' },

  // Web, Systems, Cloud & Embedded
  { id: 'tool_4', category: 'Tools', subcategory: 'WEB, CLOUD & EMBEDDED', name: 'Django', proficiency: 'Web Framework', is_primary: 'true', icon: 'Globe', display_order: '4' },
  { id: 'tool_5', category: 'Tools', subcategory: 'WEB, CLOUD & EMBEDDED', name: 'Firebase', proficiency: 'Backend Service', is_primary: 'false', icon: 'Database', display_order: '5' },
  { id: 'tool_6', category: 'Tools', subcategory: 'WEB, CLOUD & EMBEDDED', name: 'Arduino', proficiency: 'Embedded', is_primary: 'true', icon: 'Cpu', display_order: '6' },
  { id: 'tool_7', category: 'Tools', subcategory: 'WEB, CLOUD & EMBEDDED', name: 'Android Studio', proficiency: 'IDE', is_primary: 'false', icon: 'Globe', display_order: '7' },
  { id: 'tool_8', category: 'Tools', subcategory: 'WEB, CLOUD & EMBEDDED', name: 'NuGet', proficiency: 'Package Manager', is_primary: 'false', icon: 'Globe', display_order: '8' },
  { id: 'tool_9', category: 'Tools', subcategory: 'WEB, CLOUD & EMBEDDED', name: 'Chrome Engine', proficiency: 'Browser Engine', is_primary: 'false', icon: 'Globe', display_order: '9' }
];
const skillsCols = ["id","category","subcategory","name","proficiency","is_primary","icon","display_order"];
writeCsv('skills.csv', skillsList, skillsCols);

// 5. Create moments.csv
const momentsList = [
  { id: '1', image_url: '/wall/fahmida_with_purdue.jpeg', caption: 'Purdue University Research & Global Fellowship Collaboration', display_order: '1' },
  { id: '2', image_url: '/wall/fahmida_with_robot.jpeg', caption: 'Hardware Robotics SLAM & Microcontroller Prototyping', display_order: '2' },
  { id: '3', image_url: '/wall/fahmida_with_ddn.jpeg', caption: 'Technical Presentation & Innovation Showcase', display_order: '3' },
  { id: '4', image_url: '/wall/fahmida_with_car.jpeg', caption: '3D Computer Vision & Autonomous Systems Experiments', display_order: '4' },
  { id: '5', image_url: '/wall/fahmida_with_show_pice.jpeg', caption: 'National Competition & Technology Honors', display_order: '5' },
  { id: '6', image_url: '/wall/orangeCorner.jpeg', caption: 'Orange Corners Innovation Hub Fellowship', display_order: '6' },
  { id: '7', image_url: '/wall/Phd.jpeg', caption: 'Graduate Research & Biomedical Machine Learning Lab', display_order: '7' },
  { id: '8', image_url: '/wall/fahmida_with_lal_background.jpeg', caption: 'Academic Excellence & Institutional Leadership', display_order: '8' },
  { id: '9', image_url: '/wall/college.jpeg', caption: 'Holy Cross College Science & English Language Leadership', display_order: '9' },
  { id: '10', image_url: '/wall/undergrad.jpeg', caption: 'BUET Computer Science & Engineering Milestones', display_order: '10' }
];
const momentsCols = ["id","image_url","caption","display_order"];
writeCsv('moments.csv', momentsList, momentsCols);

// 6. Clean experience.csv (remove stray typo line)
const expData = readCsv('experience.csv');
const cleanedExp = expData.map(row => {
  if (row.description) {
    row.description = row.description.replace(/\*vyfyifyi/g, '').trim();
  }
  return row;
});
const expCols = ["id","job_title","company","location","start_date","end_date","employment_type","description","skills_used","external_link","logo_url"];
writeCsv('experience.csv', cleanedExp, expCols);

console.log('All CSV schemas and data normalized successfully!');
