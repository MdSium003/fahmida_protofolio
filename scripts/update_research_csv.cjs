const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const researchPath = path.join(__dirname, '../public/data/research.csv');
const rawContent = fs.readFileSync(researchPath, 'utf8');
const parsed = Papa.parse(rawContent, { header: true, skipEmptyLines: true });

const venueMappings = {
  "9": {
    venue: "arXiv preprint · 2025",
    external_url: "https://arxiv.org/",
    has_demo: "true",
    demo_url: "https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Dr. Md. Golam Rabiul Alam ; Dr. Sadia Sharmin",
    topics: "Clinical AI & Deep Learning, LLMs & Multi-Agent"
  },
  "4": {
    venue: "Under review — MICCAI 2025",
    external_url: "https://dl.acm.org/doi/10.1145/3491102.3501923",
    has_demo: "true",
    demo_url: "https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Md. Mehedi Hasan Shawon ; Dr. Atif Hasan Rahman",
    topics: "Computer Vision & Imaging, Clinical AI & Deep Learning"
  },
  "6": {
    venue: "11th NSysS 2024",
    external_url: "https://dl.acm.org/doi/10.1145/3491102.3501923",
    has_demo: "true",
    demo_url: "https://youtu.be/WJvr_jstEfU?si=U_D_NUe4qR308Ohz",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Md. Mehedi Hasan Shawon ; Dr. Md. Golam Rabiul Alam",
    topics: "Computer Vision & Imaging, Clinical AI & Deep Learning"
  },
  "5": {
    venue: "Under review — IEEE TMI",
    external_url: "https://arxiv.org/",
    has_demo: "false",
    demo_url: "",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Dr. Sadia Sharmin ; Dr. Atif Hasan Rahman",
    topics: "Computer Vision & Imaging, Clinical AI & Deep Learning"
  },
  "3": {
    venue: "Under review — EMNLP 2024",
    external_url: "https://github.com/aaniksahaa/CBRS",
    has_demo: "true",
    demo_url: "https://github.com/aaniksahaa/CBRS",
    authors: "Anik Saha|https://github.com/aaniksahaa ; Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Dr. Md Rakibul Hasan",
    topics: "NLP & Datasets, LLMs & Multi-Agent"
  },
  "1": {
    venue: "IEEE Access · 2025",
    external_url: "https://ieeexplore.ieee.org/",
    has_demo: "true",
    demo_url: "https://youtu.be/qIXg9vJ6hZM?si=5liTMbMY_VbdWT0r",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Md. Mehedi Hasan Shawon ; Dr. Md. Golam Rabiul Alam",
    topics: "Computer Vision & Imaging, Clinical AI & Deep Learning"
  },
  "7": {
    venue: "10th NSysS 2023",
    external_url: "https://dl.acm.org/",
    has_demo: "false",
    demo_url: "",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Dr. Sadia Sharmin",
    topics: "Computer Vision & Imaging, Clinical AI & Deep Learning"
  },
  "2": {
    venue: "ACL 2025 (Findings)",
    external_url: "https://github.com/fahmidahossain/Report_Summarization",
    has_demo: "true",
    demo_url: "https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Md. Mehedi Hasan Shawon ; Dr. Md Rakibul Hasan ; Dr. Md. Golam Rabiul Alam",
    topics: "NLP & Datasets, Clinical AI & Deep Learning"
  },
  "12": {
    venue: "8th ICCBB 2024",
    external_url: "https://youtu.be/Wn10w_Qcu5Q?si=R0hNV0o4srLAQzjp",
    has_demo: "true",
    demo_url: "https://youtu.be/Wn10w_Qcu5Q?si=R0hNV0o4srLAQzjp",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Dr. Atif Hasan Rahman",
    topics: "Clinical AI & Deep Learning, LLMs & Multi-Agent"
  },
  "11": {
    venue: "Submitted to ACL ARR 2026",
    external_url: "https://arxiv.org/",
    has_demo: "false",
    demo_url: "",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Md. Mehedi Hasan Shawon ; Dr. Md. Golam Rabiul Alam",
    topics: "Computer Vision & Imaging, NLP & Datasets"
  },
  "10": {
    venue: "arXiv preprint · 2024",
    external_url: "https://anonymous.4open.science/r/doctalk",
    has_demo: "true",
    demo_url: "https://anonymous.4open.science/r/doctalk",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Co-Authors",
    topics: "NLP & Datasets, Clinical AI & Deep Learning"
  },
  "8": {
    venue: "IEEE VIP Cup 2025",
    external_url: "https://signalprocessingsociety.org/",
    has_demo: "false",
    demo_url: "",
    authors: "Mst. Fahmida Sultana Naznin|https://github.com/fahmidahossain ; Team BUET",
    topics: "Computer Vision & Imaging, Clinical AI & Deep Learning"
  }
};

const updatedData = parsed.data.map(row => {
  const map = venueMappings[String(row.id)] || {};
  return {
    id: row.id,
    title: row.title ? row.title.replace(/\r?\n/g, ' ').trim() : '',
    thumbnail_url: row.thumbnail_url || '/wall/research_1.jpg',
    description: row.description ? row.description.trim() : '',
    abstract: row.abstract ? row.abstract.trim() : '',
    status: row.status ? row.status.trim().toLowerCase() : 'published',
    award: row.award || '',
    year: row.year || '2025',
    topics: map.topics || row.topics || 'Clinical AI & Deep Learning',
    authors: map.authors || row.authors || 'Mst. Fahmida Sultana Naznin',
    links: row.links || '',
    media: row.media || '',
    is_featured: row.is_featured || 'false',
    featured_order: row.featured_order || '999',
    venue: map.venue || 'Research Publication',
    external_url: map.external_url || '',
    has_demo: map.has_demo || 'false',
    demo_url: map.demo_url || '',
    bibtex: row.bibtex || ''
  };
});

const unparsedCsv = Papa.unparse(updatedData, {
  quotes: true,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  newline: "\n"
});

fs.writeFileSync(researchPath, unparsedCsv, 'utf8');
console.log('Successfully updated research.csv with new columns!');
