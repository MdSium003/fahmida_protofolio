
create table public.topics (
  id          bigserial primary key,
  name        text not null,
  slug        text unique,
  created_at  timestamp default now()
);
select * from public.topics

insert into public.topics (name, slug) values
('Natural Language Processing', 'natural-language-processing'),
('LLM', 'llm'),
('LLM Web Agent', 'llm-web-agent'),
('Deep Learning', 'deep-learning'),
('Interactive System', 'interactive-system'),
('HCI', 'hci'),
('Creative Toolkit', 'creative-toolkit'),
('Image & Video Understanding', 'image-video-understanding'),
('AR/VR', 'ar-vr'),
('Computer Graphics', 'computer-graphics'),
('A11Y', 'a11y'),
('Computer Vision', 'computer-vision');

select * from  public.topics 

create table public.projects (
  id             bigserial primary key,
  title          text not null,
  thumbnail_url  text,
  description    text,
  status         text check (status in ('ongoing','published','preprint','past')) not null default 'ongoing',
  award          text,
  year           int,
  created_at     timestamp default now()
);   

alter table public.projects
add column abstract text;


select * from public.projects;
/// data 
INSERT INTO public.projects 
(title, thumbnail_url, description, status, award, year, abstract)
VALUES
-- 5 ongoing
('AI Chatbot for Students',
 'https://example.com/thumb1.png',
 'A chatbot to help students with academic queries.',
 'ongoing', NULL, 2025,
 'Researching NLP-based conversational systems.'
),
('Smart Grocery Inventory',
 'https://example.com/thumb2.png',
 'Tracks grocery items and alerts before expiry.',
 'ongoing', 'Top 10 in Campus Hackathon', 2025,
 'Exploring image recognition and reminders for household items.'
),
('3D AR Furniture Viewer',
 'https://example.com/thumb3.png',
 'Lets users preview furniture in AR before buying.',
 'ongoing', NULL, 2024,
 'Using ARCore to align furniture objects in real environments.'
),
('Code Review AI',
 'https://example.com/thumb4.png',
 'AI-based code review assistant for developers.',
 'ongoing', NULL, 2025,
 'Analyzing code patterns and LLM-based suggestions.'
),
('University Portal Redesign',
 'https://example.com/thumb5.png',
 'Redesigning university portal UI/UX.',
 'ongoing', NULL, 2024,
 'Studying usability issues and modern UI patterns.'
),

-- 2 published
('Bangla OCR System',
 'https://example.com/thumb6.png',
 'OCR for Bangla handwritten text.',
 'published', 'Best Research Paper Award', 2024,
 'Detecting Bangla characters using CNN & transformer models.'
),
('Weather Forecasting ML Model',
 'https://example.com/thumb7.png',
 'A model predicting local weather using ML.',
 'published', NULL, 2023,
 'Time-series based climate prediction research.'
),

-- 2 preprint
('Human Activity Recognition',
 'https://example.com/thumb8.png',
 'Recognizes human activities using motion sensors.',
 'preprint', NULL, 2025,
 'Proposing a new LSTM-based architecture.'
),
('Video Summarization AI',
 'https://example.com/thumb9.png',
 'Automatically creates short summaries from long videos.',
 'preprint', NULL, 2025,
 'LLM + vision transformer based shot detection approach.'
),

-- 2 past
('Class Routine Automation',
 'https://example.com/thumb10.png',
 'Generates university class routine automatically.',
 'past', NULL, 2021,
 'Constraint-based scheduling system.'
),
('Smart Parking System',
 'https://example.com/thumb11.png',
 'IoT-based automatic parking spot detection.',
 'past', 'Innovation Award', 2022,
 'Using sensors and ML for parking slot prediction.'
);



create table public.project_topics (
  id         bigserial primary key,
  project_id bigint not null references public.projects(id) on delete cascade,
  topic_id   bigint not null references public.topics(id) on delete cascade,
  created_at timestamp default now(),
  unique(project_id, topic_id)  -- same project-topic combination duplicate na hote
);
select * from public.project_topics;

INSERT INTO public.project_topics (project_id, topic_id) VALUES
(1, 1), (1, 2),
(2, 4), (2, 8),
(3, 8), (3, 9),
(4, 2), (4, 4),
(5, 6), (5, 10),
(6, 12),
(7, 4),
(8, 4), (8, 1),
(9, 4), (9, 8),
(10, 6),
(11, 8);






create table public.project_links (
  id         bigserial primary key,
  project_id bigint not null references public.projects(id) on delete cascade,
  type       text not null check (type in ('preprint','blog','abstract','code','video','paper','other')),
  url        text not null,
  created_at timestamp default now()
);

-- Project 1
INSERT INTO public.project_links (project_id, type, url) VALUES
(1, 'code', 'https://github.com/fahmidahossain/Speakio'),
(1, 'abstract', 'https://dl.acm.org/doi/10.1145/3491102.3501923'),
(1, 'video', 'https://youtu.be/qIXg9vJ6hZM?si=5liTMbMY_VbdWT0r');

-- Project 2
INSERT INTO public.project_links (project_id, type, url) VALUES
(2, 'blog', 'https://github.com/fahmidahossain/Speakio'),
(2, 'paper', 'https://www.scirp.org/journal/articles?searchcode=Alexandra+Ortega&searchfield=authors&page=1'),
(2, 'preprint', 'https://dl.acm.org/doi/10.1145/3491102.3501923');

-- Project 3
INSERT INTO public.project_links (project_id, type, url) VALUES
(3, 'code', 'https://github.com/fahmidahossain/Speakio'),
(3, 'abstract', 'https://dl.acm.org/doi/10.1145/3491102.3501923'),
(3, 'video', 'https://youtu.be/qIXg9vJ6hZM?si=5liTMbMY_VbdWT0r');

-- Project 4
INSERT INTO public.project_links (project_id, type, url) VALUES
(4, 'code', 'https://github.com/fahmidahossain/Speakio'),
(4, 'abstract', 'https://dl.acm.org/doi/10.1145/3491102.3501923'),
(4, 'video', 'https://youtu.be/qIXg9vJ6hZM?si=5liTMbMY_VbdWT0r');

-- Project 5
INSERT INTO public.project_links (project_id, type, url) VALUES
(5, 'code', 'https://github.com/fahmidahossain/Speakio'),
(5, 'abstract', 'https://dl.acm.org/doi/10.1145/3491102.3501923'),
(5, 'video', 'https://youtu.be/qIXg9vJ6hZM?si=5liTMbMY_VbdWT0r');

-- Project 6
INSERT INTO public.project_links (project_id, type, url) VALUES
(6, 'code', 'https://github.com/fahmidahossain/Speakio'),
(6, 'abstract', 'https://dl.acm.org/doi/10.1145/3491102.3501923'),
(6, 'video', 'https://youtu.be/qIXg9vJ6hZM?si=5liTMbMY_VbdWT0r');







 select * from public.project_links  ;

create table public.project_media (
  id         bigserial primary key,
  project_id bigint not null references public.projects(id) on delete cascade,
  media_type text not null check (media_type in ('image','youtube','video')),
  media_url  text not null,
  created_at timestamp default now()
);


-- Project 1

INSERT INTO public.project_media (project_id, media_type, media_url) VALUES

