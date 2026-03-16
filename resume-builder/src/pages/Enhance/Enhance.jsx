import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  X,
  File,
  Check,
  Globe,
  Heart,
  FolderKanban,
  Link as LinkIcon,
  Github,
  ExternalLink
} from 'lucide-react';
import atsService from '../../services/atsService';
import { getTemplateSections, sectionLabels } from '../../templates/templateConfig';
import './Enhance.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Default empty template for new resumes
const getDefaultData = () => ({
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  codingProfiles: {
    github: '',
    leetcode: '',
    hackerrank: '',
    codechef: '',
    codeforces: '',
    kaggle: '',
    portfolio: ''
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  activities: [],
  hobbies: []
});

// Get initial data from location.state or localStorage
const getInitialData = (locationState) => {
  // First check if data was passed via navigation
  if (locationState?.parsedData) {
    return transformParsedData(locationState.parsedData);
  }
  
  // Then check localStorage
  const storedData = localStorage.getItem('parsedResumeData');
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      return transformParsedData(parsed);
    } catch (e) {
      console.error('Error parsing stored resume data:', e);
    }
  }
  
  // Return empty template if no data found
  return getDefaultData();
};

// Transform parsed data to match the form structure
const transformParsedData = (data) => {
  const defaultData = getDefaultData();
  
  return {
    personal: {
      fullName: data.personal?.fullName || data.fullName || '',
      email: data.personal?.email || data.email || '',
      phone: data.personal?.phone || data.phone || '',
      location: data.personal?.location || data.location || '',
      linkedin: data.personal?.linkedin || data.linkedin || '',
      website: data.personal?.website || data.website || '',
      summary: data.personal?.summary || data.summary || ''
    },
    codingProfiles: data.codingProfiles || defaultData.codingProfiles,
    experience: (data.experience || []).map((exp, index) => ({
      id: exp.id || Date.now() + index,
      jobTitle: exp.jobTitle || exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      description: exp.description || ''
    })),
    education: (data.education || []).map((edu, index) => ({
      id: edu.id || Date.now() + index,
      degree: edu.degree || '',
      institution: edu.institution || edu.school || '',
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa: edu.gpa || ''
    })),
    skills: data.skills || [],
    certifications: (data.certifications || []).map((cert, index) => ({
      id: cert.id || Date.now() + index,
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      credentialUrl: cert.credentialUrl || '',
      driveLink: cert.driveLink || ''
    })),
    languages: (data.languages || []).map((lang, index) => ({
      id: lang.id || Date.now() + index,
      language: typeof lang === 'string' ? lang : (lang.language || ''),
      proficiency: typeof lang === 'string' ? 'intermediate' : (lang.proficiency || 'intermediate')
    })),
    activities: (data.activities || []).map((act, index) => ({
      id: act.id || Date.now() + index,
      title: act.title || '',
      organization: act.organization || '',
      role: act.role || '',
      description: act.description || '',
      duration: act.duration || ''
    })),
    hobbies: data.hobbies || []
  };
};

const suggestedSkills = ['Marketing Automation', 'HubSpot', 'Data Analysis', 'A/B Testing', 'CRM', 'Copywriting'];
const suggestedHobbies = ['Reading', 'Photography', 'Traveling', 'Blogging', 'Fitness', 'Music'];

const proficiencyLevels = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'basic', label: 'Basic' }
];

const codingPlatforms = [
  { name: 'github', label: 'GitHub', placeholder: 'github.com/username' },
  { name: 'leetcode', label: 'LeetCode', placeholder: 'leetcode.com/username' },
  { name: 'hackerrank', label: 'HackerRank', placeholder: 'hackerrank.com/username' },
  { name: 'codechef', label: 'CodeChef', placeholder: 'codechef.com/users/username' },
  { name: 'codeforces', label: 'Codeforces', placeholder: 'codeforces.com/profile/username' },
  { name: 'kaggle', label: 'Kaggle', placeholder: 'kaggle.com/username' },
  { name: 'portfolio', label: 'Portfolio', placeholder: 'yourportfolio.com' }
];

