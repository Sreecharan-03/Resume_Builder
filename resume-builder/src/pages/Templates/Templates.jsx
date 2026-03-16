import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Eye,
  Sparkles,
  Layout
} from 'lucide-react';
import { templates, filters } from '../../templates';
import { useResume } from '../../context/ResumeContext';
import { ResumeTemplate } from '../../templates/ResumeTemplates';
import './Templates.css';

// Default sample data for template preview when no user data exists
const defaultSampleData = {
  personal: {
    fullName: 'John Anderson',
    title: 'Senior Software Engineer',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnanderson',
    github: 'github.com/johnanderson',
    summary: 'Passionate software engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies.'
  },
  experience: [
    {
      position: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: 'Leading development of microservices architecture',
      highlights: ['Led team of 5 developers', 'Reduced load time by 40%']
    },
    {
      position: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      description: 'Full-stack development for e-commerce platform'
    }
  ],
  education: [
    {
      degree: 'M.S. Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2016',
      endDate: '2018',
      gpa: '3.9'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'TypeScript'],
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Built a scalable marketplace serving 100k+ users',
      technologies: 'React, Node.js, MongoDB'
    }
  ]
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function Templates() {
  const navigate = useNavigate();
  const { resumeData: contextResumeData, setSelectedTemplate: setContextTemplate } = useResume();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Transform context data to template format
  const transformResumeData = (data) => {
    if (!data || !data.personal?.firstName) return defaultSampleData;
    
    const personal = data.personal || {};
    const fullName = `${personal.firstName || ''} ${personal.lastName || ''}`.trim();
    
    return {
      personal: {
        fullName,
        title: personal.title || '',
        email: personal.email || '',
        phone: personal.phone || '',
        location: personal.location || '',
        linkedin: data.codingProfiles?.linkedin || '',
        github: data.codingProfiles?.github || '',
        summary: personal.summary || ''
      },
      experience: (data.experience || []).map(exp => ({
        position: exp.position || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.current ? 'Present' : (exp.endDate || ''),
        description: exp.description || '',
        highlights: exp.description ? exp.description.split('\n').filter(l => l.trim()) : []
      })).filter(exp => exp.company || exp.position),
      education: (data.education || []).map(edu => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.current ? 'Present' : (edu.endDate || ''),
        gpa: edu.gpa || ''
      })).filter(edu => edu.institution || edu.degree),
      skills: data.skills || [],
      projects: (data.projects || []).map(proj => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || ''
      })).filter(p => p.name)
    };
  };

  // Get resume data for preview - use user's data if available, otherwise use sample
  const previewData = transformResumeData(contextResumeData);
  const hasUserData = contextResumeData?.personal?.firstName;

  const filteredTemplates = templates.filter(template => 
    activeFilter === 'all' || template.category === activeFilter
  );

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    setContextTemplate(template.id); // Save to context
    localStorage.setItem('selectedTemplate', template.id);
  };

  const handlePreview = () => {
    if (selectedTemplate) {
      navigate('/preview', { state: { templateId: selectedTemplate } });
    }
  };

  // Real template preview component using actual resume templates
  const TemplatePreview = ({ templateId }) => (
    <div className="template-preview-wrapper">
      <div className="template-preview-scale">
        <ResumeTemplate templateId={templateId} data={previewData} />
      </div>
    </div>
  );

  return (
    <div className="templates-container">
      {/* Background */}
      <div className="templates-background">
        <div className="templates-blob templates-blob-1"></div>
        <div className="templates-blob templates-blob-2"></div>
      </div>

      {/* Header */}
      <header className="templates-header">
        <Link to="/builder" className="templates-logo">
          <div className="templates-logo-icon">
            <FileText size={20} />
          </div>
          <span className="templates-logo-text">ResumeAI</span>
        </Link>

        <div className="templates-header-actions">
          <Link to="/dashboard">
            <button className="action-btn secondary">
              <Layout size={18} />
              Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="templates-main">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Page Header */}
          <motion.div variants={fadeInUp} className="page-header">
            <h1 className="page-title">
              Choose Your <span className="gradient-text">Template</span>
            </h1>
            <p className="page-subtitle">
              Select a professional template that best represents your style and industry
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div variants={fadeInUp} className="templates-filters">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Templates Grid */}
          <motion.div variants={staggerContainer} className="templates-grid">
            {filteredTemplates.map(template => (
              <motion.div
                key={template.id}
                variants={fadeInUp}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => handleSelectTemplate(template)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selected Check */}
                {selectedTemplate === template.id && (
                  <motion.div
                    className="selected-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Check size={18} />
                  </motion.div>
                )}

                {/* Template Preview */}
                <TemplatePreview templateId={template.id} />

                {/* Overlay */}
                <div className="template-overlay">
                  <button className="template-overlay-btn">
                    <Eye size={18} />
                    Preview
                  </button>
                </div>

                {/* Template Info */}
                <div className="template-info">
                  <span className="template-name">{template.name}</span>
                  {template.badge && (
                    <span className={`template-badge ${template.isPro ? 'pro' : ''}`}>
                      {template.isPro && <Sparkles size={12} />}
                      {template.badge}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeInUp} className="templates-actions">
            <Link to="/builder">
              <button className="action-btn secondary">
                <ArrowLeft size={18} />
                Back to Editor
              </button>
            </Link>

            <button 
              className="action-btn primary"
              onClick={handlePreview}
              disabled={!selectedTemplate}
            >
              Preview Resume
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default Templates;
