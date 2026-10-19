import React from 'react';
import ScrollReveal from '../shared/ScrollReveal';
import StaggerReveal from '../shared/StaggerReveal';

const researchInterests = [
  {
    title: 'AI in Healthcare',
    topics: 'Multimodal Clinical AI, Clinical Decision Support Systems, Medical Diagnosis and Predictive Analytics, Clinical Reasoning and Multi-Agent Systems, ICU Mortality Prediction, AI-Assisted Healthcare',
  },
  {
    title: 'Computer Vision',
    topics: 'Medical Image Segmentation, Medical Image Analysis, Vision Transformers, Diffusion-Based Vision Models, Video Object Localization, Anatomical and Relational Reasoning, Visual Attention and Representation Learning',
  },
  {
    title: 'Natural Language Processing (NLP)',
    topics: 'Clinical NLP, Medical Language Models, Radiology Report Summarization, Medical Text Generation, Bengali NLP and Low-Resource Languages, Bilingual Text Processing, Context-Aware Transfer Learning, Vision-Language Models',
  },
  {
    title: 'Explainable & Trustworthy AI',
    topics: 'Explainable Artificial Intelligence (XAI), Interpretable Machine Learning, Trustworthy and Reliable AI, Conflict-Aware AI Reasoning, Model Robustness, Transparent Clinical Decision-Making',
  },
  {
    title: 'Computational Biology',
    topics: 'AI for DNA Data Storage, Biological Sequence Modeling, Generative Models for DNA Sequences, Transformer-Based Sequence Modeling, Probabilistic Generative Modeling, Computational Genomics',
  },
];

const collaborations = [
  {
    institution: 'University of Illinois Urbana-Champaign',
    name: 'Dr. Sharifa Sultana',
    url: 'https://scholar.google.com/scholar?q=Sharifa+Sultana+University+of+Illinois+Urbana-Champaign',
    work: 'Analysis of political bias in LLM-generated Bengali news summaries and headlines, focusing on article-level effects, differences across language models, and systematic political leanings using human-annotated outputs.',
  },
  {
    institution: 'National University of Singapore (NUS)',
    name: 'Dr. Mohammad Neamul Kabir',
    url: 'https://scholar.google.com/scholar?q=Mohammad+Neamul+Kabir',
    work: 'ContiFuse-MM: Continuous-time multimodal learning for ICU mortality prediction, integrating neural ODE-based temporal modeling of irregular electronic health records with attention-based chest X-ray representations, modality dropout, and Shapley-based interpretability.',
  },
  {
    institution: 'Vanderbilt University',
    name: 'Dr. Ruogu Fang',
    url: 'https://scholar.google.com/scholar?q=Ruogu+Fang+Vanderbilt+University',
    work: 'Whose Clock? Equity-Aware Temporal Alignment for Alzheimer\'s Disease Progression: Investigating demographic disparities in learned disease-time representations and fairness-aware temporal alignment in longitudinal multimodal disease progression models.',
  },
  {
    institution: 'The University of Cambridge, University of Oxford, The University of Queensland, and Charles Sturt University',
    name: 'Dr. Mohammad Ali Moni',
    url: 'https://scholar.google.com/scholar?q=Mohammad+Ali+Moni',
    work: 'Anatomically consistent 3D brain tumor segmentation, relational anatomical reasoning, diffusion-driven feature fusion, and hybrid diffusion-transformer architectures for medical image segmentation.',
  },
  {
    institution: 'Curtin University',
    name: 'Dr. Rakib Hasan',
    url: 'https://scholar.google.com/scholar?q=Rakib+Hasan+Curtin+University',
    work: 'Context-driven sequential transfer learning for radiology report summarization and selective visual attention for multimodal radiology understanding, focusing on context-aware text generation and clinically relevant visual information.',
  },
];

const HomeResearchProfile = () => (
  <div className="home-research-profile">
    <section className="home-section home-research-interests" aria-labelledby="research-interests-title">
      <div className="home-section-container">
        <ScrollReveal>
          <div className="home-section-header">
            <h2 className="home-section-title" id="research-interests-title">Research Interests</h2>
            <p className="home-section-subtitle">
              My research focuses on developing intelligent, reliable, and human-centered AI systems to address real-world challenges across healthcare, vision, language, and biological sciences, with particular interests in multimodal learning, generative AI, and explainable machine learning.
            </p>
          </div>
        </ScrollReveal>
        <StaggerReveal className="research-interest-grid" staggerDelay={0.09}>
          {researchInterests.map((interest, index) => (
            <article className="research-interest-card" key={interest.title}>
              <span className="research-interest-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{interest.title}</h3>
                <p>{interest.topics}</p>
              </div>
            </article>
          ))}
        </StaggerReveal>
      </div>
    </section>

    <section className="home-section home-international-collaborations" aria-labelledby="international-collaborations-title">
      <div className="home-section-container">
        <ScrollReveal>
          <div className="home-section-header">
            <h2 className="home-section-title" id="international-collaborations-title">International Collaborations</h2>
            <p className="home-section-subtitle">
              Collaborative research with international scholars across clinical AI, medical imaging, language technologies, and computational biology.
            </p>
          </div>
        </ScrollReveal>
        <StaggerReveal className="collaboration-list" staggerDelay={0.08}>
          {collaborations.map((collaboration) => (
            <article className="collaboration-card" key={collaboration.institution}>
              <div className="collaboration-card-heading">
                <h3>{collaboration.institution}</h3>
                <a href={collaboration.url} target="_blank" rel="noopener noreferrer">
                  {collaboration.name}
                </a>
              </div>
              <p>{collaboration.work}</p>
            </article>
          ))}
        </StaggerReveal>
      </div>
    </section>
  </div>
);

export default React.memo(HomeResearchProfile);
