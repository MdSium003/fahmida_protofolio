import HomePage from '../pages/Homepage'
import ResearchPage from '../pages/ResearchPage'
import AwardsPage from '../pages/AwardsPage'
import ProjectsPage from '../pages/ProjectsPage'
import BlogPage from '../pages/BlogPage'
import CareerPage from '../pages/CareerPage'
import SkillsPage from '../pages/SkillsPage'
import Layout from '../components/shared/Layout'
import ScrollToTop from '../components/shared/ScrollToTop'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ScrollToTop />
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
    </Router>
  )
}

export default App
