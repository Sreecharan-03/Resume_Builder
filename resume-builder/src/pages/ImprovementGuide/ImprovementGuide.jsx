import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Target,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Code,
  Briefcase,
  Lightbulb,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  ExternalLink,
  Plus,
  CheckCircle,
  Clock,
  Star,
  Users,
  GitBranch,
  Database,
  Layers,
  Rocket,
  AlertTriangle
} from 'lucide-react';
import './ImprovementGuide.css';

const ImprovementGuide = () => {
  const navigate = useNavigate();
  const [jobContext, setJobContext] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Role-specific improvement recommendations
  const roleRecommendations = {
    'Java Full Stack Developer': {
      skills: [
        { name: 'Spring Boot', priority: 'high', description: 'Must-have for Java backend development', learningTime: '2-3 weeks' },
        { name: 'React.js', priority: 'high', description: 'Popular frontend framework for full stack', learningTime: '3-4 weeks' },
        { name: 'Docker', priority: 'medium', description: 'Containerization for deployment', learningTime: '1 week' },
        { name: 'Microservices', priority: 'high', description: 'Modern architecture pattern', learningTime: '2-3 weeks' },
        { name: 'REST API', priority: 'high', description: 'API design and development', learningTime: '1-2 weeks' },
        { name: 'AWS', priority: 'medium', description: 'Cloud deployment skills', learningTime: '2-3 weeks' }
      ],
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Build a full-stack e-commerce app with Spring Boot backend, React frontend, and MySQL database',
          skills: ['Spring Boot', 'React', 'MySQL', 'REST API'],
          impact: '+15-20 ATS points',
          duration: '3-4 weeks'
        },
        {
          title: 'Task Management System',
          description: 'Create a Trello-like app with user auth, real-time updates, and drag-drop functionality',
          skills: ['Java', 'WebSocket', 'React', 'JWT'],
          impact: '+10-15 ATS points',
          duration: '2-3 weeks'
        },
        {
          title: 'Microservices Blog',
          description: 'Build a blog platform using microservices architecture with API gateway',
          skills: ['Microservices', 'Docker', 'Spring Cloud'],
          impact: '+12-18 ATS points',
          duration: '3-4 weeks'
        }
      ],
      resources: [
        { name: 'Spring Boot Docs', url: 'https://spring.io/guides', type: 'Documentation' },
        { name: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'Tutorial' },
        { name: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', type: 'Documentation' }
      ]
    },
    'Frontend Developer': {
      skills: [
        { name: 'React.js', priority: 'high', description: 'Most in-demand frontend framework', learningTime: '3-4 weeks' },
        { name: 'TypeScript', priority: 'high', description: 'Type-safe JavaScript', learningTime: '2 weeks' },
        { name: 'Tailwind CSS', priority: 'medium', description: 'Modern utility-first CSS', learningTime: '1 week' },
        { name: 'Redux/State Management', priority: 'high', description: 'Complex state handling', learningTime: '1-2 weeks' },
        { name: 'Next.js', priority: 'medium', description: 'React framework for production', learningTime: '2 weeks' },
        { name: 'Testing (Jest)', priority: 'medium', description: 'Unit and integration testing', learningTime: '1 week' }
      ],
      projects: [
        {
          title: 'Dashboard Application',
          description: 'Build a responsive admin dashboard with charts, tables, and dark mode',
          skills: ['React', 'Chart.js', 'Tailwind CSS'],
          impact: '+15-20 ATS points',
          duration: '2-3 weeks'
        },
        {
          title: 'Social Media Clone',
          description: 'Create an Instagram/Twitter clone with infinite scroll and real-time features',
          skills: ['React', 'Redux', 'Firebase'],
          impact: '+12-15 ATS points',
          duration: '3-4 weeks'
        },
        {
          title: 'Portfolio Website',
          description: 'Design a stunning animated portfolio with Next.js and Framer Motion',
          skills: ['Next.js', 'Framer Motion', 'CSS'],
          impact: '+8-12 ATS points',
          duration: '1-2 weeks'
        }
      ],
      resources: [
        { name: 'React Documentation', url: 'https://react.dev', type: 'Documentation' },
        { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', type: 'Documentation' },
        { name: 'Frontend Masters', url: 'https://frontendmasters.com', type: 'Course' }
      ]
    },
    'Data Scientist': {
      skills: [
        { name: 'Python', priority: 'high', description: 'Primary language for data science', learningTime: '4 weeks' },
        { name: 'Machine Learning', priority: 'high', description: 'Core data science skill', learningTime: '6-8 weeks' },
        { name: 'TensorFlow/PyTorch', priority: 'high', description: 'Deep learning frameworks', learningTime: '3-4 weeks' },
        { name: 'SQL', priority: 'high', description: 'Database querying', learningTime: '2 weeks' },
        { name: 'Data Visualization', priority: 'medium', description: 'Matplotlib, Seaborn, Plotly', learningTime: '1-2 weeks' },
        { name: 'Statistics', priority: 'high', description: 'Statistical analysis', learningTime: '3-4 weeks' }
      ],
      projects: [
        {
          title: 'Predictive Model',
          description: 'Build a machine learning model to predict house prices or stock trends',
          skills: ['Python', 'Scikit-learn', 'Pandas'],
          impact: '+18-22 ATS points',
          duration: '2-3 weeks'
        },
        {
          title: 'NLP Sentiment Analysis',
          description: 'Create a sentiment analyzer for social media or product reviews',
          skills: ['NLP', 'TensorFlow', 'NLTK'],
          impact: '+15-20 ATS points',
          duration: '3-4 weeks'
        },
        {
          title: 'Data Dashboard',
          description: 'Build an interactive dashboard with real-time data visualization',
          skills: ['Plotly', 'Streamlit', 'Pandas'],
          impact: '+10-15 ATS points',
          duration: '1-2 weeks'
        }
      ],
      resources: [
        { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', type: 'Course' },
        { name: 'Fast.ai', url: 'https://www.fast.ai', type: 'Course' },
        { name: 'Towards Data Science', url: 'https://towardsdatascience.com', type: 'Articles' }
      ]
    },
    'default': {
      skills: [
        { name: 'Communication', priority: 'high', description: 'Clear written and verbal skills', learningTime: 'Ongoing' },
        { name: 'Problem Solving', priority: 'high', description: 'Analytical thinking', learningTime: 'Ongoing' },
        { name: 'Project Management', priority: 'medium', description: 'Planning and execution', learningTime: '2-3 weeks' },
        { name: 'Git/Version Control', priority: 'high', description: 'Code collaboration', learningTime: '1 week' }
      ],
      projects: [
        {
          title: 'Personal Project',
          description: 'Build something that showcases your unique skills and interests',
          skills: ['Your core skills'],
          impact: '+10-15 ATS points',
          duration: '2-4 weeks'
        }
      ],
      resources: [
        { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning', type: 'Course' }
      ]
    }
  };

  useEffect(() => {
    const storedContext = localStorage.getItem('jobContext');
    const storedResume = localStorage.getItem('resumeData');

    if (storedContext) setJobContext(JSON.parse(storedContext));
    if (storedResume) setResumeData(JSON.parse(storedResume));
  }, []);

  useEffect(() => {
    if (resumeData && jobContext) {
      generateAnalysis();
    }
  }, [resumeData, jobContext]);

  const generateAnalysis = () => {
    const role = jobContext?.role || 'default';
    const recommendations = roleRecommendations[role] || roleRecommendations['default'];
    
    const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
    
    // Find missing skills
    const missingSkills = recommendations.skills.filter(skill => 
      !resumeSkills.some(rs => 
        rs.includes(skill.name.toLowerCase()) || 
        skill.name.toLowerCase().includes(rs)
      )
    );

    // Calculate potential improvement
    const potentialImprovement = missingSkills.length * 3 + 
      (recommendations.projects.length * 5);

    setAnalysis({
      missingSkills,
      suggestedProjects: recommendations.projects,
      resources: recommendations.resources,
      potentialImprovement: Math.min(potentialImprovement, 35),
      currentEstimate: 65 // Placeholder - would come from actual ATS score
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#22d3ee';
      default: return '#94a3b8';
    }
  };

  if (!jobContext || !resumeData) {
    return (
      <div className="improvement-container">
        <div className="improvement-empty">
          <AlertTriangle size={48} />
          <h2>No Data Found</h2>
          <p>Please complete your resume analysis first</p>
          <Link to="/company-role" className="improvement-start-btn">
            <Sparkles size={20} />
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="improvement-container">
      <div className="improvement-background">
        <div className="improvement-blob improvement-blob-1"></div>
        <div className="improvement-blob improvement-blob-2"></div>
      </div>

      {/* Header */}
      <header className="improvement-header">
        <Link to="/" className="improvement-logo">
          <div className="improvement-logo-icon">
            <FileText size={22} />
          </div>
          <span className="improvement-logo-text">Resume<span className="gradient-text">Builder</span></span>
        </Link>

        <div className="improvement-context">
          <Target size={16} />
          <span>Improvement Guide for <strong>{jobContext.role}</strong></span>
        </div>

        <div className="improvement-header-actions">
          <button className="improvement-action-btn secondary" onClick={() => navigate('/ats-result')}>
            <TrendingUp size={18} />
            View Score
          </button>
          <button className="improvement-action-btn primary" onClick={() => navigate('/improve-resume')}>
            <Zap size={18} />
            Apply Changes
          </button>
        </div>
      </header>

      <main className="improvement-main">
        {/* Hero Section */}
        <motion.div
          className="improvement-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="improvement-hero-icon">
            <Rocket size={32} />
          </div>
          <div className="improvement-hero-content">
            <h1>Your Personalized Improvement Guide</h1>
            <p>
              Based on your target role as <strong>{jobContext.role}</strong> at <strong>{jobContext.company}</strong>, 
              here are actionable recommendations to boost your ATS score.
            </p>
          </div>
          <div className="improvement-potential">
            <span className="improvement-potential-label">Potential Gain</span>
            <span className="improvement-potential-value">+{analysis?.potentialImprovement || 0} pts</span>
          </div>
        </motion.div>

        {/* Missing Skills Section */}
        {analysis?.missingSkills?.length > 0 && (
          <motion.section
            className="improvement-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="improvement-section-header">
              <div className="improvement-section-icon skills-icon">
                <Code size={24} />
              </div>
              <div>
                <h2>Missing Skills</h2>
                <p>These skills are commonly required for {jobContext.role} positions</p>
              </div>
            </div>

            <div className="improvement-skills-grid">
              {analysis.missingSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="improvement-skill-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="improvement-skill-header">
                    <h3>{skill.name}</h3>
                    <span 
                      className="improvement-skill-priority"
                      style={{ 
                        background: `${getPriorityColor(skill.priority)}20`,
                        color: getPriorityColor(skill.priority)
                      }}
                    >
                      {skill.priority} priority
                    </span>
                  </div>
                  <p className="improvement-skill-desc">{skill.description}</p>
                  <div className="improvement-skill-meta">
                    <Clock size={14} />
                    <span>Learning time: {skill.learningTime}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Recommended Projects */}
        <motion.section
          className="improvement-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="improvement-section-header">
            <div className="improvement-section-icon projects-icon">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2>Recommended Projects</h2>
              <p>Build these projects to demonstrate your skills and boost your score</p>
            </div>
          </div>

          <div className="improvement-projects-list">
            {analysis?.suggestedProjects?.map((project, index) => (
              <motion.div
                key={index}
                className="improvement-project-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="improvement-project-number">{index + 1}</div>
                <div className="improvement-project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="improvement-project-skills">
                    {project.skills.map((skill, i) => (
                      <span key={i} className="improvement-project-skill">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="improvement-project-stats">
                  <div className="improvement-stat impact">
                    <TrendingUp size={16} />
                    <span>{project.impact}</span>
                  </div>
                  <div className="improvement-stat duration">
                    <Clock size={16} />
                    <span>{project.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Learning Resources */}
        <motion.section
          className="improvement-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="improvement-section-header">
            <div className="improvement-section-icon resources-icon">
              <BookOpen size={24} />
            </div>
            <div>
              <h2>Learning Resources</h2>
              <p>Curated resources to help you learn the required skills</p>
            </div>
          </div>

          <div className="improvement-resources-grid">
            {analysis?.resources?.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="improvement-resource-card"
              >
                <div className="improvement-resource-type">{resource.type}</div>
                <h3>{resource.name}</h3>
                <div className="improvement-resource-link">
                  <span>Visit Resource</span>
                  <ExternalLink size={16} />
                </div>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Quick Tips */}
        <motion.section
          className="improvement-tips"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2>
            <Star size={20} />
            Quick Tips to Improve Your ATS Score
          </h2>
          <ul>
            <li>
              <CheckCircle size={18} />
              <span>Use keywords from the job description in your summary and experience</span>
            </li>
            <li>
              <CheckCircle size={18} />
              <span>Quantify your achievements with numbers and percentages</span>
            </li>
            <li>
              <CheckCircle size={18} />
              <span>List technical skills that match the job requirements</span>
            </li>
            <li>
              <CheckCircle size={18} />
              <span>Include relevant projects with detailed descriptions</span>
            </li>
            <li>
              <CheckCircle size={18} />
              <span>Keep formatting clean and ATS-friendly (avoid complex layouts)</span>
            </li>
          </ul>
        </motion.section>

        {/* Action Bar */}
        <motion.div
          className="improvement-action-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button className="improvement-action-main" onClick={() => navigate('/improve-resume')}>
            <Zap size={20} />
            Apply Improvements to Resume
            <ArrowRight size={18} />
          </button>
          <button className="improvement-action-secondary" onClick={() => navigate('/ats-result')}>
            View Current Score
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default ImprovementGuide;
