import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Target,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Code,
  Briefcase,
  GraduationCap,
  User,
  Lightbulb,
  TrendingUp,
  Zap,
  Save,
  RefreshCw,
  Plus,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import './ImproveResume.css';

const ImproveResume = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('summary');
  const [jobContext, setJobContext] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const sections = [
    { id: 'summary', label: 'Summary', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Lightbulb },
    { id: 'education', label: 'Education', icon: GraduationCap }
  ];

  useEffect(() => {
    const storedContext = localStorage.getItem('jobContext');
    const storedResume = localStorage.getItem('resumeData');

    if (storedContext) setJobContext(JSON.parse(storedContext));
    if (storedResume) setResumeData(JSON.parse(storedResume));
  }, []);

  const handleChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addArrayItem = (field, template) => {
    setResumeData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), template]
    }));
  };

  const removeArrayItem = (field, index) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !resumeData.skills?.includes(skillInput.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 500);
  };

  const handleAnalyze = () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    navigate('/ats-result');
  };

  if (!resumeData || !jobContext) {
    return (
      <div className="improve-container">
        <div className="improve-empty">
          <AlertTriangle size={48} />
          <h2>No Resume Data Found</h2>
          <p>Please build your resume first</p>
          <Link to="/company-role" className="improve-start-btn">
            <Sparkles size={20} />
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="improve-container">
      <div className="improve-background">
        <div className="improve-blob improve-blob-1"></div>
        <div className="improve-blob improve-blob-2"></div>
      </div>

      {/* Header */}
      <header className="improve-header">
        <Link to="/" className="improve-logo">
          <div className="improve-logo-icon">
            <FileText size={22} />
          </div>
          <span className="improve-logo-text">Resume<span className="gradient-text">Builder</span></span>
        </Link>

        <div className="improve-context">
          <RefreshCw size={16} />
          <span>Editing for <strong>{jobContext.role}</strong></span>
        </div>

        <div className="improve-header-actions">
          <button 
            className="improve-action-btn secondary" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button className="improve-action-btn primary" onClick={handleAnalyze}>
            <TrendingUp size={18} />
            Re-analyze
          </button>
        </div>
      </header>

      {/* Saved Toast */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            className="improve-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle size={18} />
            Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="improve-layout">
        {/* Sidebar */}
        <aside className="improve-sidebar">
          <nav className="improve-nav">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`improve-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={20} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="improve-sidebar-cta">
            <Zap size={20} />
            <span>Quick tip: Add role-specific keywords to boost your score!</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="improve-main">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="improve-content"
          >
            {/* Summary Section */}
            {activeSection === 'summary' && (
              <div className="improve-section">
                <div className="improve-section-header">
                  <h2><User size={24} /> Professional Summary</h2>
                  <p>Write a compelling summary highlighting your fit for {jobContext.role}</p>
                </div>

                <div className="improve-hint">
                  <Sparkles size={18} />
                  <span>Tip: Include keywords like "full stack", "scalable", and mention years of experience</span>
                </div>

                <div className="improve-form-group">
                  <label>Summary</label>
                  <textarea
                    className="improve-textarea"
                    value={resumeData.summary || ''}
                    onChange={(e) => handleChange('summary', e.target.value)}
                    placeholder={`Experienced ${jobContext.role} with expertise in...`}
                    rows={6}
                  />
                  <div className="improve-char-count">
                    {(resumeData.summary || '').length} characters (aim for 150-300)
                  </div>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="improve-section">
                <div className="improve-section-header">
                  <h2><Code size={24} /> Technical Skills</h2>
                  <p>Add skills relevant to {jobContext.role} position</p>
                </div>

                <div className="improve-hint">
                  <Sparkles size={18} />
                  <span>Suggested: React, Spring Boot, Microservices, REST API, Docker</span>
                </div>

                <div className="improve-skills-input">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Type a skill and press Enter"
                    className="improve-input"
                  />
                  <button className="improve-add-skill-btn" onClick={addSkill}>
                    <Plus size={20} />
                    Add
                  </button>
                </div>

                <div className="improve-skills-list">
                  {(resumeData.skills || []).map((skill, index) => (
                    <motion.span
                      key={index}
                      className="improve-skill-tag"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)}>
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                  {(!resumeData.skills || resumeData.skills.length === 0) && (
                    <p className="improve-empty-text">No skills added yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="improve-section">
                <div className="improve-section-header">
                  <h2><Briefcase size={24} /> Work Experience</h2>
                  <p>Add quantified achievements and role-relevant responsibilities</p>
                </div>

                <div className="improve-hint">
                  <Sparkles size={18} />
                  <span>Tip: Use numbers! "Improved performance by 40%" is better than "Improved performance"</span>
                </div>

                <div className="improve-items-list">
                  {(resumeData.experience || []).map((exp, index) => (
                    <div key={index} className="improve-item-card">
                      <div className="improve-item-header">
                        <span className="improve-item-number">Experience {index + 1}</span>
                        <button 
                          className="improve-remove-btn"
                          onClick={() => removeArrayItem('experience', index)}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="improve-item-grid">
                        <div className="improve-form-group">
                          <label>Position</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={exp.position || ''}
                            onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>Company</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={exp.company || ''}
                            onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                            placeholder="Tech Company Inc."
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>Duration</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={exp.duration || ''}
                            onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                            placeholder="Jan 2022 - Present"
                          />
                        </div>
                        <div className="improve-form-group full-width">
                          <label>Description</label>
                          <textarea
                            className="improve-textarea"
                            value={exp.description || ''}
                            onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                            placeholder="• Developed scalable microservices handling 10K+ requests/day&#10;• Reduced API response time by 40%"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    className="improve-add-btn"
                    onClick={() => addArrayItem('experience', { position: '', company: '', duration: '', description: '' })}
                  >
                    <Plus size={20} />
                    Add Experience
                  </button>
                </div>
              </div>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
              <div className="improve-section">
                <div className="improve-section-header">
                  <h2><Lightbulb size={24} /> Projects</h2>
                  <p>Showcase projects that demonstrate skills for {jobContext.role}</p>
                </div>

                <div className="improve-hint">
                  <Sparkles size={18} />
                  <span>Tip: Include tech stack and quantifiable results in project descriptions</span>
                </div>

                <div className="improve-items-list">
                  {(resumeData.projects || []).map((project, index) => (
                    <div key={index} className="improve-item-card">
                      <div className="improve-item-header">
                        <span className="improve-item-number">Project {index + 1}</span>
                        <button 
                          className="improve-remove-btn"
                          onClick={() => removeArrayItem('projects', index)}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="improve-item-grid">
                        <div className="improve-form-group">
                          <label>Project Name</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={project.title || ''}
                            onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                            placeholder="E-commerce Platform"
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>Tech Stack</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={project.techStack || ''}
                            onChange={(e) => handleArrayChange('projects', index, 'techStack', e.target.value)}
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        <div className="improve-form-group full-width">
                          <label>Description</label>
                          <textarea
                            className="improve-textarea"
                            value={project.description || ''}
                            onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                            placeholder="Built a full-stack e-commerce platform with user authentication, payment integration, and real-time inventory management..."
                            rows={3}
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>GitHub Link</label>
                          <input
                            type="url"
                            className="improve-input"
                            value={project.github || ''}
                            onChange={(e) => handleArrayChange('projects', index, 'github', e.target.value)}
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>Live Demo</label>
                          <input
                            type="url"
                            className="improve-input"
                            value={project.liveLink || ''}
                            onChange={(e) => handleArrayChange('projects', index, 'liveLink', e.target.value)}
                            placeholder="https://project-demo.com"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    className="improve-add-btn"
                    onClick={() => addArrayItem('projects', { title: '', techStack: '', description: '', github: '', liveLink: '' })}
                  >
                    <Plus size={20} />
                    Add Project
                  </button>
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="improve-section">
                <div className="improve-section-header">
                  <h2><GraduationCap size={24} /> Education</h2>
                  <p>Add your educational background</p>
                </div>

                <div className="improve-items-list">
                  {(resumeData.education || []).map((edu, index) => (
                    <div key={index} className="improve-item-card">
                      <div className="improve-item-header">
                        <span className="improve-item-number">Education {index + 1}</span>
                        <button 
                          className="improve-remove-btn"
                          onClick={() => removeArrayItem('education', index)}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="improve-item-grid">
                        <div className="improve-form-group">
                          <label>Degree</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={edu.degree || ''}
                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                            placeholder="B.Tech in Computer Science"
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>Institution</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={edu.institution || ''}
                            onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                            placeholder="University Name"
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>Year</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={edu.year || ''}
                            onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                            placeholder="2020 - 2024"
                          />
                        </div>
                        <div className="improve-form-group">
                          <label>GPA (Optional)</label>
                          <input
                            type="text"
                            className="improve-input"
                            value={edu.gpa || ''}
                            onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                            placeholder="8.5/10 or 3.8/4.0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    className="improve-add-btn"
                    onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', gpa: '' })}
                  >
                    <Plus size={20} />
                    Add Education
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Bottom Actions */}
          <div className="improve-bottom-actions">
            <button className="improve-btn-secondary" onClick={() => navigate('/improvement-guide')}>
              <ChevronLeft size={20} />
              View Guide
            </button>
            <button className="improve-btn-primary" onClick={handleAnalyze}>
              Re-analyze Resume
              <TrendingUp size={20} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImproveResume;