// All available steps — always keep 'review' last
const ALL_ENHANCE_STEPS = [
  { id: 'personal',       label: 'Personal',       section: 'personal',       icon: User },
  { id: 'experience',    label: 'Experience',     section: 'experience',     icon: Briefcase },
  { id: 'education',     label: 'Education',      section: 'education',      icon: GraduationCap },
  { id: 'skills',        label: 'Skills',         section: 'skills',         icon: Code },
  { id: 'projects',      label: 'Projects',       section: 'projects',       icon: FolderKanban },
  { id: 'certifications',label: 'Certificates',   section: 'certifications', icon: Award },
  { id: 'languages',     label: 'Languages',      section: 'languages',      icon: Globe },
  { id: 'activities',    label: 'Activities',     section: 'activities',     icon: Heart },
  { id: 'review',        label: 'Review',         section: 'review',         icon: CheckCircle },
];

function Enhance() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = location.state?.fileName || 'resume.pdf';

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => getInitialData(location.state));
  const [newSkill, setNewSkill] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [score, setScore] = useState(0);
  const [prevAtsScore, setPrevAtsScore] = useState(() => {
    const prev = localStorage.getItem('prevAtsScore');
    return prev ? parseInt(prev) : null;
  });
  // Read selected template from localStorage (set when user picks a template)
  const selectedTemplate = parseInt(localStorage.getItem('selectedTemplate') || '1');

  // Dynamic steps based on selected template + student mode; always include 'review' last
  const steps = useMemo(() => {
    const templateSectionList = getTemplateSections(selectedTemplate);
    const isStudent = localStorage.getItem('isStudent') === 'true';
    const contentSteps = ALL_ENHANCE_STEPS.filter(
      s => s.section !== 'review'
        && templateSectionList.includes(s.section)
        && !(isStudent && s.section === 'experience')
    );
    return [...contentSteps, ALL_ENHANCE_STEPS.find(s => s.section === 'review')];
  }, [selectedTemplate]);

  // Clamp currentStep if template changes shrinks the step count
  useEffect(() => {
    setCurrentStep(prev => Math.min(prev, steps.length - 1));
  }, [steps.length]);

  const [loadingScore, setLoadingScore] = useState(false);

  useEffect(() => {
    if (steps[currentStep]?.section === 'review') {
      // Fetch fresh ATS score from AI analysis
      const fetchATSScore = async () => {
        setLoadingScore(true);
        try {
          const resumeId = localStorage.getItem('currentResumeId');
          if (resumeId) {
            // Use analyzeResume for fresh AI-powered ATS analysis
            const result = await atsService.analyzeResume(parseInt(resumeId), {
              useAI: true,
              phase: 'PHASE3',
              forceRefresh: true
            });
            if (result.success && result.data?.overallScore) {
              setScore(result.data.overallScore);
              localStorage.setItem('prevAtsScore', result.data.overallScore);
            } else {
              setScore(calculateBasicScore());
            }
          } else {
            setScore(calculateBasicScore());
          }
        } catch (error) {
          console.error('Error fetching ATS score:', error);
          setScore(calculateBasicScore());
        } finally {
          setLoadingScore(false);
        }
      };
      fetchATSScore();
    }
  }, [currentStep, formData]);

  // Calculate a basic score based on form completeness
  const calculateBasicScore = () => {
    let score = 0;
    const { personal, experience, education, skills, certifications, languages } = formData;
    
    // Personal info (30 points max)
    if (personal.fullName) score += 5;
    if (personal.email) score += 5;
    if (personal.phone) score += 5;
    if (personal.location) score += 5;
    if (personal.summary && personal.summary.length > 50) score += 10;
    
    // Experience (25 points max)
    if (experience.length > 0) {
      score += 10;
      if (experience.length >= 2) score += 10;
      if (experience.some(exp => exp.description && exp.description.length > 100)) score += 5;
    }
    
    // Education (20 points max)
    if (education.length > 0) {
      score += 15;
      if (education.some(edu => edu.gpa)) score += 5;
    }
    
    // Skills (15 points max)
    if (skills.length >= 3) score += 5;
    if (skills.length >= 5) score += 5;
    if (skills.length >= 8) score += 5;
    
    // Extras (10 points max)
    if (certifications.length > 0) score += 5;
    if (languages.length > 1) score += 5;
    
    return Math.min(score, 100);
  };

  const handlePersonalChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handleCodingProfileChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      codingProfiles: { ...prev.codingProfiles, [field]: value }
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (skill = newSkill) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Certification handlers
  const handleCertificationChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialUrl: '',
      driveLink: ''
    };
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const removeCertification = (id) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  // Language handlers
  const handleLanguageChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const addLanguage = () => {
    const newLang = {
      id: Date.now(),
      language: '',
      proficiency: 'intermediate'
    };
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const removeLanguage = (id) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  // Activity handlers
  const handleActivityChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map(act =>
        act.id === id ? { ...act, [field]: value } : act
      )
    }));
  };

  const addActivity = () => {
    const newActivity = {
      id: Date.now(),
      title: '',
      organization: '',
      role: '',
      description: '',
      duration: ''
    };
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  const removeActivity = (id) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  // Hobby handlers
  const addHobby = (hobby = newHobby) => {
    if (hobby.trim() && !formData.hobbies.includes(hobby.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobby.trim()]
      }));
      setNewHobby('');
    }
  };

  const removeHobby = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Accept both section-name string and numeric index
  const goToStep = (sectionOrIndex) => {
    if (typeof sectionOrIndex === 'string') {
      const idx = steps.findIndex(s => s.section === sectionOrIndex);
      if (idx !== -1) setCurrentStep(idx);
    } else {
      setCurrentStep(sectionOrIndex);
    }
  };

  const circumference = 2 * Math.PI * 58;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  // Render step content
  const renderStepContent = () => {
    switch (steps[currentStep]?.section) {
      case 'personal':
        return (
          <motion.div
            key="personal"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <User size={28} />
              </div>
              <div>
                <h2 className="step-title">Personal Information</h2>
                <p className="step-subtitle">Review and update your contact details</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.personal.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.personal.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.personal.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.personal.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.personal.linkedin}
                  onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Website (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.personal.website}
                  onChange={(e) => handlePersonalChange('website', e.target.value)}
                  placeholder="yourwebsite.com"
                />
              </div>
              <div className="form-group full">
                <label className="form-label">
                  Professional Summary
                  <button className="ai-enhance-btn">
                    <Sparkles size={12} />
                    AI Enhance
                  </button>
                </label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.personal.summary}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Coding Profiles Section */}
            <div className="section-divider">
              <Github size={16} />
              <span>Coding Profiles & Links</span>
            </div>

            <div className="form-grid">
              {codingPlatforms.map((platform) => (
                <div className="form-group" key={platform.name}>
                  <label className="form-label">{platform.label}</label>
                  <div className="input-with-icon">
                    <LinkIcon size={14} className="input-icon" />
                    <input
                      type="url"
                      className="form-input with-icon"
                      value={formData.codingProfiles[platform.name]}
                      onChange={(e) => handleCodingProfileChange(platform.name, e.target.value)}
                      placeholder={platform.placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            key="experience"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <Briefcase size={28} />
              </div>
              <div>
                <h2 className="step-title">Work Experience</h2>
                <p className="step-subtitle">Update your professional experience</p>
              </div>
            </div>

            {formData.experience.map((exp, index) => (
              <div key={exp.id} className="item-card">
                <div className="item-header">
                  <div className="item-number">
                    <span className="item-badge">{index + 1}</span>
                    <span className="item-label">Experience {index + 1}</span>
                  </div>
                  <div className="item-actions">
                    <button className="ai-enhance-btn">
                      <Sparkles size={12} />
                      Enhance
                    </button>
                    {formData.experience.length > 1 && (
                      <button
                        className="item-action-btn delete"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.jobTitle}
                      onChange={(e) => handleExperienceChange(exp.id, 'jobTitle', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                      placeholder="e.g., Jan 2020"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                      placeholder="e.g., Present"
                    />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Description & Achievements</label>
                    <textarea
                      className="form-input form-textarea"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                      rows={3}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="add-item-btn" onClick={addExperience}>
              <Plus size={18} />
              Add Another Experience
            </button>
          </motion.div>
        );

      case 'education':
        return (
          <motion.div
            key="education"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <GraduationCap size={28} />
              </div>
              <div>
                <h2 className="step-title">Education</h2>
                <p className="step-subtitle">Update your educational background</p>
              </div>
            </div>

            {formData.education.map((edu, index) => (
              <div key={edu.id} className="item-card">
                <div className="item-header">
                  <div className="item-number">
                    <span className="item-badge">{index + 1}</span>
                    <span className="item-label">Education {index + 1}</span>
                  </div>
                  <div className="item-actions">
                    {formData.education.length > 1 && (
                      <button
                        className="item-action-btn delete"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GPA (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.location}
                      onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="add-item-btn" onClick={addEducation}>
              <Plus size={18} />
              Add Another Education
            </button>
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div
            key="skills"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <Code size={28} />
              </div>
              <div>
                <h2 className="step-title">Skills</h2>
                <p className="step-subtitle">Add or remove skills from your profile</p>
              </div>
            </div>

            <div className="skills-container">
              <p className="skills-label">Your Skills</p>
              <div className="skills-tags">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button
                      className="skill-tag-remove"
                      onClick={() => removeSkill(skill)}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="skill-input-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type a skill and press Enter..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button className="skill-add-btn" onClick={() => addSkill()}>
                  <Plus size={18} />
                </button>
              </div>

              <div className="suggested-skills">
                <p className="suggested-label">
                  <Sparkles size={14} />
                  AI Suggested Skills
                </p>
                <div className="suggested-tags">
                  {suggestedSkills
                    .filter(skill => !formData.skills.includes(skill))
                    .map((skill, index) => (
                      <button
                        key={index}
                        className="suggested-tag"
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

      case 'certifications':
        return (
          <motion.div
            key="certifications"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <Award size={28} />
              </div>
              <div>
                <h2 className="step-title">Certifications</h2>
                <p className="step-subtitle">Add your professional certifications</p>
              </div>
            </div>

            {formData.certifications.map((cert, index) => (
              <div key={cert.id} className="item-card">
                <div className="item-header">
                  <div className="item-number">
                    <span className="item-badge">{index + 1}</span>
                    <span className="item-label">Certification {index + 1}</span>
                  </div>
                  <div className="item-actions">
                    {formData.certifications.length > 1 && (
                      <button
                        className="item-action-btn delete"
                        onClick={() => removeCertification(cert.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Certification Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cert.name}
                      onChange={(e) => handleCertificationChange(cert.id, 'name', e.target.value)}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issuing Organization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cert.issuer}
                      onChange={(e) => handleCertificationChange(cert.id, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Obtained</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cert.date}
                      onChange={(e) => handleCertificationChange(cert.id, 'date', e.target.value)}
                      placeholder="2023"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credential URL</label>
                    <div className="input-with-icon">
                      <ExternalLink size={14} className="input-icon" />
                      <input
                        type="url"
                        className="form-input with-icon"
                        value={cert.credentialUrl}
                        onChange={(e) => handleCertificationChange(cert.id, 'credentialUrl', e.target.value)}
                        placeholder="https://verify.cert.com/abc123"
                      />
                    </div>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Google Drive Link (Certificate)</label>
                    <div className="input-with-icon">
                      <LinkIcon size={14} className="input-icon" />
                      <input
                        type="url"
                        className="form-input with-icon"
                        value={cert.driveLink}
                        onChange={(e) => handleCertificationChange(cert.id, 'driveLink', e.target.value)}
                        placeholder="drive.google.com/file/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="add-item-btn" onClick={addCertification}>
              <Plus size={18} />
              Add Another Certification
            </button>
          </motion.div>
        );

      case 'languages':
        return (
          <motion.div
            key="languages"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <Globe size={28} />
              </div>
              <div>
                <h2 className="step-title">Languages</h2>
                <p className="step-subtitle">Add languages you speak</p>
              </div>
            </div>

            {formData.languages.map((lang, index) => (
              <div key={lang.id} className="item-card language-card">
                <div className="form-grid language-grid">
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <input
                      type="text"
                      className="form-input"
                      value={lang.language}
                      onChange={(e) => handleLanguageChange(lang.id, 'language', e.target.value)}
                      placeholder="English"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proficiency</label>
                    <select
                      className="form-input form-select"
                      value={lang.proficiency}
                      onChange={(e) => handleLanguageChange(lang.id, 'proficiency', e.target.value)}
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
                      className="item-action-btn delete inline-delete"
                      onClick={() => removeLanguage(lang.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button className="add-item-btn" onClick={addLanguage}>
              <Plus size={18} />
              Add Another Language
            </button>
          </motion.div>
        );

      case 'activities':
        return (
          <motion.div
            key="activities"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <Heart size={28} />
              </div>
              <div>
                <h2 className="step-title">Activities & Hobbies</h2>
                <p className="step-subtitle">Add extra-curricular activities and interests</p>
              </div>
            </div>

            {/* Extra-curricular Activities */}
            <div className="subsection">
              <h3 className="subsection-title">Extra-Curricular Activities</h3>
              {formData.activities.map((activity, index) => (
                <div key={activity.id} className="item-card">
                  <div className="item-header">
                    <div className="item-number">
                      <span className="item-badge">{index + 1}</span>
                      <span className="item-label">Activity {index + 1}</span>
                    </div>
                    <div className="item-actions">
                      {formData.activities.length > 1 && (
                        <button
                          className="item-action-btn delete"
                          onClick={() => removeActivity(activity.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Activity/Club Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={activity.title}
                        onChange={(e) => handleActivityChange(activity.id, 'title', e.target.value)}
                        placeholder="Coding Club"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Organization</label>
                      <input
                        type="text"
                        className="form-input"
                        value={activity.organization}
                        onChange={(e) => handleActivityChange(activity.id, 'organization', e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Role</label>
                      <input
                        type="text"
                        className="form-input"
                        value={activity.role}
                        onChange={(e) => handleActivityChange(activity.id, 'role', e.target.value)}
                        placeholder="President / Member"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        className="form-input"
                        value={activity.duration}
                        onChange={(e) => handleActivityChange(activity.id, 'duration', e.target.value)}
                        placeholder="2020 - 2022"
                      />
                    </div>
                    <div className="form-group full">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input form-textarea"
                        value={activity.description}
                        onChange={(e) => handleActivityChange(activity.id, 'description', e.target.value)}
                        placeholder="Describe your involvement and achievements..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button className="add-item-btn" onClick={addActivity}>
                <Plus size={18} />
                Add Another Activity
              </button>
            </div>

            {/* Hobbies & Interests */}
            <div className="subsection">
              <h3 className="subsection-title">Hobbies & Interests</h3>
              <div className="skills-container">
                <div className="skills-tags">
                  {formData.hobbies.length === 0 ? (
                    <p className="empty-message">No hobbies added yet.</p>
                  ) : (
                    formData.hobbies.map((hobby, index) => (
                      <span key={index} className="skill-tag hobby-tag">
                        {hobby}
                        <button
                          className="skill-tag-remove"
                          onClick={() => removeHobby(hobby)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="skill-input-wrapper">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type a hobby and press Enter..."
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                  />
                  <button className="skill-add-btn" onClick={() => addHobby()}>
                    <Plus size={18} />
                  </button>
                </div>

                <div className="suggested-skills">
                  <p className="suggested-label">Suggested Hobbies</p>
                  <div className="suggested-tags">
                    {suggestedHobbies
                      .filter(hobby => !formData.hobbies.includes(hobby))
                      .map((hobby, index) => (
                        <button
                          key={index}
                          className="suggested-tag"
                          onClick={() => addHobby(hobby)}
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

      case 'review':
        return (
          <motion.div
            key="review"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
          >
            <div className="step-header">
              <div className="step-icon">
                <CheckCircle size={28} />
              </div>
              <div>
                <h2 className="step-title">Review & Finish</h2>
                <p className="step-subtitle">Review your enhanced resume before proceeding</p>
              </div>
            </div>

            {/* Score Card */}
            <div className="score-card">
              <h3 className="score-title">
                <Sparkles size={18} />
                Your Enhanced Resume Score
              </h3>
              <div className="score-circle-wrapper">
                <div className="score-circle">
                  <svg width="140" height="140">
                    <defs>
                      <linearGradient id="enhanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    <circle className="score-bg" cx="70" cy="70" r="58" />
                    <circle
                      className="score-progress"
                      cx="70"
                      cy="70"
                      r="58"
                      strokeDasharray={strokeDasharray}
                    />
                  </svg>
                  <div className="score-text">
                    <span className="score-value">{score}</span>
                    <span className="score-label">Score</span>
                  </div>
                </div>
              </div>
              {prevAtsScore !== null && score !== null && (
                <p style={{ marginTop: 8 }}>
                  <strong>Score Difference:</strong> {score - prevAtsScore > 0 ? '+' : ''}{score - prevAtsScore}
                  <span style={{ color: score - prevAtsScore > 0 ? '#10b981' : score - prevAtsScore < 0 ? '#ef4444' : '#6b7280', marginLeft: 8 }}>
                    {score - prevAtsScore > 0 ? 'Improved' : score - prevAtsScore < 0 ? 'Decreased' : 'No Change'}
                  </span>
                </p>
              )}
              <p className="score-message">
                Great job! Your resume is now optimized for ATS systems.
              </p>
            </div>

            {/* Review Sections */}
            <div className="review-section">
              <div className="review-card">
                <div className="review-header">
                  <div className="review-title">
                    <div className="review-icon"><User size={16} /></div>
                    Personal Information
                  </div>
                  <button className="review-edit-btn" onClick={() => goToStep('personal')}>Edit</button>
                </div>
                <div className="review-content">
                  <p><strong>{formData.personal.fullName}</strong></p>
                  <p>{formData.personal.email} • {formData.personal.phone}</p>
                  <p>{formData.personal.location}</p>
                </div>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="review-title">
                    <div className="review-icon"><Briefcase size={16} /></div>
                    Experience ({formData.experience.length})
                  </div>
                  <button className="review-edit-btn" onClick={() => goToStep('experience')}>Edit</button>
                </div>
                <div className="review-content">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="review-item">
                      <p className="review-item-title">{exp.jobTitle} at {exp.company}</p>
                      <p className="review-item-subtitle">{exp.startDate} - {exp.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="review-title">
                    <div className="review-icon"><GraduationCap size={16} /></div>
                    Education ({formData.education.length})
                  </div>
                  <button className="review-edit-btn" onClick={() => goToStep('education')}>Edit</button>
                </div>
                <div className="review-content">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="review-item">
                      <p className="review-item-title">{edu.degree}</p>
                      <p className="review-item-subtitle">{edu.institution} • {edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="review-title">
                    <div className="review-icon"><Code size={16} /></div>
                    Skills ({formData.skills.length})
                  </div>
                  <button className="review-edit-btn" onClick={() => goToStep('skills')}>Edit</button>
                </div>
                <div className="review-content">
                  <div className="review-skills">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="review-skill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="review-title">
                    <div className="review-icon"><Award size={16} /></div>
                    Certifications ({formData.certifications.length})
                  </div>
                  <button className="review-edit-btn" onClick={() => goToStep('certifications')}>Edit</button>
                </div>
                <div className="review-content">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="review-item">
                      <p className="review-item-title">{cert.name || 'Untitled Certification'}</p>
                      <p className="review-item-subtitle">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="review-title">
                    <div className="review-icon"><Globe size={16} /></div>
                    Languages ({formData.languages.length})
                  </div>
                  <button className="review-edit-btn" onClick={() => goToStep('languages')}>Edit</button>
                </div>
                <div className="review-content">
                  <div className="review-skills">
                    {formData.languages.map((lang, index) => (
                      <span key={index} className="review-skill">{lang.language} ({lang.proficiency})</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="review-title">
                    <div className="review-icon"><Heart size={16} /></div>
                    Activities & Hobbies
                  </div>
                  <button className="review-edit-btn" onClick={() => goToStep('activities')}>Edit</button>
                </div>
                <div className="review-content">
                  {formData.activities.filter(a => a.title).map((activity, index) => (
                    <div key={index} className="review-item">
                      <p className="review-item-title">{activity.title}</p>
                      <p className="review-item-subtitle">{activity.role} at {activity.organization}</p>
                    </div>
                  ))}
                  {formData.hobbies.length > 0 && (
                    <div className="review-skills" style={{ marginTop: '0.5rem' }}>
                      {formData.hobbies.map((hobby, index) => (
                        <span key={index} className="review-skill">{hobby}</span>
                      ))}
                    </div>
                  )}
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
    <div className="enhance-container">
      {/* Background */}
      <div className="enhance-background">
        <div className="enhance-blob enhance-blob-1"></div>
        <div className="enhance-blob enhance-blob-2"></div>
      </div>

      {/* Header */}
      <header className="enhance-header">
        <Link to="/upload" className="enhance-logo">
          <div className="enhance-logo-icon">
            <FileText size={20} />
          </div>
          <span className="enhance-logo-text">ResumeAI</span>
        </Link>

        <div className="enhance-header-info">
          <div className="file-badge">
            <File size={16} />
            {fileName}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="enhance-main">
        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`progress-step ${
                index === currentStep ? 'active' : ''
              } ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {index < currentStep ? (
                  <Check size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <span className="step-label">{step.label}</span>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-card">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="step-navigation">
            {currentStep > 0 ? (
              <button className="nav-btn secondary" onClick={prevStep}>
                <ArrowLeft size={18} />
                Previous
              </button>
            ) : (
              <Link to="/upload">
                <button className="nav-btn secondary">
                  <ArrowLeft size={18} />
                  Back to Upload
                </button>
              </Link>
            )}

            {currentStep < steps.length - 1 ? (
              <button className="nav-btn primary" onClick={nextStep}>
                Next Step
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="nav-btn primary"
                onClick={() => navigate('/templates')}
              >
                Choose Template
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Enhance;
