import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  FileSearch,
  Lightbulb,
  Copy,
  CheckCircle
} from 'lucide-react';
import './CompanyRole.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const experienceLevels = [
  { value: 'fresher', label: 'Fresher (0-1 years)', description: 'Entry level / Graduate' },
  { value: '1-3', label: '1-3 Years', description: 'Junior level' },
  { value: '3-5', label: '3-5 Years', description: 'Mid level' },
  { value: '5+', label: '5+ Years', description: 'Senior level' }
];

function CompanyRole() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobDescription: '',
    experience: ''
  });
  const [copied, setCopied] = useState(false);

  // Extract keywords from job description
  const extractedKeywords = formData.jobDescription.length > 50 
    ? extractKeywords(formData.jobDescription) 
    : [];

  function extractKeywords(text) {
    const techKeywords = [
      'react', 'angular', 'vue', 'javascript', 'typescript', 'python', 'java', 'node.js',
      'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
      'rest api', 'graphql', 'microservices', 'ci/cd', 'spring boot', 'django',
      'machine learning', 'data analysis', 'tensorflow', 'cloud', 'devops',
      'html', 'css', 'sass', 'tailwind', 'bootstrap', 'redux', 'next.js',
      'postgresql', 'mysql', 'redis', 'elasticsearch', 'kafka', 'rabbitmq'
    ];
    
    const lowerText = text.toLowerCase();
    return techKeywords.filter(keyword => lowerText.includes(keyword)).slice(0, 8);
  }

  const handleContinue = () => {
    // Store context in localStorage for later use
    const contextData = {
      ...formData,
      extractedKeywords
    };
    localStorage.setItem('jobContext', JSON.stringify(contextData));
    navigate('/resume-source');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData(prev => ({ ...prev, jobDescription: text }));
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  const isFormValid = formData.company && formData.role && formData.jobDescription.length > 20 && formData.experience;

  return (
    <div className="company-role-container">
      {/* Background */}
      <div className="company-role-background">
        <div className="cr-blob cr-blob-1"></div>
        <div className="cr-blob cr-blob-2"></div>
        <div className="cr-grid"></div>
      </div>

      {/* Header */}
      <header className="cr-header">
        <Link to="/dashboard" className="cr-logo">
          <div className="cr-logo-icon">
            <FileText size={20} />
          </div>
          <span className="cr-logo-text">
            Resume<span className="gradient-text">Builder</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="cr-main">
        <motion.div
          className="cr-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Hero Section */}
          <motion.div className="cr-hero" variants={fadeInUp}>
            <div className="cr-badge">
              <Target size={14} />
              <span>Role-Targeted Resume</span>
            </div>
            <h1 className="cr-title">
              Let's <span className="gradient-text">Target</span> Your Dream Job
            </h1>
            <p className="cr-subtitle">
              Paste the job description and we'll help you build a resume that 
              matches the exact requirements and beats ATS systems.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div className="cr-form-card" variants={fadeInUp}>
            {/* Two Column - Company & Role */}
            <div className="cr-form-row">
              {/* Company Input */}
              <div className="cr-form-group">
                <label className="cr-label">
                  <Building2 size={18} />
                  Company Name
                </label>
                <div className="cr-input-wrapper">
                  <input
                    type="text"
                    className="cr-input"
                    placeholder="e.g., Infosys, TCS, Google"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>

              {/* Job Title Input */}
              <div className="cr-form-group">
                <label className="cr-label">
                  <Briefcase size={18} />
                  Job Title
                </label>
                <div className="cr-input-wrapper">
                  <input
                    type="text"
                    className="cr-input"
                    placeholder="e.g., Java Full Stack Developer"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Job Description Textarea */}
            <div className="cr-form-group">
              <label className="cr-label">
                <FileSearch size={18} />
                Job Description / Requirements
                <button className="cr-paste-btn" onClick={handlePaste}>
                  <Copy size={14} />
                  Paste
                </button>
              </label>
              <div className="cr-textarea-wrapper">
                <textarea
                  className="cr-textarea"
                  placeholder="Paste the complete job description here...

Example:
We are looking for a Java Full Stack Developer with experience in:
- Spring Boot, Microservices
- React.js or Angular
- SQL and NoSQL databases
- REST API development
- Agile methodologies..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  rows={8}
                />
                <div className="cr-textarea-footer">
                  <span className="cr-char-count">
                    {formData.jobDescription.length} characters
                  </span>
                  {formData.jobDescription.length < 20 && (
                    <span className="cr-hint-inline">Minimum 20 characters</span>
                  )}
                </div>
              </div>
            </div>

            {/* Extracted Keywords Preview */}
            {extractedKeywords.length > 0 && (
              <motion.div 
                className="cr-keywords-preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="cr-keywords-header">
                  <Lightbulb size={16} />
                  <span>Detected Skills & Keywords</span>
                </div>
                <div className="cr-keywords-list">
                  {extractedKeywords.map((keyword, index) => (
                    <span key={index} className="cr-keyword-tag">
                      <CheckCircle size={12} />
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="cr-keywords-note">
                  We'll highlight these in your resume to improve ATS match
                </p>
              </motion.div>
            )}

            {/* Experience Level */}
            <div className="cr-form-group">
              <label className="cr-label">
                <TrendingUp size={18} />
                Your Experience Level
              </label>
              <div className="cr-experience-grid">
                {experienceLevels.map((level) => (
                  <motion.div
                    key={level.value}
                    className={`cr-experience-option ${formData.experience === level.value ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, experience: level.value }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="cr-exp-label">{level.label}</span>
                    <span className="cr-exp-desc">{level.description}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <motion.button
              className={`cr-continue-btn ${isFormValid ? 'active' : ''}`}
              onClick={handleContinue}
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
            >
              <span>Continue</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* Info Cards */}
          <motion.div className="cr-info-cards" variants={fadeInUp}>
            <div className="cr-info-card">
              <div className="cr-info-icon">
                <Sparkles size={20} />
              </div>
              <div className="cr-info-content">
                <h4>Why paste the job description?</h4>
                <p>We analyze the requirements to suggest relevant skills, optimize keywords, and tailor your resume for maximum ATS compatibility.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default CompanyRole;
