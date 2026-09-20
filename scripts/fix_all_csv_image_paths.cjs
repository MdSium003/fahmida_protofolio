const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');

function replaceDeadUrlsInFile(filename, replacements) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace common supabase prefixes
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/Education\/undergrad\.jpeg/g, '/wall/undergrad.jpeg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/Education\/college\.jpeg/g, '/wall/college.jpeg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/Education\/school\.jpeg/g, '/wall/school.jpeg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/multiple_pic_vid_link\/fahmida_with_car\.jpeg/g, '/wall/fahmida_with_car.jpeg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/multiple_pic_vid_link\/fahmida_with_robot\.jpeg/g, '/wall/fahmida_with_robot.jpeg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/multiple_pic_vid_link\/research_1\.jpg/g, '/wall/research_1.jpg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/multiple_pic_vid_link\/research_2\.jpg/g, '/wall/research_2.jpg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/multiple_pic_vid_link\/research_3\.jpg/g, '/wall/research_3.jpg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/multiple_pic_vid_link\/research_4\.jpg/g, '/wall/research_4.jpg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/multiple_pic_vid_link\/mir_mehedi\.jpg/g, '/wall/fahmida_with_purdue.jpeg');
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co\/storage\/v1\/object\/public\/Awards\/wie_award\.png/g, '/wall/fahmida_with_lal_background.jpeg');
  content = content.replace(/https:\/\/example\.com\/thumb\d+\.png/g, '/wall/research_1.jpg');
  content = content.replace(/https:\/\/example\.com\/award\d+\.jpg/g, '/wall/fahmida_with_show_pice.jpeg');

  // Any remaining generic supabase URLs
  content = content.replace(/https:\/\/qmkxkqxbhyxkqqyfshex\.supabase\.co[^\s\",;]+/g, '/wall/undergrad.jpeg');

  if (replacements) {
    for (const [from, to] of Object.entries(replacements)) {
      content = content.replaceAll(from, to);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filename}`);
}

// 1. Update experience.csv (fix LinkedIn CDN 403 blocks)
replaceDeadUrlsInFile('experience.csv', {
  'https://media.licdn.com/dms/image/v2/C560BAQG0xK2Xv0qXQw/company-logo_200_200/company-logo_200_200/0/1630653655184/stamford_university_bangladesh_logo?e=1773273600&v=beta&t=example': '/wall/undergrad.jpeg',
  'https://media.licdn.com/dms/image/v2/C560BAQHqF477Xl4s9g/company-logo_200_200/company-logo_200_200/0/1630652758253/national_university_of_singapore_logo?e=1773273600&v=beta&t=example': '/wall/fahmida_with_purdue.jpeg',
  'https://media.licdn.com/dms/image/v2/D560BAQE1PmOGyU3wAg/company-logo_100_100/company-logo_100_100/0/1716005478424/bioserc_logo?e=1773273600&v=beta&t=sbKYoCe-HTAS7cedDpYiEtquzBtSKZl_lXL1FMey17Q': '/wall/research_1.jpg',
  'https://media.licdn.com/dms/image/v2/D560BAQGc3KgMiB8OWg/img-crop_100/B56ZgurXDuHMAQ-/0/1753129777280?e=1773273600&v=beta&t=-FJFpKNue5pV8xUUO0mW85CQ1nZTfS9mmVS6XoeEDSc': '/wall/fahmida_with_lal_background.jpeg',
  'https://media.licdn.com/dms/image/v2/C560BAQHJnS1JtwJTtg/company-logo_200_200/company-logo_200_200/0/1679934544186/esolumateglobal_logo?e=1773273600&v=beta&t=oTh6OUMpXiCjD5LCXo_f1UFcUSwfPHwSeivdGBm4Mt4': '/wall/Banglalink.jpeg'
});

// 2. Update education.csv
replaceDeadUrlsInFile('education.csv');

// 3. Update news.csv
replaceDeadUrlsInFile('news.csv');

// 4. Update awards.csv
replaceDeadUrlsInFile('awards.csv');

// 5. Update projects.csv
replaceDeadUrlsInFile('projects.csv');

// 6. Update research.csv
replaceDeadUrlsInFile('research.csv');

// 7. Update blogs.csv
replaceDeadUrlsInFile('blogs.csv');

// 8. Update volunteer.csv
replaceDeadUrlsInFile('volunteer.csv');

// 9. Update leadership.csv
replaceDeadUrlsInFile('leadership.csv');

console.log('All CSV datasets successfully sanitized and linked to local /wall assets!');
