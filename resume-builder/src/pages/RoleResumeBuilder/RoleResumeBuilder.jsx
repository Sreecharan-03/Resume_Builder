import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Code,
  FolderKanban,
  Award,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  Save,
  X,
  Sparkles,
  Lightbulb,
  Target,
  AlertCircle
} from 'lucide-react';
import './RoleResumeBuilder.css';

// Role-specific suggestions
const roleSuggestions = {
  'Java Full Stack Developer': {
    skills: ['Java', 'Spring Boot', 'REST APIs', 'React', 'Angular', 'MySQL', 'MongoDB', 'Microservices', 'Docker', 'AWS'],
    keywords: ['Spring Boot', 'REST APIs', 'Microservices', 'Full Stack', 'Agile'],
    projectTips: 'Include projects showcasing both frontend and backend (e.g., E-commerce app with Spring Boot + React)',
    summaryTip: 'Highlight years of Java experience, frameworks used, and any cloud deployment experience'
  },
  'Frontend Developer': {
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Redux', 'Next.js', 'Tailwind CSS', 'Jest', 'Webpack'],
    keywords: ['React', 'JavaScript', 'Responsive Design', 'UI/UX', 'Performance'],
    projectTips: 'Showcase responsive websites, interactive dashboards, or web applications with modern frameworks',
    summaryTip: 'Emphasize frontend frameworks, responsive design skills, and performance optimization'
  },
  'Backend Developer': {
    skills: ['Node.js', 'Python', 'Java', 'REST APIs', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'],
    keywords: ['APIs', 'Microservices', 'Database Design', 'Scalability', 'Security'],
    projectTips: 'Include API development projects, database designs, or system architecture examples',
    summaryTip: 'Focus on API development, database management, and system scalability'
  },
  'Data Scientist': {
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Deep Learning', 'NLP'],
    keywords: ['Machine Learning', 'Data Analysis', 'Predictive Modeling', 'Statistical Analysis'],
    projectTips: 'Showcase ML models, data analysis projects, or predictive systems with measurable outcomes',
    summaryTip: 'Highlight ML frameworks, statistical expertise, and impactful data-driven solutions'
  },
  'default': {
    skills: ['Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Analytical Skills'],
    keywords: ['Results-driven', 'Team player', 'Detail-oriented', 'Proactive'],
    projectTips: 'Include relevant projects that demonstrate your skills and impact',
    summaryTip: 'Customize your summary to highlight relevant experience and achievements'
  }
};

const steps = [
  { id: 0, label: 'Personal', icon: <User size={18} /> },
  { id: 1, label: 'Education', icon: <GraduationCap size={18} /> },
  { id: 2, label: 'Experience', icon: <Briefcase size={18} /> },
  { id: 3, label: 'Skills', icon: <Code size={18} /> },
  { id: 4, label: 'Projects', icon: <FolderKanban size={18} /> },
];

function RoleResumeBuilder() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [skillInput, setSkillInput] = useState('');
  const [jobContext, setJobContext] = useState(null);
  const [suggestions, setSuggestions] = useState(roleSuggestions['default']);

  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: ''
    },
    education: [
      { id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
    ],
    experience: [
      { id: 1, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }
    ],
    skills: [],
    projects: [
      { id: 1, name: '', description: '', technologies: '', link: '' }
    ]
  });

  useEffect(() => {
    const context = localStorage.getItem('jobContext');
    if (context) {
      const parsed = JSON.parse(context);
      setJobContext(parsed);
      
      // Use extracted keywords from job description if available
      if (parsed.extractedKeywords && parsed.extractedKeywords.length > 0) {
        setSuggestions({
          skills: parsed.extractedKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
          keywords: parsed.extractedKeywords.slice(0, 5).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
          projectTips: `Include projects using ${parsed.extractedKeywords.slice(0, 3).join(', ')}`,
          summaryTip: `Highlight your experience with ${parsed.extractedKeywords.slice(0, 4).join(', ')}`
        });
      } else {
        // Fallback to role-based suggestions
        const roleKey = Object.keys(roleSuggestions).find(key => 
          parsed.role?.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(parsed.role?.toLowerCase().split(' ')[0])
        );
        setSuggestions(roleSuggestions[roleKey] || roleSuggestions['default']);
      }
    }
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (section) => {
    const newId = Date.now();
    const templates = {
      education: { id: newId, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      experience: { id: newId, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      projects: { id: newId, name: '', description: '', technologies: '', link: '' }
    };
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  const removeItem = (section, index) => {
    if (formData[section].length > 1) {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
    }
  };

  const addSkill = (skill = skillInput) => {
    const skillToAdd = skill.trim();
    if (skillToAdd && !formData.skills.includes(skillToAdd)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillToAdd]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleAnalyze = () => {
    localStorage.setItem('resumeData', JSON.stringify(formData));
    navigate('/ats-result');
  };

  const progressWidth = ((currentStep) / (steps.length - 1)) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rb-form-header">
              <div className="rb-form-header-content">
                <h2 className="rb-form-title">
                  <User size={24} />
                  Personal Information
                </h2>
                <p className="rb-form-subtitle">Let's start with your basic details</p>
              </div>
            </div>

            {/* Role Hint */}
            {jobContext && (
              <div className="rb-hint-card">
                <Lightbulb size={18} />
                <div>
                  <strong>Tip for {jobContext.role}:</strong>
                  <p>{suggestions.summaryTip}</p>
                </div>
              </div>
            )}

            <div className="rb-form-grid">
              <div className="rb-form-group">
                <label className="rb-label">First Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.personal.firstName}
                  onChange={handlePersonalChange}
                  className="rb-input"
                  placeholder="John"
                />
              </div>
              <div className="rb-form-group">
                <label className="rb-label">Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.personal.lastName}
                  onChange={handlePersonalChange}
                  className="rb-input"
                  placeholder="Doe"
                />
              </div>
              <div className="rb-form-group">
                <label className="rb-label">Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.personal.email}
                  onChange={handlePersonalChange}
                  className="rb-input"
                  placeholder="john@email.com"
                />
              </div>
              <div className="rb-form-group">
                <label className="rb-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.personal.phone}
                  onChange={handlePersonalChange}
                  className="rb-input"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="rb-form-group">
                <label className="rb-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.personal.location}
                  onChange={handlePersonalChange}
                  className="rb-input"
                  placeholder="New York, NY"
                />
              </div>
              <div className="rb-form-group">
                <label className="rb-label">Professional Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.personal.title}
                  onChange={handlePersonalChange}
                  className="rb-input"
                  placeholder={jobContext?.role || "Software Developer"}
                />
              </div>
              <div className="rb-form-group full-width">
                <label className="rb-label">Professional Summary</label>
                <textarea
                  name="summary"
                  value={formData.personal.summary}
                  onChange={handlePersonalChange}
                  className="rb-input rb-textarea"
                  placeholder="Brief summary of your professional background..."
                  rows={4}
                />
                {suggestions.keywords && (
                  <p className="rb-keyword-hint">
                    <Target size={12} />
                    Keywords to include: <span>{suggestions.keywords.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="education"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rb-form-header">
              <h2 className="rb-form-title">
                <GraduationCap size={24} />
                Education
              </h2>
              <p className="rb-form-subtitle">Add your educational background</p>
            </div>

            <div className="rb-dynamic-items">
              {formData.education.map((edu, index) => (
                <div key={edu.id} className="rb-dynamic-item">
                  <div className="rb-item-header">
                    <span className="rb-item-number">Education {index + 1}</span>
                    {formData.education.length > 1 && (
                      <button className="rb-remove-btn" onClick={() => removeItem('education', index)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="rb-form-grid">
                    <div className="rb-form-group">
                      <label className="rb-label">Institution <span className="required">*</span></label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                        className="rb-input"
                        placeholder="University Name"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                        className="rb-input"
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)}
                        className="rb-input"
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">GPA</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                        className="rb-input"
                        placeholder="3.8"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                        className="rb-input"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">End Date</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                        className="rb-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="rb-add-btn" onClick={() => addItem('education')}>
                <Plus size={18} />
                Add Education
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="experience"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rb-form-header">
              <h2 className="rb-form-title">
                <Briefcase size={24} />
                Work Experience
              </h2>
              <p className="rb-form-subtitle">Add your professional experience</p>
            </div>

            {jobContext && (
              <div className="rb-hint-card">
                <AlertCircle size={18} />
                <div>
                  <strong>For {jobContext.experience === 'fresher' ? 'Freshers' : jobContext.experience + ' exp'}:</strong>
                  <p>{jobContext.experience === 'fresher' 
                    ? 'Include internships, academic projects, or freelance work to showcase relevant experience.'
                    : 'Highlight achievements with quantifiable metrics (e.g., "Improved performance by 40%").'
                  }</p>
                </div>
              </div>
            )}

            <div className="rb-dynamic-items">
              {formData.experience.map((exp, index) => (
                <div key={exp.id} className="rb-dynamic-item">
                  <div className="rb-item-header">
                    <span className="rb-item-number">Experience {index + 1}</span>
                    {formData.experience.length > 1 && (
                      <button className="rb-remove-btn" onClick={() => removeItem('experience', index)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="rb-form-grid">
                    <div className="rb-form-group">
                      <label className="rb-label">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        className="rb-input"
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                        className="rb-input"
                        placeholder={jobContext?.role || "Software Developer"}
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                        className="rb-input"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">End Date</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                        className="rb-input"
                        disabled={exp.current}
                      />
                    </div>
                    <div className="rb-form-group full-width">
                      <label className="rb-label">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                        className="rb-input rb-textarea"
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <label className="rb-checkbox-label">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleArrayChange('experience', index, 'current', e.target.checked)}
                    />
                    <span>I currently work here</span>
                  </label>
                </div>
              ))}
              <button className="rb-add-btn" onClick={() => addItem('experience')}>
                <Plus size={18} />
                Add Experience
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rb-form-header">
              <h2 className="rb-form-title">
                <Code size={24} />
                Skills
              </h2>
              <p className="rb-form-subtitle">Add your technical and soft skills</p>
            </div>

            {jobContext && (
              <div className="rb-hint-card success">
                <Sparkles size={18} />
                <div>
                  <strong>Recommended skills for {jobContext.role}:</strong>
                  <p>Recruiters expect: {suggestions.skills.slice(0, 5).join(', ')}</p>
                </div>
              </div>
            )}

            <div className="rb-skills-section">
              <div className="rb-skills-input-wrap">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="rb-input"
                  placeholder="Type a skill and press Enter"
                />
                <button className="rb-skill-add-btn" onClick={() => addSkill()}>
                  <Plus size={18} />
                  Add
                </button>
              </div>

              <div className="rb-skills-tags">
                {formData.skills.length === 0 ? (
                  <p className="rb-skills-empty">No skills added yet</p>
                ) : (
                  formData.skills.map((skill, index) => (
                    <span key={index} className="rb-skill-tag">
                      {skill}
                      <button onClick={() => removeSkill(skill)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="rb-suggested-skills">
                <p className="rb-suggested-label">
                  <Target size={14} />
                  Click to add suggested skills:
                </p>
                <div className="rb-suggested-tags">
                  {suggestions.skills
                    .filter(s => !formData.skills.includes(s))
                    .map((skill, index) => (
                      <button
                        key={index}
                        className="rb-suggested-tag"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rb-form-header">
              <h2 className="rb-form-title">
                <FolderKanban size={24} />
                Projects
              </h2>
              <p className="rb-form-subtitle">Showcase your best work</p>
            </div>

            {jobContext && (
              <div className="rb-hint-card">
                <Lightbulb size={18} />
                <div>
                  <strong>Project tip for {jobContext.role}:</strong>
                  <p>{suggestions.projectTips}</p>
                </div>
              </div>
            )}

            <div className="rb-dynamic-items">
              {formData.projects.map((project, index) => (
                <div key={project.id} className="rb-dynamic-item">
                  <div className="rb-item-header">
                    <span className="rb-item-number">Project {index + 1}</span>
                    {formData.projects.length > 1 && (
                      <button className="rb-remove-btn" onClick={() => removeItem('projects', index)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="rb-form-grid">
                    <div className="rb-form-group">
                      <label className="rb-label">Project Name <span className="required">*</span></label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                        className="rb-input"
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    <div className="rb-form-group">
                      <label className="rb-label">Technologies</label>
                      <input
                        type="text"
                        value={project.technologies}
                        onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                        className="rb-input"
                        placeholder={suggestions.skills.slice(0, 3).join(', ')}
                      />
                    </div>
                    <div className="rb-form-group full-width">
                      <label className="rb-label">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                        className="rb-input rb-textarea"
                        placeholder="Describe the project, your role, and key achievements..."
                        rows={3}
                      />
                    </div>
                    <div className="rb-form-group full-width">
                      <label className="rb-label">Project Link (Optional)</label>
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                        className="rb-input"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="rb-add-btn" onClick={() => addItem('projects')}>
                <Plus size={18} />
                Add Project
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="role-builder-container">
      <div className="rb-background">
        <div className="rb-blob rb-blob-1"></div>
        <div className="rb-blob rb-blob-2"></div>
      </div>

      {/* Header */}
      <header className="rb-header">
        <Link to="/resume-source" className="rb-logo">
          <div className="rb-logo-icon">
            <FileText size={20} />
          </div>
          <span className="rb-logo-text">
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        {jobContext && (
          <div className="rb-context">
            <Target size={14} />
            <span>Building for: <strong>{jobContext.role}</strong></span>
          </div>
        )}

        <div className="rb-header-actions">
          <button className="rb-action-btn secondary">
            <Save size={18} />
            Save
          </button>
          <button className="rb-action-btn primary" onClick={handleAnalyze}>
            <Sparkles size={18} />
            Analyze ATS Score
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="rb-main">
        {/* Progress Steps */}
        <div className="rb-progress">
          <div className="rb-progress-line"></div>
          <div className="rb-progress-fill" style={{ width: `calc(${progressWidth}% - 40px)` }}></div>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="rb-progress-step"
              onClick={() => setCurrentStep(index)}
            >
              <div className={`rb-step-circle ${
                index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
              }`}>
                {index < currentStep ? <Check size={18} /> : step.icon}
              </div>
              <span className={`rb-step-label ${
                index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="rb-form-card">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="rb-navigation">
            <button
              className="rb-nav-btn back"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                className="rb-nav-btn next"
                onClick={() => setCurrentStep(prev => prev + 1)}
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button className="rb-nav-btn finish" onClick={handleAnalyze}>
                <Sparkles size={18} />
                Analyze Resume
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoleResumeBuilder;
