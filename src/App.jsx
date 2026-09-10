import React, { lazy, Suspense } from 'react';
import Layout from '../components/shared/Layout';
import ScrollToTop from '../components/shared/ScrollToTop';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Route-based code splitting for ultra-fast initial bundle
const HomePage = lazy(() => import('../pages/Homepage'));
const CareerPage = lazy(() => import('../pages/CareerPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ResearchPage = lazy(() => import('../pages/ResearchPage'));
const AwardsPage = lazy(() => import('../pages/AwardsPage'));
const SkillsPage = lazy(() => import('../pages/SkillsPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));

const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg, #1E1B18)',
    color: 'var(--color-accent, #B1CC74)'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '2.5px solid rgba(177, 204, 116, 0.15)',
      borderTopColor: '#B1CC74',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite'
    }} />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Homepage has its own hero-style nav/footer */}
          <Route path='/' element={<HomePage/>}/>
          
          {/* All other pages use the shared Layout */}
          <Route path='/career' element={<Layout><CareerPage/></Layout>}/>
          <Route path='/projects' element={<Layout><ProjectsPage/></Layout>}/>
          <Route path='/research' element={<Layout><ResearchPage/></Layout>}/>
          <Route path='/awards' element={<Layout><AwardsPage/></Layout>}/>
          <Route path='/skills' element={<Layout><SkillsPage/></Layout>}/>
          <Route path='/blog' element={<Layout><BlogPage/></Layout>}/>

          {/* Redirect old routes to unified /career */}
          <Route path='/education' element={<Navigate to="/career" replace />}/>
          <Route path='/experience' element={<Navigate to="/career" replace />}/>
          <Route path='/volunteer' element={<Navigate to="/career" replace />}/>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
