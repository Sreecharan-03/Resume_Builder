import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { resumeService } from '../../services';
import { ResumeTemplate } from '../../templates/ResumeTemplates';
import { templates } from '../../templates';
import { getTemplateSections, sectionLabels } from '../../templates/templateConfig';
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
  BookOpen,
  Plus,
  Trash2,
  Check,
  CheckCircle,
  Save,
  X,
  Globe,
  Heart,
  Link as LinkIcon,
  Upload,
  Github,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import './Builder.css';

const Builder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  // Use Resume Context for centralized state
  const { 
    resumeData, 
    setResumeData,
    selectedTemplate,
    setSelectedTemplate
  } = useResume();

  // On mount, if templateId is passed from Upload, set it
  useEffect(() => {
    if (location.state?.templateId) {
      setSelectedTemplate(location.state.templateId);
    }
  }, [location.state, setSelectedTemplate]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [skillInput, setSkillInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.5);
  const [uploadSource, setUploadSource] = useState(null);

  // Initialize formData from context or use defaults
  const [formData, setFormData] = useState(() => {
    if (resumeData?.personal?.firstName || resumeData?.personal?.email) {
      return {
        ...resumeData,
        personal: {
          ...resumeData.personal,
          isStudent: resumeData.personal?.isStudent ?? (localStorage.getItem('isStudent') === 'true')
        }
      };
    }
    return {
      personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        summary: '',
        isStudent: localStorage.getItem('isStudent') === 'true'
      },
      codingProfiles: {
        linkedin: '',
        github: '',
        portfolio: '',
        leetcode: '',
        hackerrank: '',
        codechef: '',
        codeforces: '',
        kaggle: ''
      },
      education: [
        {
          id: 1,
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false,
          gpa: ''
        }
      ],
      experience: [
        {
          id: 1,
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ],
      skills: [],
      projects: [
        {
          id: 1,
          name: '',
          description: '',
          technologies: '',
          liveLink: '',
          githubLink: ''
        }
      ],
      certifications: [
        {
          id: 1,
          name: '',
          issuer: '',
          date: '',
          credentialId: '',
          credentialUrl: '',
          driveLink: ''
        }
      ],
      languages: [
        {
          id: 1,
          language: '',
          proficiency: 'intermediate'
        }
      ],
      activities: [
        {
          id: 1,
          title: '',
          organization: '',
          role: '',
          description: '',
          startDate: '',
          endDate: ''
        }
      ],
      hobbies: []
    };
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Load parsed data from upload if available
  useEffect(() => {
    // Check if coming from upload page with parsed data
    if (location.state?.parsedData && location.state?.source === 'upload') {
      setFormData(location.state.parsedData);
      setUploadSource(location.state.fileName || 'Uploaded Resume');
      
      // Clear the state to prevent re-loading on refresh
      window.history.replaceState({}, document.title);
      
      // Also clear localStorage flag
      localStorage.removeItem('parsedResumeData');
      localStorage.removeItem('resumeSource');
    } else {
      // Check localStorage as fallback
      const storedParsedData = localStorage.getItem('parsedResumeData');
      const storedSource = localStorage.getItem('resumeSource');
      
      if (storedParsedData && storedSource === 'upload') {
        try {
          const parsedData = JSON.parse(storedParsedData);
          setFormData(parsedData);
          setUploadSource('Uploaded Resume');
          
          // Clear after loading
          localStorage.removeItem('parsedResumeData');
          localStorage.removeItem('resumeSource');
        } catch (e) {
          console.error('Error parsing stored resume data:', e);
        }
      }
    }
  }, [location.state]);

  // Load existing resume if editing
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      loadResume(id);
    }
  }, [searchParams]);

  const loadResume = async (id) => {
    try {
      const result = await resumeService.getResume(id);
      if (result.success && result.data) {
        setResumeId(id);
        // Populate form with existing data
        if (result.data.content) {
          setFormData(result.data.content);
        }
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
    }
  };

  const saveResume = async (navigateAfter = false) => {
    setSaving(true);
    try {
      const dataToSave = {
        title: `${formData.personal.firstName} ${formData.personal.lastName}'s Resume`,
        content: formData
      };

      let result;
      if (resumeId) {
        result = await resumeService.updateResume(resumeId, dataToSave);
        // Store resume ID for other pages (Preview, FinalResume, etc.)
        localStorage.setItem('currentResumeId', resumeId);
      } else {
        result = await resumeService.createResume(dataToSave);
        if (result.success && result.data?.id) {
          setResumeId(result.data.id);
          // Store resume ID for other pages (Preview, FinalResume, etc.)
          localStorage.setItem('currentResumeId', result.data.id.toString());
        }
      }

      // Also save to localStorage for template page
      resumeService.saveToLocalStorage(formData);

      if (navigateAfter) {
        // Navigate to templates even if saving failed so user can choose a template;
        // preserve existing behavior of attempting to save but do not block navigation.
        try {
          if (result.success) navigate('/templates');
          else navigate('/templates');
        } catch (navErr) {
          console.error('Navigation to templates failed:', navErr);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Failed to save resume:', error);
      return { success: false, error: 'Failed to save resume' };
    } finally {
      setSaving(false);
    }
  };

  // All possible steps ordered by typical resume flow
  const ALL_STEPS = useMemo(() => [
    { id: 0, label: 'Personal',       section: 'personal',       icon: <User size={18} /> },
    { id: 1, label: 'Education',      section: 'education',      icon: <GraduationCap size={18} /> },
    { id: 2, label: 'Experience',     section: 'experience',     icon: <Briefcase size={18} /> },
    { id: 3, label: 'Skills',         section: 'skills',         icon: <Code size={18} /> },
    { id: 4, label: 'Projects',       section: 'projects',       icon: <FolderKanban size={18} /> },
    { id: 5, label: 'Certifications', section: 'certifications', icon: <Award size={18} /> },
    { id: 6, label: 'Languages',      section: 'languages',      icon: <Globe size={18} /> },
    { id: 7, label: 'Activities',     section: 'activities',     icon: <Heart size={18} /> },
  ], []);

  // Active steps based on selected template + student mode
  const steps = useMemo(() => {
    const templateSectionList = getTemplateSections(selectedTemplate);
    const isStudent = formData?.personal?.isStudent;
    return ALL_STEPS.filter(s => {
      if (!templateSectionList.includes(s.section)) return false;
      if (isStudent && s.section === 'experience') return false;
      return true;
    });
  }, [selectedTemplate, ALL_STEPS, formData?.personal?.isStudent]);

  // Reset to step 0 when template changes (avoid out-of-bounds index)
  useEffect(() => {
    setCurrentStep(0);
  }, [selectedTemplate]);

  // Sync formData to context for live preview
  useEffect(() => {
    setResumeData(formData);
  }, [formData, setResumeData]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleStudentToggle = () => {
    const newVal = !formData.personal.isStudent;
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, isStudent: newVal }
    }));
    localStorage.setItem('isStudent', newVal.toString());
  };

  const handleCodingProfilesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      codingProfiles: { ...prev.codingProfiles, [name]: value }
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
      education: { id: newId, institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: '' },
      experience: { id: newId, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      projects: { id: newId, name: '', description: '', technologies: '', liveLink: '', githubLink: '' },
      certifications: { id: newId, name: '', issuer: '', date: '', credentialId: '', credentialUrl: '', driveLink: '' },
      languages: { id: newId, language: '', proficiency: 'intermediate' },
      activities: { id: newId, title: '', organization: '', role: '', description: '', startDate: '', endDate: '' }
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

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
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

  const addHobby = () => {
    if (hobbyInput.trim() && !formData.hobbies.includes(hobbyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyInput.trim()]
      }));
      setHobbyInput('');
    }
  };

  const removeHobby = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
  };

  const progressWidth = ((currentStep) / (steps.length - 1)) * 100;

  const proficiencyLevels = [
    { value: 'native', label: 'Native' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'basic', label: 'Basic' }
  ];

  const codingPlatforms = [
    { name: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { name: 'github', label: 'GitHub', placeholder: 'github.com/username' },
    { name: 'portfolio', label: 'Portfolio Website', placeholder: 'yourportfolio.com' },
    { name: 'leetcode', label: 'LeetCode', placeholder: 'leetcode.com/username' },
    { name: 'hackerrank', label: 'HackerRank', placeholder: 'hackerrank.com/username' },
    { name: 'codechef', label: 'CodeChef', placeholder: 'codechef.com/users/username' },
    { name: 'codeforces', label: 'Codeforces', placeholder: 'codeforces.com/profile/username' },
    { name: 'kaggle', label: 'Kaggle', placeholder: 'kaggle.com/username' }
  ];

  // Get template data formatted for live preview
  const getPreviewData = () => {
    return {
      personal: {
        ...formData.personal,
        fullName: `${formData.personal.firstName} ${formData.personal.lastName}`.trim(),
        linkedin: formData.codingProfiles?.linkedin || '',
        github: formData.codingProfiles?.github || '',
        website: formData.codingProfiles?.portfolio || ''
      },
      education: formData.education.filter(edu => edu.institution || edu.degree),
      experience: formData.experience.filter(exp => exp.company || exp.position),
      skills: formData.skills,
      projects: formData.projects.filter(proj => proj.name || proj.description),
      certifications: formData.certifications.filter(cert => cert.name),
      languages: formData.languages.filter(lang => lang.language),
      activities: formData.activities.filter(act => act.title),
      hobbies: formData.hobbies
    };
  };

  // Navigate between templates (use actual templates length and circular navigation)
  const templateIds = templates.map(t => t.id).sort((a,b) => a - b);
  const totalTemplates = templateIds.length || 1;

  const handlePrevTemplate = () => {
    setSelectedTemplate(prev => {
      const idx = templateIds.indexOf(prev);
      if (idx === -1) return templateIds[0];
      const newIdx = (idx - 1 + totalTemplates) % totalTemplates;
      return templateIds[newIdx];
    });
  };

  const handleNextTemplate = () => {
    setSelectedTemplate(prev => {
      const idx = templateIds.indexOf(prev);
      if (idx === -1) return templateIds[0];
      const newIdx = (idx + 1) % totalTemplates;
      return templateIds[newIdx];
    });
  };

  const currentTemplateInfo = templates.find(t => t.id === selectedTemplate) || templates[0];

  const renderStepContent = () => {
    switch (steps[currentStep]?.section) {
      case 'personal':
        return (
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <User size={24} />
                </div>
                Personal Information
              </h2>
              <p className="form-card-subtitle">Let's start with your basic details</p>
            </div>

            {/* ── Student Mode Toggle ── */}
            <div className={`student-mode-banner ${formData.personal.isStudent ? 'active' : ''}`}>
              <div className="student-mode-info">
                <div className="student-mode-icon-wrap">
                  <BookOpen size={22} />
                </div>
                <div className="student-mode-text">
                  <div className="student-mode-title">Student Mode</div>
                  <div className="student-mode-desc">
                    {formData.personal.isStudent
                      ? 'Work experience section is hidden — perfect for students with no job history yet.'
                      : 'Enable this if you are a student with no work experience yet.'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={`student-mode-btn ${formData.personal.isStudent ? 'on' : 'off'}`}
                onClick={handleStudentToggle}
                aria-pressed={formData.personal.isStudent}
              >
                <span className="student-toggle-track">
                  <span className="student-toggle-thumb" />
                </span>
                <span className="student-toggle-label">
                  {formData.personal.isStudent ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.personal.firstName}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="John"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.personal.lastName}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.personal.email}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="john.doe@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.personal.phone}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.personal.location}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="New York, NY"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.personal.title}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="Full Stack Developer"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Professional Summary</label>
                <textarea
                  name="summary"
                  value={formData.personal.summary}
                  onChange={handlePersonalChange}
                  className="form-input form-textarea"
                  placeholder="Brief summary of your professional background..."
                  rows={4}
                />
              </div>
            </div>

            {/* Coding Profiles Section */}
            <div className="section-divider">
              <div className="divider-icon">
                <Github size={18} />
              </div>
              <span>Coding Profiles & Links</span>
            </div>

            <div className="form-grid">
              {codingPlatforms.map((platform) => (
                <div className="form-group" key={platform.name}>
                  <label className="form-label">{platform.label}</label>
                  <div className="input-with-icon">
                    <LinkIcon size={16} className="input-icon" />
                    <input
                      type="url"
                      name={platform.name}
                      value={formData.codingProfiles[platform.name]}
                      onChange={handleCodingProfilesChange}
                      className="form-input with-icon"
                      placeholder={platform.placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'education':
        return (
          <motion.div
            key="education"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <GraduationCap size={24} />
                </div>
                Education
              </h2>
              <p className="form-card-subtitle">Add your educational background</p>
            </div>
            <div className="dynamic-items">
              {formData.education.map((edu, index) => (
                <div key={edu.id} className="dynamic-item">
                  <div className="item-header">
                    <span className="item-number">Education {index + 1}</span>
                    {formData.education.length > 1 && (
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem('education', index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Institution <span className="required">*</span></label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                        className="form-input"
                        placeholder="Harvard University"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Degree <span className="required">*</span></label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                        className="form-input"
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)}
                        className="form-input"
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GPA</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                        className="form-input"
                        placeholder="3.8/4.0"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                        className="form-input"
                        disabled={edu.current}
                      />
                    </div>
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) => handleArrayChange('education', index, 'current', e.target.checked)}
                    />
                    <span>Currently studying here</span>
                  </label>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addItem('education')}>
                <Plus size={20} />
                Add Another Education
              </button>
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            key="experience"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <Briefcase size={24} />
                </div>
                Work Experience
              </h2>
              <p className="form-card-subtitle">Add your professional experience</p>
            </div>
            <div className="dynamic-items">
              {formData.experience.map((exp, index) => (
                <div key={exp.id} className="dynamic-item">
                  <div className="item-header">
                    <span className="item-number">Experience {index + 1}</span>
                    {formData.experience.length > 1 && (
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem('experience', index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Company <span className="required">*</span></label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        className="form-input"
                        placeholder="Google Inc."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Position <span className="required">*</span></label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                        className="form-input"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                        className="form-input"
                        placeholder="Mountain View, CA"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                        className="form-input"
                        disabled={exp.current}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                        className="form-input form-textarea"
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleArrayChange('experience', index, 'current', e.target.checked)}
                    />
                    <span>I currently work here</span>
                  </label>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addItem('experience')}>
                <Plus size={20} />
                Add Another Experience
              </button>
            </div>
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <Code size={24} />
                </div>
                Skills
              </h2>
              <p className="form-card-subtitle">Add your technical and soft skills</p>
            </div>
            <div className="skills-section">
              <div className="skills-input-wrapper">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="form-input"
                  placeholder="Type a skill and press Enter"
                />
                <button className="skill-add-btn" onClick={addSkill}>
                  <Plus size={18} />
                  Add
                </button>
              </div>

              <div className="skills-tags">
                {formData.skills.length === 0 ? (
                  <p className="skills-empty">No skills added yet. Start typing above to add skills.</p>
                ) : (
                  formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="skill-remove">
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="suggested-skills">
                <p className="suggested-label">Suggested Skills:</p>
                <div className="suggested-tags">
                  {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker', 'TypeScript', 'Java']
                    .filter(s => !formData.skills.includes(s))
                    .map((skill, index) => (
                      <button 
                        key={index} 
                        className="suggested-tag"
                        onClick={() => {
                          setSkillInput(skill);
                          addSkill();
                        }}
                      >
                        + {skill}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <FolderKanban size={24} />
                </div>
                Projects
              </h2>
              <p className="form-card-subtitle">Showcase your best projects</p>
            </div>
            <div className="dynamic-items">
              {formData.projects.map((project, index) => (
                <div key={project.id} className="dynamic-item">
                  <div className="item-header">
                    <span className="item-number">Project {index + 1}</span>
                    {formData.projects.length > 1 && (
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem('projects', index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Project Name <span className="required">*</span></label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                        className="form-input"
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Technologies Used</label>
                      <input
                        type="text"
                        value={project.technologies}
                        onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                        className="form-input"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Live Demo Link</label>
                      <div className="input-with-icon">
                        <ExternalLink size={16} className="input-icon" />
                        <input
                          type="url"
                          value={project.liveLink}
                          onChange={(e) => handleArrayChange('projects', index, 'liveLink', e.target.value)}
                          className="form-input with-icon"
                          placeholder="https://myproject.com"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">GitHub Repository</label>
                      <div className="input-with-icon">
                        <Github size={16} className="input-icon" />
                        <input
                          type="url"
                          value={project.githubLink}
                          onChange={(e) => handleArrayChange('projects', index, 'githubLink', e.target.value)}
                          className="form-input with-icon"
                          placeholder="github.com/username/project"
                        />
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                        className="form-input form-textarea"
                        placeholder="Describe the project, its features, and your role..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addItem('projects')}>
                <Plus size={20} />
                Add Another Project
              </button>
            </div>
          </motion.div>
        );

      case 'certifications':
        return (
          <motion.div
            key="certifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <Award size={24} />
                </div>
                Certifications
              </h2>
              <p className="form-card-subtitle">Add your professional certifications and credentials</p>
            </div>
            <div className="dynamic-items">
              {formData.certifications.map((cert, index) => (
                <div key={cert.id} className="dynamic-item">
                  <div className="item-header">
                    <span className="item-number">Certification {index + 1}</span>
                    {formData.certifications.length > 1 && (
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem('certifications', index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Certification Name <span className="required">*</span></label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                        className="form-input"
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                        className="form-input"
                        placeholder="Amazon Web Services"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Issue Date</label>
                      <input
                        type="month"
                        value={cert.date}
                        onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Credential ID</label>
                      <input
                        type="text"
                        value={cert.credentialId}
                        onChange={(e) => handleArrayChange('certifications', index, 'credentialId', e.target.value)}
                        className="form-input"
                        placeholder="ABC123XYZ"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Credential URL</label>
                      <div className="input-with-icon">
                        <ExternalLink size={16} className="input-icon" />
                        <input
                          type="url"
                          value={cert.credentialUrl}
                          onChange={(e) => handleArrayChange('certifications', index, 'credentialUrl', e.target.value)}
                          className="form-input with-icon"
                          placeholder="https://verify.cert.com/abc123"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Google Drive Link</label>
                      <div className="input-with-icon">
                        <LinkIcon size={16} className="input-icon" />
                        <input
                          type="url"
                          value={cert.driveLink}
                          onChange={(e) => handleArrayChange('certifications', index, 'driveLink', e.target.value)}
                          className="form-input with-icon"
                          placeholder="drive.google.com/file/..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="upload-section">
                    <label className="upload-label">
                      <Upload size={18} />
                      Upload Certificate (PDF/Image)
                    </label>
                    <p className="upload-hint">Or paste Google Drive link above</p>
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addItem('certifications')}>
                <Plus size={20} />
                Add Another Certification
              </button>
            </div>
          </motion.div>
        );

      case 'languages':
        return (
          <motion.div
            key="languages"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <Globe size={24} />
                </div>
                Languages
              </h2>
              <p className="form-card-subtitle">Add languages you speak</p>
            </div>
            <div className="dynamic-items">
              {formData.languages.map((lang, index) => (
                <div key={lang.id} className="dynamic-item language-item">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Language <span className="required">*</span></label>
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => handleArrayChange('languages', index, 'language', e.target.value)}
                        className="form-input"
                        placeholder="English"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Proficiency Level</label>
                      <select
                        value={lang.proficiency}
                        onChange={(e) => handleArrayChange('languages', index, 'proficiency', e.target.value)}
                        className="form-input form-select"
                      >
                        {proficiencyLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.languages.length > 1 && (
                      <button 
                        className="remove-item-btn inline"
                        onClick={() => removeItem('languages', index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button className="add-item-btn" onClick={() => addItem('languages')}>
                <Plus size={20} />
                Add Another Language
              </button>
            </div>
          </motion.div>
        );

      case 'activities':
        return (
          <motion.div
            key="activities"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="form-card-header">
              <h2 className="form-card-title">
                <div className="form-card-title-icon">
                  <Heart size={24} />
                </div>
                Activities & Hobbies
              </h2>
              <p className="form-card-subtitle">Add extra-curricular activities and interests</p>
            </div>

            {/* Extra-curricular Activities */}
            <div className="subsection">
              <h3 className="subsection-title">Extra-Curricular Activities</h3>
              <div className="dynamic-items">
                {formData.activities.map((activity, index) => (
                  <div key={activity.id} className="dynamic-item">
                    <div className="item-header">
                      <span className="item-number">Activity {index + 1}</span>
                      {formData.activities.length > 1 && (
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeItem('activities', index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Activity/Club Name</label>
                        <input
                          type="text"
                          value={activity.title}
                          onChange={(e) => handleArrayChange('activities', index, 'title', e.target.value)}
                          className="form-input"
                          placeholder="Coding Club"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Organization</label>
                        <input
                          type="text"
                          value={activity.organization}
                          onChange={(e) => handleArrayChange('activities', index, 'organization', e.target.value)}
                          className="form-input"
                          placeholder="University Name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Your Role</label>
                        <input
                          type="text"
                          value={activity.role}
                          onChange={(e) => handleArrayChange('activities', index, 'role', e.target.value)}
                          className="form-input"
                          placeholder="President / Member"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                          type="text"
                          value={activity.startDate}
                          onChange={(e) => handleArrayChange('activities', index, 'startDate', e.target.value)}
                          className="form-input"
                          placeholder="2020 - 2022"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label className="form-label">Description</label>
                        <textarea
                          value={activity.description}
                          onChange={(e) => handleArrayChange('activities', index, 'description', e.target.value)}
                          className="form-input form-textarea"
                          placeholder="Describe your involvement and achievements..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-item-btn" onClick={() => addItem('activities')}>
                  <Plus size={20} />
                  Add Another Activity
                </button>
              </div>
            </div>

            {/* Hobbies & Interests */}
            <div className="subsection">
              <h3 className="subsection-title">Hobbies & Interests</h3>
              <div className="skills-section">
                <div className="skills-input-wrapper">
                  <input
                    type="text"
                    value={hobbyInput}
                    onChange={(e) => setHobbyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                    className="form-input"
                    placeholder="Type a hobby and press Enter"
                  />
                  <button className="skill-add-btn" onClick={addHobby}>
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                <div className="skills-tags hobbies-tags">
                  {formData.hobbies.length === 0 ? (
                    <p className="skills-empty">No hobbies added yet.</p>
                  ) : (
                    formData.hobbies.map((hobby, index) => (
                      <span key={index} className="skill-tag hobby-tag">
                        {hobby}
                        <button onClick={() => removeHobby(hobby)} className="skill-remove">
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="suggested-skills">
                  <p className="suggested-label">Suggested Hobbies:</p>
                  <div className="suggested-tags">
                    {['Reading', 'Photography', 'Gaming', 'Blogging', 'Open Source', 'Music', 'Sports', 'Traveling', 'Cooking', 'Volunteering']
                      .filter(h => !formData.hobbies.includes(h))
                      .map((hobby, index) => (
                        <button 
                          key={index} 
                          className="suggested-tag hobby-suggested"
                          onClick={() => {
                            setHobbyInput(hobby);
                            addHobby();
                          }}
                        >
                          + {hobby}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="builder-container">
      <div className="builder-background">
        <div className="builder-blob builder-blob-1"></div>
        <div className="builder-blob builder-blob-2"></div>
      </div>

      {/* Header */}
      <header className="builder-header">
        <Link to="/dashboard" className="builder-logo">
          <div className="builder-logo-icon">
            <FileText size={22} />
          </div>
          <span className="builder-logo-text">
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>
        <div className="builder-header-actions">
          <button 
            className="header-action-btn toggle-preview"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button 
            className="header-action-btn secondary"
            onClick={() => saveResume(false)}
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button 
            className="header-action-btn primary"
            onClick={() => saveResume(true)}
            disabled={saving}
          >
            Choose Template
            <ArrowRight size={18} />
          </button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="builder-split-view">
        {/* Upload Success Banner */}
        {uploadSource && (
          <div className="upload-success-banner">
            <CheckCircle size={20} />
            <span>Resume "{uploadSource}" parsed successfully! Review and edit the auto-filled details below.</span>
            <button onClick={() => setUploadSource(null)} className="banner-close">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Left: Form Panel */}
        <main className={`builder-main ${showPreview ? 'with-preview' : 'full-width'}`}>

          {/* Template Section Info Banner */}
          {selectedTemplate && (
            <div className="template-section-banner">
              <span className="template-section-banner-title">
                {currentTemplateInfo?.name || 'Template'} sections:
              </span>
              {steps.map(s => (
                <span key={s.section} className="template-section-chip active">
                  {s.label}
                </span>
              ))}
              {/* Dimmed chips for sections NOT in this template */}
              {['personal','education','experience','skills','projects','certifications','languages','activities']
                .filter(sec => !getTemplateSections(selectedTemplate).includes(sec))
                .map(sec => (
                  <span key={sec} className="template-section-chip inactive">
                    {sectionLabels[sec]}
                  </span>
                ))
              }
            </div>
          )}

          {/* Progress Steps */}
          <div className="progress-container">
            <div className="progress-steps">
              <div className="progress-line"></div>
              <div 
                className="progress-line-fill" 
                style={{ width: `calc(${progressWidth}% - 60px)` }}
              ></div>
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className="progress-step"
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`step-circle ${
                    index < currentStep ? 'completed' : 
                    index === currentStep ? 'active' : 'inactive'
                  }`}>
                    {index < currentStep ? <Check size={20} /> : step.icon}
                  </div>
                  <span className={`step-label ${
                    index < currentStep ? 'completed' : 
                    index === currentStep ? 'active' : ''
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="form-card">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="form-navigation">
              <motion.button
                className="nav-btn back"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
              >
                <ArrowLeft size={18} />
                Previous
              </motion.button>

              {currentStep < steps.length - 1 ? (
                <motion.button
                  className="nav-btn next"
                  onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next Step
                  <ArrowRight size={18} />
                </motion.button>
              ) : (
                <motion.button
                  className="nav-btn finish"
                  onClick={() => saveResume(true)}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? 'Saving...' : 'Choose Template'}
                  <ArrowRight size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </main>

        {/* Right: Live Preview Panel */}
        {showPreview && (
          <aside className="preview-panel">
            <div className="preview-panel-header">
              <h3 className="preview-panel-title">
                <Eye size={18} />
                Live Preview
              </h3>
              <div className="preview-controls">
                <button 
                  className="preview-control-btn"
                  onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))}
                >
                  <ZoomOut size={16} />
                </button>
                <span className="preview-scale">{Math.round(previewScale * 100)}%</span>
                <button 
                  className="preview-control-btn"
                  onClick={() => setPreviewScale(Math.min(1, previewScale + 0.1))}
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* Template Selector */}
            <div className="template-selector">
              <button className="template-nav-btn" onClick={handlePrevTemplate}>
                <ChevronLeft size={18} />
              </button>
              <div className="template-info">
                <span className="template-name">{currentTemplateInfo?.name || 'Template'}</span>
                <span className="template-number">{selectedTemplate} / {templateIds.length}</span>
              </div>
              <button className="template-nav-btn" onClick={handleNextTemplate}>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="preview-content">
              <div 
                className="preview-wrapper"
                style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }}
              >
                <ResumeTemplate 
                  templateId={selectedTemplate} 
                  data={getPreviewData()} 
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Builder;