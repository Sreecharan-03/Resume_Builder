import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  PenTool,
  Upload,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Target
} from 'lucide-react';
import './ResumeSource.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

function ResumeSource() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [jobContext, setJobContext] = useState(null);

  useEffect(() => {
    const context = localStorage.getItem('jobContext');
    if (context) {
      setJobContext(JSON.parse(context));
    }
  }, []);

  const options = [
    {
      id: 'scratch',
      icon: PenTool,
      title: 'Build from Scratch',
      description: 'Create a new resume with role-specific guidance and AI suggestions',
      features: [
        'Role-aligned hints & tips',
        'Smart skill suggestions',
        'ATS-optimized structure',
        'Step-by-step wizard'
      ],
      route: '/role-builder',
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: '#22d3ee'
    },
    {
      id: 'upload',
      icon: Upload,
      title: 'Upload Existing Resume',
      description: 'Enhance your current resume with AI improvements and ATS optimization',
      features: [
        'AI-powered analysis',
        'Skill gap detection',
        'Keyword optimization',
        'Instant ATS score'
      ],
      route: '/upload',
      gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
      color: '#fb923c'
    }
  ];

  const handleContinue = () => {
    if (selectedOption) {
      const option = options.find(o => o.id === selectedOption);
      navigate(option.route);
    }
  };

  return (
    <div className="resume-source-container">
      {/* Background */}
      <div className="rs-background">
        <div className="rs-blob rs-blob-1"></div>
        <div className="rs-blob rs-blob-2"></div>
        <div className="rs-grid"></div>
      </div>

      {/* Header */}
      <header className="rs-header">
        <Link to="/company-role" className="rs-logo">
          <div className="rs-logo-icon">
            <FileText size={20} />
          </div>
          <span className="rs-logo-text">
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        {jobContext && (
          <div className="rs-context-badge">
            <Target size={14} />
            <span>{jobContext.role}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="rs-main">
        <motion.div
          className="rs-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Back Link */}
          <motion.div variants={fadeInUp}>
            <Link to="/company-role" className="rs-back-link">
              <ArrowLeft size={18} />
              <span>Change Target Role</span>
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div className="rs-hero" variants={fadeInUp}>
            <h1 className="rs-title">
              How would you like to <span className="gradient-text">proceed</span>?
            </h1>
            <p className="rs-subtitle">
              Choose how you want to create your {jobContext?.role || 'perfect'} resume
            </p>
          </motion.div>

          {/* Options */}
          <motion.div className="rs-options" variants={fadeInUp}>
            {options.map((option) => (
              <motion.div
                key={option.id}
                className={`rs-option-card ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="rs-option-icon"
                  style={{ background: option.gradient }}
                >
                  <option.icon size={28} />
                </div>

                <div className="rs-option-content">
                  <h3 className="rs-option-title">{option.title}</h3>
                  <p className="rs-option-desc">{option.description}</p>

                  <ul className="rs-option-features">
                    {option.features.map((feature, index) => (
                      <li key={index}>
                        <CheckCircle size={14} style={{ color: option.color }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`rs-option-radio ${selectedOption === option.id ? 'checked' : ''}`}>
                  {selectedOption === option.id && <CheckCircle size={20} />}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Continue Button */}
          <motion.div className="rs-actions" variants={fadeInUp}>
            <motion.button
              className={`rs-continue-btn ${selectedOption ? 'active' : ''}`}
              onClick={handleContinue}
              disabled={!selectedOption}
              whileHover={selectedOption ? { scale: 1.02 } : {}}
              whileTap={selectedOption ? { scale: 0.98 } : {}}
            >
              <span>Continue</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* Info Note */}
          <motion.p className="rs-note" variants={fadeInUp}>
            <Sparkles size={14} />
            Both options include ATS optimization and role-specific recommendations
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}

export default ResumeSource;