(1, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(1, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_2.jpg'),
(1, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_3.jpg'),
(1, 'youtube', 'https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI'),
(1, 'youtube', 'https://youtu.be/ZJaKBSaDSt0?si=l3-8dYRdNN2rb3Ku'),

-- Project 2
(2, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(2, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_2.jpg'),
(2, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_3.jpg'),
(2, 'youtube', 'https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI'),
(2, 'youtube', 'https://youtu.be/ZJaKBSaDSt0?si=l3-8dYRdNN2rb3Ku'),

-- Project 3
(3, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(3, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_2.jpg'),
(3, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_3.jpg'),
(3, 'youtube', 'https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI'),
(3, 'youtube', 'https://youtu.be/ZJaKBSaDSt0?si=l3-8dYRdNN2rb3Ku'),

-- Project 4
(4, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(4, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_2.jpg'),
(4, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_3.jpg'),
(4, 'youtube', 'https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI'),
(4, 'youtube', 'https://youtu.be/ZJaKBSaDSt0?si=l3-8dYRdNN2rb3Ku'),

-- Project 5
(5, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(5, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_2.jpg'),
(5, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_3.jpg'),
(5, 'youtube', 'https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI'),
(5, 'youtube', 'https://youtu.be/ZJaKBSaDSt0?si=l3-8dYRdNN2rb3Ku'),

-- Project 6
(6, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(6, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_2.jpg'),
(6, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_3.jpg'),
(6, 'youtube', 'https://youtu.be/jyerIT_txG0?si=9RaI6rVtJXlwX0CI'),
(6, 'youtube', 'https://youtu.be/ZJaKBSaDSt0?si=l3-8dYRdNN2rb3Ku');




select * from public.project_media


















// authors 

create table public.authors (
  id         bigserial primary key,
  name       text not null,
  github_url text,
  website    text,
  created_at timestamp default now()
);

INSERT INTO public.authors (name, github_url, website) VALUES
('Author A', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author B', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author C', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author D', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author E', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author F', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author G', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author H', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author I', 'https://github.com/farhan5384', 'https://oaishi.github.io/'),
('Author J', 'https://github.com/farhan5384', 'https://oaishi.github.io/');








// author er orderta
create table public.project_authors (
  id          bigserial primary key,
  project_id  bigint not null references public.projects(id) on delete cascade,
  author_id   bigint not null references public.authors(id) on delete cascade,
  author_order int,   -- to show authors in correct order
  unique(project_id, author_id)
);


INSERT INTO public.project_authors (project_id, author_id, author_order) VALUES
-- Project 1
(1, 3, 1),
(1, 7, 2),
(1, 1, 3),
(1, 9, 4),

-- Project 2
(2, 4, 1),
(2, 10, 2),
(2, 2, 3),
(2, 8, 4),

-- Project 3
(3, 5, 1),
(3, 1, 2),
(3, 6, 3),
(3, 3, 4),

-- Project 4
(4, 7, 1),
(4, 2, 2),
(4, 9, 3),
(4, 4, 4),

-- Project 5
(5, 8, 1),
(5, 6, 2),
(5, 10, 3),
(5, 1, 4),

-- Project 6
(6, 2, 1),
(6, 5, 2),
(6, 7, 3),
(6, 3, 4);














//home page er jonne link er  table gula

create table public.home_social_links (
  id          bigserial primary key,
  platform    text not null,        -- e.g. "facebook", "github", "linkedin"
  url         text not null,        -- actual link
  icon        text,                 -- (optional) icon name for frontend (e.g. lucide icon name)
  sort_order  int default 0,        -- order of appearance
  created_at  timestamp default now()
);

insert into public.home_social_links (platform, url, icon, sort_order) values
('facebook', 'https://www.facebook.com/share/1GEBz2BEGi/', 'facebook', 1),
('linkedin', 'https://bd.linkedin.com/in/fahmida-sultana-naznin', 'linkedin', 2),
('youtube', 'https://www.youtube.com/@fahmidasultana5879', 'youtube', 3),
('github', 'https://github.com/fahmidahossain', 'github', 4),
('instagram', 'https://www.instagram.com/fahmidasultana4444/', 'instagram', 5);
insert into public.home_social_links (platform, url, icon, sort_order) values
('cv', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/assets/CV/CV_Fahmida%20(1).pdf', 'file', 6);



select * from public.home_social_links




-- =============================================
-- AWARDS SECTION TABLES
-- =============================================

-- 1. Award Topics Table
CREATE TABLE public.award_topics (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Insert default topics
INSERT INTO public.award_topics (name, slug) VALUES
('CS Competitions', 'cs-competitions'),
('Research and Fellowships', 'research-fellowships'),
('Writing Competitions', 'writing-competitions'),
('Olympiads', 'olympiads'),
('Academic Scholarships', 'academic-scholarships');

select * from public.award_topics
-- 2. Main Awards Table
CREATE TABLE public.awards (
  id                BIGSERIAL PRIMARY KEY,
  title             TEXT NOT NULL,
  thumbnail_url     TEXT,
  organization_name TEXT,
  organization_url  TEXT,
  description       TEXT,
  topic_id          BIGINT REFERENCES public.award_topics(id) ON DELETE SET NULL,
  year              INT,
  created_at        TIMESTAMP DEFAULT NOW()
);

select * from public.awards

--2020
INSERT INTO public.awards 
(title, thumbnail_url, organization_name, organization_url, description, topic_id, year)
VALUES
(
 'IEEE Early Research Excellence Award 2020',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'IEEE Regional Innovation Division',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'This award recognizes one of the earliest but most influential research outputs produced in 2020, focusing primarily on algorithmic optimization and computational learning foundations. The work demonstrated a strong understanding of both theoretical and applied perspectives of emerging machine learning technologies. One of the primary reasons this contribution gained attention was the recipient’s ability to transform complex theoretical ideas into experimentally validated systems with practical relevance.  
 
The project introduced a hybrid computational model capable of reducing training overhead for lightweight classification tasks without sacrificing interpretability or robustness. The literature review was thorough, bridging classical statistical learning methods with next-generation neural computation trends. Evaluation results were systematically structured, and the entire workflow—from data ingestion to final inference—was articulated with clarity and depth. The research community acknowledged the potential of this work as a foundational stepping stone for several subsequent studies that focused on low-resource learning environments, smart automation pipelines, and educational technology tools.  
 
Overall, the 2020 IEEE Early Research Excellence Award highlights innovation, clarity of scientific communication, and strong foundational thinking—qualities that continue to impact the technical community.',
 2, 2020
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'National Coding Showcase Finalist 2020',
 'https://youtu.be/OBD1d048dl4?si=96USz9tk73FBeR5S',
 'BASIS Academic Outreach Unit',
 'https://nsac.basis.org.bd/',
 'Recognized for building a lightweight programming tool for students entering competitive coding. The project simplified problem-solving strategies and incorporated automated testing features.',
 1, 2020, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Creative Computing Award 2020',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_purdue.jpeg',
 'IEEE Excellence Committee',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Awarded for creative problem-solving and presenting research in a way that inspired junior contributors and student communities.',
 4, 2020, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'BASIS Innovation Recognition 2020',
 'https://youtu.be/b4fx6BjWEqk?si=XcWcVMb1B-n4NVVY',
 'BASIS National Student Committee',
 'https://nsac.basis.org.bd/',
 'Honored for contributing to student-driven software innovation challenges during the 2020 national finals.',
 3, 2020, DEFAULT
);


--2021
INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Young Research Contributor 2021',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg',
 'IEEE Leadership Board',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'A detailed research contribution that explored distributed optimization models and multi-layer computational pipelines.',
 2, 2021, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'National AI Prototype Runner-Up 2021',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_show_pice.jpeg',
 'BASIS Innovation Hub',
 'https://nsac.basis.org.bd/',
 'Recognized for a novel AI-based prototype built during a national-level applied intelligence challenge.',
 1, 2021, DEFAULT
);


INSERT INTO public.awards 
VALUES (
 DEFAULT,
 'IEEE Technical Writing Distinction 2021',
 'https://youtu.be/OBD1d048dl4?si=96USz9tk73FBeR5S',
 'IEEE Technical Affairs Unit',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Awarded for exceptional clarity, structure, and scientific accuracy in producing highly technical engineering documentation.',
 3, 2021, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'BASIS Scholar of Computing 2021',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'BASIS Education Division',
 'https://nsac.basis.org.bd/',
 'Awarded for academic performance and consistent contribution to student technology groups.',
 5, 2021, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Algorithmic Excellence Award 2021',
 'https://youtu.be/b4fx6BjWEqk?si=XcWcVMb1B-n4NVVY',
 'IEEE Competitive Coding Council',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Awarded for excellence in national algorithm competitions and technical mentoring.',
 1, 2021, DEFAULT
);


--2024
INSERT INTO public.awards 
VALUES (
 DEFAULT,
 'BASIS National Hackathon Champion 2024',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg',
 'BASIS Youth Tech Forum',
 'https://nsac.basis.org.bd/',
 'This national-level hackathon project introduced a multi-layer digital infrastructure capable of handling real-time, event-driven workflow automation. The architecture was designed around microservices and message-queue pipelines, ensuring high scalability even during peak operational loads.  
 
The judging panel recognized the platform\s exceptional engineering depth, fault tolerance, and clean system design. Intelligent caching strategies, modular data processors, and adaptive rate-control mechanisms made it suitable for government agencies, educational institutions, and logistics companies. The frontend focused on accessibility, with dynamic dashboards and task-dependent visual layers.  
 
Beyond technical achievement, the project displayed a strong grasp of human-centered design, emphasizing clarity, ease-of-use, and operational transparency. The final submission demonstrated a balanced blend of creativity, engineering intuition, and practical problem-solving abilities.',
 1, 2024, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Distinguished Research Contributor 2024',
 'https://youtu.be/OBD1d048dl4?si=96USz9tk73FBeR5S',
 'IEEE Regional Research Council',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Recognized for research publications addressing hybrid computational intelligence models.',
 2, 2024, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'National Software Architecture Award 2024',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_purdue.jpeg',
 'BASIS Engineering Panel',
 'https://nsac.basis.org.bd/',
 'Awarded for a modular enterprise-grade system adopted by multiple organizations.',
 3, 2024, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Global Tech Speaker Recognition 2024',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_show_pice.jpeg',
 'IEEE Event Coordination Board',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Invited to present on advanced computing systems, distributed architectures, and research experience.',
 4, 2024, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'BASIS Outstanding Project Award 2024',
 'https://youtu.be/b4fx6BjWEqk?si=XcWcVMb1B-n4NVVY',
 'BASIS Innovation Lab',
 'https://nsac.basis.org.bd/',
 'Awarded for a large-scale automation project deployed in a real institution.',
 2, 2024, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Graduate Scholarship Award 2024',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'IEEE Scholarship Committee',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Received for academic excellence and research contributions.',
 5, 2024, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Computational Excellence Award 2025',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg',
 'IEEE Computing Standards Board',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Awarded for excellence in computational modeling and distributed optimization.',
 3, 2025, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'BASIS Rising Tech Star 2025',
 'https://youtu.be/OBD1d048dl4?si=96USz9tk73FBeR5S',
 'BASIS Student Affairs Council',
 'https://nsac.basis.org.bd/',
 'Recognized for rapid technical growth and mentoring upcoming developers.',
 1, 2025, DEFAULT
);


INSERT INTO public.awards VALUES
(
 DEFAULT,
 'IEEE Innovation Fellowship Award 2025',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_show_pice.jpeg',
 'IEEE Fellowship Evaluation Board',
 'https://ieeer8.org/category/committee/meetings/2021-march-online/',
 'Granted for proposing next-generation AI workflow optimization methodology.',
 4, 2025, DEFAULT
);



select * from public.awards









-- 3. Award Media Table (for multiple images/videos per award)
CREATE TABLE public.award_media (
  id          BIGSERIAL PRIMARY KEY,
  award_id    BIGINT NOT NULL REFERENCES public.awards(id) ON DELETE CASCADE,
  media_type  TEXT NOT NULL CHECK (media_type IN ('image', 'youtube', 'video')),
  media_url   TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);


-- =============================================
-- SAMPLE DATA (optional - you can modify or remove)
-- =============================================

-- Sample Award 1
INSERT INTO public.awards (title, thumbnail_url, organization_name, organization_url, description, topic_id, year)
VALUES (
  'Best Research Paper Award',
  'https://example.com/award1.jpg',
  'IEEE Bangladesh',
  'https://ieee.org.bd',
  'Received for outstanding research contribution in machine learning.',
  2,
  2024
);

-- Sample Award 2
INSERT INTO public.awards (title, thumbnail_url, organization_name, organization_url, description, topic_id, year)
VALUES (
  'National Programming Contest - 1st Place',
  'https://youtu.be/example123',
  'Bangladesh Open Source Network',
  'https://bdosn.org',
  'First place in national level programming competition.',
  1,
  2023
);

-- Sample Media for Award 1
INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(1, 'image', 'https://example.com/award1_pic1.jpg'),
(1, 'image', 'https://example.com/award1_pic2.jpg'),
(1, 'youtube', 'https://youtu.be/example456');

-- Sample Media for Award 2
INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(2, 'image', 'https://example.com/award2_pic1.jpg');


select * FROM public.award_media

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(1, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(1, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg'),
(1, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz'),
(1, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg');


INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(2, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(2, 'youtube', 'https://www.youtube.com/live/rANa23Pxxo0?si=TxiPqSQiRc1Gu0Qx'),
(2, 'image', 'https://qmkxkqqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(2, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj'),
(2, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg');


INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(3, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(3, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu'),
(3, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(3, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(4, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(4, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz'),
(4, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(4, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg');



INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(5, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(5, 'youtube', 'https://www.youtube.com/live/rANa23Pxxo0?si=TxiPqSQiRc1Gu0Qx'),
(5, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(5, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu'),
(5, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg');




INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(6, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg'),
(6, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(6, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj'),
(6, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg');



INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(7, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz'),
(7, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(7, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(7, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu');



INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(8, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg'),
(8, 'youtube', 'https://www.youtube.com/live/rANa23Pxxo0?si=TxiPqSQiRc1Gu0Qx'),
(8, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(8, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(8, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj');


INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(9, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(9, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu'),
(9, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(9, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg');


INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(10, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(10, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(10, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz'),
(10, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg');



INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(11, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj'),
(11, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(11, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(11, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(12, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(12, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(12, 'youtube', 'https://www.youtube.com/live/rANa23Pxxo0?si=TxiPqSQiRc1Gu0Qx'),
(12, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(12, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz');


INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(13, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg'),
(13, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj'),
(13, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(13, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu');


INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(14, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(14, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(14, 'youtube', 'https://www.youtube.com/live/rANa23Pxxo0?si=TxiPqSQiRc1Gu0Qx'),
(14, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(15, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(15, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz'),
(15, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg'),
(15, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(16, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(16, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj'),
(16, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(16, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(17, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu'),
(17, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg'),
(17, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg'),
(17, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(18, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(18, 'youtube', 'https://www.youtube.com/live/rANa23Pxxo0?si=TxiPqSQiRc1Gu0Qx'),
(18, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(18, 'youtube', 'https://youtu.be/0xes6eOvChk?si=i8NVwU5C6QnYGlWz');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(19, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg'),
(19, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg'),
(19, 'youtube', 'https://youtu.be/DswOV-CwVmc?si=Nmk72nNq7eqTpoKj'),
(19, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_1.jpg');

INSERT INTO public.award_media (award_id, media_type, media_url) VALUES
(20, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_robot.jpeg'),
(20, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/research_4.jpg'),
(20, 'youtube', 'https://youtu.be/o_Ahgu1-zj4?si=3ZiNwqnoEU-jvaHu'),
(20, 'youtube', 'https://www.youtube.com/live/rANa23Pxxo0?si=TxiPqSQiRc1Gu0Qx');





-- =============================================
-- FAHMIDA PROJECTS SECTION TABLES
-- =============================================

-- 1. Main Projects Table (with presented_in_url)
CREATE TABLE public.fahmida_projects (
  id               BIGSERIAL PRIMARY KEY,
  title            TEXT NOT NULL,
  thumbnail_url    TEXT,
  description      TEXT,
  presented_in     TEXT,
  presented_in_url TEXT,
  year             INT,
  keywords     TEXT NOT NULL,
  created_at       TIMESTAMP DEFAULT NOW()
);
select * from public.fahmida_projects;




-- 3. Project Sources Table (GitHub, Live Demo, Docs, etc.)
CREATE TABLE public.fahmida_project_sources (
  id          BIGSERIAL PRIMARY KEY,
  project_id  BIGINT NOT NULL REFERENCES public.fahmida_projects(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('github', 'live_demo', 'documentation', 'download', 'video', 'other')),
  label       TEXT,
  url         TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);


INSERT INTO public.fahmida_projects 
(title, thumbnail_url, description, presented_in, presented_in_url, year, keywords)
VALUES
-- 1
('3D Object Reconstruction from Images',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'Reconstructing 3D mesh models from multiple 2D images using computer vision.',
 'Computer Vision Research',
 'https://www.computer.org/',
 2024,
 '3D Reconstruction, Computer Vision, Machine Learning'),

-- 2
('Autonomous Navigation Robot',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg',
 'A small autonomous robot capable of mapping and obstacle avoidance.',
 'Robotics Lab Project',
 'https://nsac.basis.org.bd/',
 2023,
 'Robotics, SLAM, Path Planning'),

-- 3
('Interactive Room Visualization Tool',
 'https://youtu.be/OBD1d048dl4?si=ARQ0OnpZW55VB70H',
 'A real-time 3D room visualization system using custom rendering engine.',
 'Graphics Assignment',
 'https://www.computer.org/',
 2022,
 '3D Graphics, Rendering, Visualization'),

-- 4
('Health Monitoring Dashboard',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg',
 'A web dashboard for tracking user health metrics like steps and heart rate.',
 'Health Tech Hackathon',
 'https://nsac.basis.org.bd/',
 2024,
 'Dashboard, Health Data, Web App'),

-- 5
('AI-based Resume Ranker',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'ML model that ranks resumes based on job descriptions.',
 'Machine Learning Course Project',
 'https://www.computer.org/',
 2023,
 'NLP, Ranking Model, Machine Learning'),

-- 6
('Handwritten Digit Classifier',
 'https://youtu.be/OBD1d048dl4?si=ARQ0OnpZW55VB70H',
 'A neural-network-based MNIST classifier with visualization.',
 'Deep Learning Lab',
 'https://nsac.basis.org.bd/',
 2024,
 'Neural Network, MNIST, Classification'),

-- 7
('Weather Prediction Dashboard',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg',
 'Real-time weather forecasting using regression models.',
 'ML Research',
 'https://www.computer.org/',
 2023,
 'Weather Forecast, Regression, Python'),

-- 8
('E-commerce Inventory Manager',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'Inventory and stock tracking web application.',
 'Software Engineering Project',
 'https://nsac.basis.org.bd/',
 2024,
 'E-commerce, Inventory, Full Stack'),

-- 9
('Basic Compiler Implementation',
 'https://youtu.be/OBD1d048dl4?si=ARQ0OnpZW55VB70H',
 'A simple compiler for arithmetic expressions with lexical and syntax analysis.',
 'Compiler Design Lab',
 'https://www.computer.org/',
 2022,
 'Compiler, Lexer, Parser'),

-- 10
('Game Physics Simulator',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg',
 'A physics engine supporting gravity, collision, and friction.',
 'Game Development Project',
 'https://nsac.basis.org.bd/',
 2023,
 'Physics Engine, Game Dev, Simulation'),

-- 11
('Chat-based Learning Assistant',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'A chatbot to help students with explanations and study materials.',
 'NLP Research',
 'https://www.computer.org/',
 2024,
 'Chatbot, NLP, Education'),

-- 12
('IoT Smart Home Controller',
 'https://youtu.be/OBD1d048dl4?si=ARQ0OnpZW55VB70H',
 'Control home appliances remotely using IoT sensors.',
 'IoT Lab',
 'https://nsac.basis.org.bd/',
 2023,
 'IoT, Sensors, Automation'),

-- 13
('Mobile Expense Tracker App',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/mir_mehedi.jpg',
 'Track expenses and generate monthly spending summaries.',
 'Mobile App Project',
 'https://www.computer.org/',
 2022,
 'Mobile App, Finance, React Native'),

-- 14
('Neural Style Transfer Demo',
 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/multiple_pic_vid_link/fahmida_with_car.jpeg',
 'Apply artistic painting style to images using CNNs.',
 'Deep Learning Sessional',
 'https://nsac.basis.org.bd/',
 2024,
 'CNN, Style Transfer, Deep Learning'),

-- 15
('Portfolio Website with Admin Panel',
 'https://youtu.be/OBD1d048dl4?si=ARQ0OnpZW55VB70H',
 'A dynamic portfolio website with customizable admin dashboard.',
 'Personal Project',
 'https://www.computer.org/',
 2024,
 'Portfolio, Web Development, Admin Panel');


-- Sources for Projects
INSERT INTO public.fahmida_project_sources (project_id, type, label, url)
VALUES
-- Project 1
(1, 'github', 'Source Code', 'https://github.com/farhan5384/'),
(1, 'documentation', 'Paper Link', 'https://www.researchgate.net/'),
(1, 'video', 'Demo Video', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),
(1, 'other', 'More Info', 'https://nsac.basis.org.bd/'),

-- Project 2
(2, 'live_demo', 'Live Preview', 'https://nsac.basis.org.bd/'),
(2, 'github', 'Code Repository', 'https://github.com/farhan5384/'),
(2, 'documentation', 'Docs', 'https://www.researchgate.net/'),

-- Project 3
(3, 'documentation', 'Research Docs', 'https://www.researchgate.net/'),
(3, 'video', 'Project Video', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),
(3, 'github', 'GitHub Repo', 'https://github.com/farhan5384/'),
(3, 'other', 'Related Link', 'https://nsac.basis.org.bd/'),

-- Project 4
(4, 'github', 'Backend Repo', 'https://github.com/farhan5384/'),
(4, 'documentation', 'System Docs', 'https://www.researchgate.net/'),
(4, 'live_demo', 'Live Demo', 'https://nsac.basis.org.bd/'),

-- Project 5
(5, 'documentation', 'Dataset / Docs', 'https://www.researchgate.net/'),
(5, 'video', 'Working Video', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),
(5, 'other', 'External Link', 'https://nsac.basis.org.bd/'),
(5, 'github', 'GitHub Code', 'https://github.com/farhan5384/'),

-- Project 6
(6, 'live_demo', 'Live Test', 'https://nsac.basis.org.bd/'),
(6, 'documentation', 'Documentation', 'https://www.researchgate.net/'),
(6, 'github', 'Source Code', 'https://github.com/farhan5384/'),

-- Project 7
(7, 'video', 'Demo Clip', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),
(7, 'documentation', 'Model Docs', 'https://www.researchgate.net/'),
(7, 'github', 'Project Repo', 'https://github.com/farhan5384/'),

-- Project 8
(8, 'other', 'Info Page', 'https://nsac.basis.org.bd/'),
(8, 'github', 'Server Repo', 'https://github.com/farhan5384/'),
(8, 'documentation', 'Technical Docs', 'https://www.researchgate.net/'),
(8, 'video', 'Video Demo', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),

-- Project 9
(9, 'github', 'Compiler Code', 'https://github.com/farhan5384/'),
(9, 'documentation', 'Algorithm Docs', 'https://www.researchgate.net/'),
(9, 'other', 'External Reference', 'https://nsac.basis.org.bd/'),

-- Project 10
(10, 'video', 'Physics Demo', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),
(10, 'github', 'Engine Code', 'https://github.com/farhan5384/'),
(10, 'documentation', 'Research Article', 'https://www.researchgate.net/'),

-- Project 11
(11, 'github', 'Chatbot Source Code', 'https://github.com/farhan5384/'),
(11, 'documentation', 'NLP Docs', 'https://www.researchgate.net/'),
(11, 'live_demo', 'Live Chatbot', 'https://nsac.basis.org.bd/'),

-- Project 12
(12, 'other', 'IoT Info Page', 'https://nsac.basis.org.bd/'),
(12, 'github', 'IoT Controller Code', 'https://github.com/farhan5384/'),
(12, 'video', 'Hardware Demo', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),

-- Project 13
(13, 'documentation', 'App Docs', 'https://www.researchgate.net/'),
(13, 'github', 'Project Code', 'https://github.com/farhan5384/'),
(13, 'live_demo', 'Live App', 'https://nsac.basis.org.bd/'),

-- Project 14
(14, 'video', 'Style Transfer Demo', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS'),
(14, 'documentation', 'Deep Learning Docs', 'https://www.researchgate.net/'),
(14, 'github', 'Model Code', 'https://github.com/farhan5384/'),
(14, 'other', 'Extra Resource', 'https://nsac.basis.org.bd/'),

-- Project 15
(15, 'github', 'Portfolio Code', 'https://github.com/farhan5384/'),
(15, 'live_demo', 'Live Portfolio', 'https://nsac.basis.org.bd/'),
(15, 'documentation', 'Tech Documentation', 'https://www.researchgate.net/'),
(15, 'video', 'Preview Video', 'https://youtu.be/OBD1d048dl4?si=cv9qY5deJqk74DxS');

SELECT * FROM public.fahmida_projects;
SELECT * FROM public.fahmida_project_sources;



-- =============================================
-- FAHMIDA BLOG SECTION TABLES
-- =============================================

-- 1. Main Blogs Table
CREATE TABLE public.fahmida_blogs (
  id             BIGSERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  thumbnail_url  TEXT,
  description    TEXT,
  published_date DATE,
  created_at     TIMESTAMP DEFAULT NOW()
);


-- 2. Blog Media Table (multiple images/videos per blog)
CREATE TABLE public.fahmida_blog_media (
  id          BIGSERIAL PRIMARY KEY,
  blog_id     BIGINT NOT NULL REFERENCES public.fahmida_blogs(id) ON DELETE CASCADE,
  media_type  TEXT NOT NULL CHECK (media_type IN ('image', 'youtube', 'video')),
  media_url   TEXT NOT NULL,
  caption     TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);


-- 3. Blog Links Table (external links per blog)
CREATE TABLE public.fahmida_blog_links (
  id          BIGSERIAL PRIMARY KEY,
  blog_id     BIGINT NOT NULL REFERENCES public.fahmida_blogs(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('medium', 'dev_to', 'hashnode', 'linkedin', 'github', 'external', 'other')),
  label       TEXT,
  url         TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);


-- View tables
SELECT * FROM public.fahmida_blogs;
drop table public.fahmida_blogs cascade
SELECT * FROM public.fahmida_blog_media;
drop table public.fahmida_blog_media cascade
SELECT * FROM public.fahmida_blog_links;
drop table public.fahmida_blog_links cascade


-- 10 Blogs


INSERT INTO public.fahmida_blogs (title, thumbnail_url, description, published_date)
VALUES
('Vlog 1', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog.jpeg',
'This is the first blog in the Vlog series. Here we discuss coding tips, best practices, and tutorials to help beginners and advanced developers improve their skills.',
'2026-02-10'),

('Vlog 2', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_2.jpeg',
'In this second Vlog, we focus on design strategies, UI/UX patterns, and creative workflows for building visually appealing applications.',
'2026-02-10'),

('Vlog 3', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_3.jpeg',
'Vlog 3 dives into advanced JavaScript techniques, including asynchronous programming, closures, and event-driven architecture for modern web apps.',
'2026-02-10'),

('Vlog 4', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_4.jpeg',
'This Vlog covers Python development, focusing on data manipulation, scripting, and building small projects to strengthen coding skills.',
'2026-02-10'),

('Vlog 5', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog.jpeg',
'Vlog 5 explores cloud development and deployment. Learn how to host projects, manage databases, and integrate APIs in real-world scenarios.',
'2026-02-10'),

('Vlog 6', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_2.jpeg',
'In this Vlog, we review popular frameworks, libraries, and tools for front-end development, helping you choose the best stack for your next project.',
'2026-02-10'),

('Vlog 7', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_3.jpeg',
'Vlog 7 discusses testing and debugging practices. Learn how to write unit tests, debug effectively, and ensure your applications are reliable.',
'2026-02-10'),

('Vlog 8', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_4.jpeg',
'In Vlog 8, we focus on optimization techniques for web performance, code efficiency, and improving user experience through best practices.',
'2026-02-10'),

('Vlog 9', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog.jpeg',
'Vlog 9 covers version control, Git workflows, and collaborative development tips for managing projects efficiently in teams.',
'2026-02-10'),

('Vlog 10', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_2.jpeg',
'The final Vlog in the series wraps up with career tips, learning resources, and guidance for aspiring developers to grow in the tech industry.',
'2026-02-10');




-- Blog Media
INSERT INTO public.fahmida_blog_media (blog_id, media_type, media_url, caption)
VALUES
-- Blog 1
(1, 'youtube', 'https://youtu.be/262YdUeqNLI?si=2nLHh37Ep7MidzVm', 'Vlog 1 Video 1'),
(1, 'youtube', 'https://youtu.be/0xmpEdbEPpc?si=UKRLUHqrNhQIOz5W', 'Vlog 1 Video 2'),
(1, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog.jpeg', 'Vlog 1 Thumbnail'),

-- Blog 2
(2, 'youtube', 'https://youtu.be/8rGnJrezDys?si=33FAQYMlhKtnXCFq', 'Vlog 2 Video 1'),
(2, 'youtube', 'https://youtu.be/sFrKx15_XEM?si=YBww_3RsCutc8Ebd', 'Vlog 2 Video 2'),
(2, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_2.jpeg', 'Vlog 2 Thumbnail'),

-- Blog 3
(3, 'youtube', 'https://youtu.be/p3BCOzVozYc?si=FzsEzeGR8DNOOi1M', 'Vlog 3 Video 1'),
(3, 'youtube', 'https://youtu.be/NY3yWXWjYjA?si=8BcCtZBgoDnhfWyf', 'Vlog 3 Video 2'),
(3, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_3.jpeg', 'Vlog 3 Thumbnail'),

-- Blog 4
(4, 'youtube', 'https://youtu.be/6y1fy7xeMeM?si=-ivTBO4R-CfuUmt3', 'Vlog 4 Video 1'),
(4, 'youtube', 'https://youtu.be/sdio9USEjZ4?si=aT9T5YgoC0y65uuM', 'Vlog 4 Video 2'),
(4, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_4.jpeg', 'Vlog 4 Thumbnail'),

-- Blog 5
(5, 'youtube', 'https://youtu.be/262YdUeqNLI?si=2nLHh37Ep7MidzVm', 'Vlog 5 Video 1'),
(5, 'youtube', 'https://youtu.be/0xmpEdbEPpc?si=UKRLUHqrNhQIOz5W', 'Vlog 5 Video 2'),
(5, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog.jpeg', 'Vlog 5 Thumbnail'),

-- Blog 6
(6, 'youtube', 'https://youtu.be/8rGnJrezDys?si=33FAQYMlhKtnXCFq', 'Vlog 6 Video 1'),
(6, 'youtube', 'https://youtu.be/sFrKx15_XEM?si=YBww_3RsCutc8Ebd', 'Vlog 6 Video 2'),
(6, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_2.jpeg', 'Vlog 6 Thumbnail'),

-- Blog 7
(7, 'youtube', 'https://youtu.be/p3BCOzVozYc?si=FzsEzeGR8DNOOi1M', 'Vlog 7 Video 1'),
(7, 'youtube', 'https://youtu.be/NY3yWXWjYjA?si=8BcCtZBgoDnhfWyf', 'Vlog 7 Video 2'),
(7, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_3.jpeg', 'Vlog 7 Thumbnail'),

-- Blog 8
(8, 'youtube', 'https://youtu.be/6y1fy7xeMeM?si=-ivTBO4R-CfuUmt3', 'Vlog 8 Video 1'),
(8, 'youtube', 'https://youtu.be/sdio9USEjZ4?si=aT9T5YgoC0y65uuM', 'Vlog 8 Video 2'),
(8, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_4.jpeg', 'Vlog 8 Thumbnail'),

-- Blog 9
(9, 'youtube', 'https://youtu.be/262YdUeqNLI?si=2nLHh37Ep7MidzVm', 'Vlog 9 Video 1'),
(9, 'youtube', 'https://youtu.be/0xmpEdbEPpc?si=UKRLUHqrNhQIOz5W', 'Vlog 9 Video 2'),
(9, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog.jpeg', 'Vlog 9 Thumbnail'),

-- Blog 10
(10, 'youtube', 'https://youtu.be/8rGnJrezDys?si=33FAQYMlhKtnXCFq', 'Vlog 10 Video 1'),
(10, 'youtube', 'https://youtu.be/sFrKx15_XEM?si=YBww_3RsCutc8Ebd', 'Vlog 10 Video 2'),
(10, 'image', 'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Blog/fahmida_blog_2.jpeg', 'Vlog 10 Thumbnail');



-- Blog Links
-- Blog 1
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(1, 'github', 'GitHub Repo', 'https://github.com/iOfficeAI/AionUi'),
(1, 'external', 'Thailand Info', 'https://en.wikipedia.org/wiki/Thailand'),
(1, 'external', 'ResearchGate', 'https://www.researchgate.net/');

-- Blog 2
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(2, 'github', 'GitHub Profile', 'https://github.com/farhan5384'),
(2, 'linkedin', 'LinkedIn Profile', 'https://bd.linkedin.com/in/fahmida-sultana-naznin'),
(2, 'external', 'ResearchGate Profile', 'https://www.researchgate.net/profile/Mst-Fahmida-Naznin');

-- Blog 3
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(3, 'github', 'DakPakhi Repo', 'https://github.com/MdSium003/DakPakhi'),
(3, 'external', 'US Info', 'https://en.wikipedia.org/wiki/Us'),
(3, 'external', 'Malaysia Info', 'https://en.wikipedia.org/wiki/Malyasia');

-- Blog 4
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(4, 'external', 'Saudi Info', 'https://en.wikipedia.org/wiki/Saudi'),
(4, 'external', 'Qatar Info', 'https://en.wikipedia.org/wiki/Qatar'),
(4, 'external', 'ResearchGate', 'https://www.researchgate.net/');

-- Blog 5
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(5, 'github', 'GitHub Repo', 'https://github.com/iOfficeAI/AionUi'),
(5, 'external', 'Thailand Info', 'https://en.wikipedia.org/wiki/Thailand'),
(5, 'external', 'ResearchGate', 'https://www.researchgate.net/');

-- Blog 6
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(6, 'github', 'GitHub Profile', 'https://github.com/farhan5384'),
(6, 'linkedin', 'LinkedIn Profile', 'https://bd.linkedin.com/in/fahmida-sultana-naznin'),
(6, 'external', 'ResearchGate Profile', 'https://www.researchgate.net/profile/Mst-Fahmida-Naznin');

-- Blog 7
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(7, 'github', 'DakPakhi Repo', 'https://github.com/MdSium003/DakPakhi'),
(7, 'external', 'US Info', 'https://en.wikipedia.org/wiki/Us'),
(7, 'external', 'Malaysia Info', 'https://en.wikipedia.org/wiki/Malyasia');

-- Blog 8
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(8, 'external', 'Saudi Info', 'https://en.wikipedia.org/wiki/Saudi'),
(8, 'external', 'Qatar Info', 'https://en.wikipedia.org/wiki/Qatar'),
(8, 'external', 'ResearchGate', 'https://www.researchgate.net/');

-- Blog 9
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(9, 'github', 'GitHub Repo', 'https://github.com/iOfficeAI/AionUi'),
(9, 'external', 'Thailand Info', 'https://en.wikipedia.org/wiki/Thailand'),
(9, 'external', 'ResearchGate', 'https://www.researchgate.net/');

-- Blog 10
INSERT INTO public.fahmida_blog_links (blog_id, type, label, url)
VALUES
(10, 'github', 'GitHub Profile', 'https://github.com/farhan5384'),
(10, 'linkedin', 'LinkedIn Profile', 'https://bd.linkedin.com/in/fahmida-sultana-naznin'),
(10, 'external', 'ResearchGate Profile', 'https://www.researchgate.net/profile/Mst-Fahmida-Naznin');




-- Education

CREATE TABLE public.education_history (
    id              BIGSERIAL PRIMARY KEY,
    institution     TEXT NOT NULL,           -- School / College / University name
    degree_level    TEXT NOT NULL CHECK (degree_level IN ('School', 'College', 'University', 'MS', 'PhD', 'Postdoc')),  
    field_of_study  TEXT,                    -- Optional: e.g., Mechanical Engineering
    start_year      INT,                     -- e.g., 2012
    end_year        INT,                     -- e.g., 2016
    grade           TEXT,                    -- Optional: GPA, Class, or Grade
    activities      TEXT,                    -- Optional: clubs, societies, awards
    skills          TEXT,                    -- Optional: skills learned
    external_link   TEXT,                    -- Optional: website or profile link
    created_at      TIMESTAMP DEFAULT NOW()
);




ALTER TABLE public.education_history 
ADD COLUMN logo_url TEXT;



-- প্রথমে টেবিলে logo_url কলাম যোগ করো:
ALTER TABLE public.education_history 
ADD COLUMN logo_url TEXT;

-- তারপর ডেটা ইনসার্ট করো:
INSERT INTO public.education_history (
    institution,
    degree_level,
    field_of_study,
    start_year,
    end_year,
    grade,
    activities,
    skills,
    external_link,
    logo_url  -- নতুন ফিল্ড
) VALUES
    -- School
    (
        'Tejgaon Government Girls High School',
        'School',
        'Science',
        2010,
        2018,
        '5.00',
        'School Magazine Editor, Science Club Member',
        'Mathematics, English, Science Projects',
        'https://bn.wikipedia.org/wiki/%E0%A6%A4%E0%A7%87%E0%A6%9C%E0%A6%97%E0%A6%BE%E0%A6%81%E0%A6%93_%E0%A6%B8%E0%A6%B0%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF_%E0%A6%AC%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%95%E0%A6%BE_%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A_%E0%A6%AC%E0%A6%BF%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Education/school.jpeg'
    ),
    -- College
    (
        'Holy Cross College, Dhaka',
        'College',
        'Science',
        2018,
        2020,
        '5.00',
        'Debate Club, Cultural Fest Organizer',
        'Physics, Chemistry, Biology Lab Skills',
        'https://en.wikipedia.org/wiki/Holy_Cross_College,_Dhaka',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Education/college.jpeg'
    ),
    -- University (BUET)
    (
        'Bangladesh University of Engineering and Technology',
        'University',
        'Computer Science and Engineering',
        2021,
        2026,
        '3.70',
        'BUET Computer Club, Robotics Society',
        'Programming, Data Structures, Web Development',
        'https://buet.ac.bd',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Education/undergrad.jpeg'
    ),
    -- PhD
    (
        'Missouri State University',
        'PhD',
        'Computer Science',
        2026,
        NULL,
        NULL,
        'Research Assistant, AI Lab',
        'Machine Learning, Deep Learning',
        'https://www.missouristate.edu',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Education/Phd.jpeg'
    );




 --job 

    CREATE TABLE public.experience_history (
    id              BIGSERIAL PRIMARY KEY,
    job_title       TEXT NOT NULL,           -- যেমন: Marketing & Analytics Consultant
    company         TEXT NOT NULL,           -- যেমন: JayOh LLC
    location        TEXT,                    -- যেমন: Greater New York City Area
    start_date      DATE NOT NULL,           -- যেমন: 2015-10-01
    end_date        DATE,                    -- NULL হলে "Present" দেখাবে
    employment_type TEXT CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')),
    description     TEXT NOT NULL,           -- Bullet Points গুলো (প্রতিটি নতুন লাইনে *)
    skills_used     TEXT,                    -- যেমন: Marketing Automation, SEO, CRM
    external_link   TEXT,                    -- Company Website/LinkedIn
    logo_url        TEXT,                    -- Company Logo URL (Supabase Storage থেকে)
    created_at      TIMESTAMP DEFAULT NOW()
);





INSERT INTO public.experience_history (
    job_title,
    company,
    location,
    start_date,
    end_date,
    employment_type,
    description,
    skills_used,
    external_link,
    logo_url
) VALUES
    -- Row 1: Banglalink
    (
        'Software Engineer',
        'Banglalink',
        'Dhaka, Bangladesh',
        '2021-01-15',
        '2023-06-30',
        'Full-time',
        'Developed and maintained scalable backend services for telecom systems.
* Optimized database queries reducing response time by 40%.
* Implemented REST APIs for customer management system.
* Collaborated with cross-functional teams to deliver features on schedule.
* Participated in code reviews and mentored junior developers.',
        'Java, Spring Boot, PostgreSQL, Docker, REST APIs, Microservices',
        'https://banglalink.net/en',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Banglalink.jpeg'
    ),
    -- Row 2: EcoSentinels
    (
        'Machine Learning Engineer',
        'EcoSentinels',
        'Remote (USA Based)',
        '2020-03-01',
        '2021-12-31',
        'Contract',
        'Built ML models for environmental monitoring and prediction systems.
* Developed computer vision models for satellite image analysis.
* Created real-time data processing pipelines for sensor networks.
* Published research paper on environmental AI applications.
* Reduced false positive rates by 35% in detection algorithms.',
        'Python, TensorFlow, OpenCV, PyTorch, Computer Vision, Data Analysis',
        'https://ecosentinelsbd.org/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/ecoSentinels.jpeg'
    ),
    -- Row 3: OrangeCorner
    (
        'Full Stack Developer',
        'OrangeCorner',
        'Amsterdam, Netherlands',
        '2018-07-01',
        '2020-02-28',
        'Full-time',
        'Led development of e-commerce platform with 50,000+ monthly users.
* Implemented responsive frontend using React and TypeScript.
* Built secure payment gateway integration.
* Optimized website performance achieving 95+ Lighthouse score.
* Managed AWS infrastructure and CI/CD pipelines.',
        'React, Node.js, TypeScript, AWS, MongoDB, CI/CD',
        'https://www.orangecorners.com/country/bangladesh/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/orangeCorner.jpeg'
    ),
    -- Row 4: Current Job (PhD Researcher)
    (
        'AI Research Scientist',
        'Tech Research Institute',
        'Silicon Valley, CA',
        '2023-07-01',
        NULL, -- Present
        'Full-time',
        'Conducting cutting-edge research in Artificial Intelligence and Neural Networks.
* Publishing papers in top-tier AI conferences (NeurIPS, ICML).
* Developing novel algorithms for few-shot learning.
* Supervising PhD and Masters students.
* Collaborating with industry partners on AI applications.',
        'Deep Learning, PyTorch, Research, Paper Writing, Neural Networks',
        'https://www.missouristate.edu/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Phd.jpeg'
    );   





--Volunteer
CREATE TABLE public.volunteer_history (
    id              BIGSERIAL PRIMARY KEY,
    role            TEXT NOT NULL,           -- যেমন: Wish Granter, Musician
    organization    TEXT NOT NULL,           -- যেমন: Make-A-Wish America
    start_date      DATE NOT NULL,           -- যেমন: 2010-09-01
    end_date        DATE,                    -- NULL হলে "Present" দেখাবে
    duration        TEXT,                    -- যেমন: 3 yrs 10 mos (অপশনাল)
    category        TEXT,                    -- যেমন: Children, Health, Education
    description     TEXT NOT NULL,           -- বিস্তারিত বর্ণনা (বুলেট পয়েন্ট সহ)
    responsibilities TEXT,                   -- দায়িত্বগুলো (বুলেট পয়েন্ট)
    skills_gained   TEXT,                    -- শেখা স্কিলস
    external_link   TEXT,                    -- Organization Website
    logo_url        TEXT,                    -- Organization Logo URL
    created_at      TIMESTAMP DEFAULT NOW()
);




INSERT INTO public.volunteer_history (
    role,
    organization,
    start_date,
    end_date,
    duration,
    category,
    description,
    responsibilities,
    skills_gained,
    external_link,
    logo_url
) VALUES
    -- 1. Wish Granter
    (
        'Wish Granter',
        'Make-A-Wish Foundation',
        '2010-09-01',
        '2014-06-30',
        '3 yrs 10 mos',
        'Children & Community',
        'Granted wishes to children with critical illnesses, bringing joy and hope to their lives.',
        'Met with wish children and their families to understand their heartfelt wishes.
* Planned and organized personalized wish-granting events and celebrations.
* Coordinated with volunteers and local businesses for logistics and donations.
* Provided emotional support and created lasting, positive memories for families.',
        'Empathy & Active Listening, Event Planning, Family Liaison, Fundraising Coordination',
        'https://www.missouristate.edu/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Banglalink.jpeg'
    ),
    -- 2. Community Musician
    (
        'Volunteer Musician',
        'Harmony for Health',
        '2012-09-15',
        '2014-06-15',
        '1 yr 10 mos',
        'Health & Wellness',
        'Used music as therapy to uplift spirits and provide companionship to elderly and hospital patients.',
        'Performed weekly guitar and vocal sessions at local nursing homes and hospitals.
* Engaged with residents/patients post-performance, taking song requests and chatting.
* Adapted music selection to suit audience preferences and create a comforting atmosphere.
* Collaborated with activity coordinators to integrate music into therapeutic programs.',
        'Musical Performance, Patient Interaction, Therapeutic Communication, Adaptability',
        'https://www.missouristate.edu/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/ecoSentinles.jpeg'
    ),
    -- 3. Youth STEM Mentor
    (
        'STEM Mentor & Tutor',
        'Code for the Future',
        '2018-03-01',
        '2020-12-01',
        '2 yrs 9 mos',
        'Education',
        'Mentored underprivileged high school students in computer science and robotics.',
        'Conducted weekly after-school workshops on programming basics (Python, Scratch).
* Guided student teams in building simple robots for a national junior robotics fair.
* Provided one-on-one academic tutoring and college application guidance.
* Developed engaging curriculum materials and project-based learning activities.',
        'Programming Instruction, Mentoring, Curriculum Development, Project Management',
        'https://www.missouristate.edu/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/orangeCorner.jpeg'
    ),
    -- 4. Environmental Campaign Lead
    (
        'Beach Cleanup Campaign Lead',
        'Green Shores Initiative',
        '2021-04-10',
        '2023-08-20',
        '2 yrs 5 mos',
        'Environment',
        'Led community efforts to clean and protect local coastal ecosystems.',
        'Organized monthly beach cleanup drives, recruiting and managing 50+ volunteers.
* Partnered with municipal authorities for waste disposal and recycling.
* Conducted educational sessions on marine pollution for schools and community groups.
* Managed social media campaigns to raise awareness and document impact.',
        'Volunteer Management, Community Outreach, Environmental Education, Public Speaking',
        'https://www.missouristate.edu/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Phd.jpeg'
    ),
    -- 5. Crisis Hotline Responder
    (
        'Crisis Support Responder',
        'HopeLine Network',
        '2019-11-01',
        '2022-05-01',
        '2 yrs 6 mos',
        'Mental Health',
        'Provided confidential, non-judgmental listening and support to individuals in crisis.',
        'Completed intensive training in active listening, de-escalation, and suicide prevention.
* Volunteered on 4-hour weekly shifts, handling sensitive calls with empathy.
* Referred callers to appropriate professional resources and long-term support services.
* Participated in peer support and debriefing sessions for volunteer well-being.',
        'Crisis Intervention, Active Listening, Emotional Intelligence, Resource Navigation',
        'https://www.missouristate.edu/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/Banglalink.jpeg'
    ),
    -- 6. Food Bank Coordinator
    (
        'Weekend Distribution Coordinator',
        'Neighborhood Food Bank',
        '2020-07-01',
        NULL, -- Present
        '5+ yrs (Present)',
        'Poverty Alleviation',
        'Helps combat food insecurity by managing weekly food distribution to families in need.',
        'Oversees weekend food pantry operations, from inventory to client service.
* Trains and schedules a team of 20+ weekly volunteers.
* Builds relationships with local grocery stores and farms for food sourcing.
* Ensures a dignified, efficient, and safe experience for all clients and volunteers.',
        'Operations Management, Logistics, Team Leadership, Community Relations',
        'https://www.missouristate.edu/',
        'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/JOB/ecoSentinles.jpeg'
    );





       --skills

    CREATE TABLE public.simple_languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,      -- Python, MATLAB ইত্যাদি
    proficiency INTEGER NOT NULL,    -- 90, 80, 60 ইত্যাদি
    display_order INTEGER DEFAULT 0  -- ফ্রন্টএন্ডে সাজানোর জন্য
);


CREATE TABLE public.simple_frameworks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,      -- PyTorch, Django ইত্যাদি
    category VARCHAR(50),            -- ML, Web, Graphics ইত্যাদি
    display_order INTEGER DEFAULT 0
);


CREATE TABLE public.simple_tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,      -- Unity, Blender ইত্যাদি
    tool_type VARCHAR(50),           -- Game Engine, 3D Modeling ইত্যাদি
    display_order INTEGER DEFAULT 0
);



INSERT INTO public.simple_languages (name, proficiency, display_order) VALUES
('Python', 90, 1),
('MATLAB', 80, 2),
('C#', 90, 3),
('C', 80, 4),
('C++', 80, 5),
('Java', 80, 6),
('Shell', 60, 7);


INSERT INTO public.simple_frameworks (name, category, display_order) VALUES
('PyTorch', 'Machine Learning', 1),
('PyTorch3D', '3D Vision', 2),
('Geomstat', 'Statistics', 3),
('Keras', 'Deep Learning', 4),
('TensorFlow', 'ML Framework', 5),
('Three.js', 'Web 3D', 6),
('AR.js', 'Augmented Reality', 7),
('OpenCV', 'Computer Vision', 8),
('OpenGL', 'Graphics', 9),
('Django', 'Web Framework', 10),
('NuGet', 'Package Manager', 11);


INSERT INTO public.simple_tools (name, tool_type, display_order) VALUES
('Unity', 'Game Engine', 1),
('Blender', '3D Modeling', 2),
('Vuforia', 'AR Tool', 3),
('Android Studio', 'IDE', 4),
('Firebase', 'Backend Service', 5),
('Arduino', 'Embedded', 6),
('Google Chrome Engine', 'Browser Engine', 7);





CREATE TABLE public.upcycling_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,      -- প্রজেক্টের নাম (যেমন: LAMPSHADE)
    description TEXT,                  -- কী কী জিনিস ব্যবহার করছেন (যেমন: cardboard, old ruler)
    image_url TEXT NOT NULL,           -- প্রজেক্টের ছবির লিঙ্ক
    instagram_link TEXT,               -- ওই প্রজেক্টের যদি কোনো নির্দিষ্ট ইন্সটাগ্রাম পোস্ট থাকে (অপশনাল)
    display_order INTEGER DEFAULT 0,   -- ফ্রন্টএন্ডে সাজানোর জন্য
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);





INSERT INTO public.upcycling_projects (
    title, 
    description, 
    image_url, 
    instagram_link, 
    display_order
) VALUES
(
    'Geometric Lamp Shade',
    'Made from recycled cardboard and old wooden rulers. The geometric pattern creates beautiful light patterns.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_1.jpeg',
    'https://instagram.com/p/upcycle_lamp',
    1
),
(
    'Modern Plant Hangers',
    'Created using discarded plastic bottles and old ropes. Each hanger has unique color patterns from the bottle designs.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_2.jpeg',
    'https://instagram.com/p/plant_hangers',
    2
),
(
    'Upcycled Denim Bag',
    'Made from 4 pairs of old jeans. Features multiple pockets and reinforced stitching for durability.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_3.jpeg',
    'https://instagram.com/p/denim_bag_upcycle',
    3
),
(
    'Bottle Cap Wall Art',
    'Collection of 500+ bottle caps arranged in a colorful mosaic pattern. Mounted on recycled wood board.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_4.jpeg',
    'https://instagram.com/p/bottlecap_art',
    4
),
(
    'Sustainable Furniture Research',
    'Research project exploring the use of recycled materials in modern furniture design. Focus on structural integrity.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/research_1.jpg',
    'https://instagram.com/p/furniture_research',
    5
),
(
    'Material Innovation Study',
    'Comparative analysis of different recycled materials for upcycling projects. Testing durability and aesthetics.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/research_2.jpg',
    'https://instagram.com/p/material_study',
    6
),
(
    'Vintage Book Shelves',
    'Old wooden crates transformed into rustic bookshelves. Sanded and treated with eco-friendly sealant.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_1.jpeg',
    'https://instagram.com/p/book_shelves',
    7
),
(
    'Bicycle Parts Clock',
    'Clock made from recycled bicycle chain, gears, and wheel. Functional timepiece with industrial aesthetic.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_2.jpeg',
    'https://instagram.com/p/bike_clock',
    8
),
(
    'Pallet Wood Coffee Table',
    'Coffee table constructed from reclaimed shipping pallets. Features built-in storage compartment.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_3.jpeg',
    'https://instagram.com/p/pallet_table',
    9
),
(
    'Glass Jar Herb Garden',
    'Vertical herb garden using recycled glass jars and old ladder. Self-watering system with recycled bottles.',
    'https://qmkxkqxbhyxkqqyfshex.supabase.co/storage/v1/object/public/Up_Cycling/up_4.jpeg',
    'https://instagram.com/p/herb_garden',
    10
);