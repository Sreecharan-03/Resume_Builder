import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
export const ResumeContext = createContext();

// Default resume data structure
const defaultResumeData = {
  personal: {
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    linkedin: '',
    github: '',
    website: ''
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
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  activities: [],
  hobbies: []
};

// Provider component
export const ResumeProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('resumeData');
      return saved ? JSON.parse(saved) : defaultResumeData;
    } catch {
      return defaultResumeData;
    }
  });

  // Selected template ID
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedTemplate');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Template customization options
  const [templateOptions, setTemplateOptions] = useState(() => {
    try {
      const saved = localStorage.getItem('templateOptions');
      return saved ? JSON.parse(saved) : {
        primaryColor: '#2563eb',
        accentColor: '#3b82f6',
        fontFamily: 'Inter',
        fontSize: 'medium'
      };
    } catch {
      return {
        primaryColor: '#2563eb',
        accentColor: '#3b82f6',
        fontFamily: 'Inter',
        fontSize: 'medium'
      };
    }
  });

  // Trigger for refresh resume list across app
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('selectedTemplate', selectedTemplate.toString());
  }, [selectedTemplate]);

  useEffect(() => {
    localStorage.setItem('templateOptions', JSON.stringify(templateOptions));
  }, [templateOptions]);

  // Helper function to update personal info
  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
        // Auto-update fullName when firstName or lastName changes
        fullName: field === 'firstName' 
          ? `${value} ${prev.personal.lastName}`.trim()
          : field === 'lastName'
          ? `${prev.personal.firstName} ${value}`.trim()
          : prev.personal.fullName
      }
    }));
  };

  // Helper function to update coding profiles
  const updateCodingProfiles = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      codingProfiles: { ...prev.codingProfiles, [field]: value },
      // Also sync to personal for template compatibility
      personal: {
        ...prev.personal,
        linkedin: field === 'linkedin' ? value : prev.personal.linkedin,
        github: field === 'github' ? value : prev.personal.github,
        website: field === 'portfolio' ? value : prev.personal.website
      }
    }));
  };

  // Helper function to update array sections (education, experience, etc.)
  const updateArrayItem = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Helper function to add item to array section
  const addArrayItem = (section, item) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: Date.now() }]
    }));
  };

  // Helper function to remove item from array section
  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Helper function to add skill
  const addSkill = (skill) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  // Helper function to remove skill
  const removeSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Helper function to add hobby
  const addHobby = (hobby) => {
    if (hobby.trim() && !resumeData.hobbies.includes(hobby.trim())) {
      setResumeData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobby.trim()]
      }));
    }
  };

  // Helper function to remove hobby
  const removeHobby = (hobby) => {
    setResumeData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
  };

  // Reset resume data
  const resetResumeData = () => {
    setResumeData(defaultResumeData);
    setSelectedTemplate(1);
  };

  // Load resume data (e.g., from API)
  const loadResumeData = (data) => {
    setResumeData(prev => ({ ...prev, ...data }));
  };

  // Trigger refresh of resume list across the app
  const triggerResumeListRefresh = () => {
    const updateTimestamp = Date.now().toString();
    localStorage.setItem('resumeLastUpdatedAt', updateTimestamp);
    window.dispatchEvent(new CustomEvent('resume-updated', { detail: { ts: updateTimestamp } }));
    setRefreshTrigger(prev => prev + 1);
  };

  // Get data formatted for templates
  const getTemplateData = () => {
    return {
      ...resumeData,
      personal: {
        ...resumeData.personal,
        fullName: resumeData.personal.fullName || 
          `${resumeData.personal.firstName} ${resumeData.personal.lastName}`.trim()
      }
    };
  };

  const value = {
    // State
    resumeData,
    selectedTemplate,
    templateOptions,
    refreshTrigger,
    
    // Setters
    setResumeData,
    setSelectedTemplate,
    setTemplateOptions,
    
    // Helper functions
    updatePersonal,
    updateCodingProfiles,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    addSkill,
    removeSkill,
    addHobby,
    removeHobby,
    resetResumeData,
    loadResumeData,
    triggerResumeListRefresh,
    getTemplateData
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook to use the resume context
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export default ResumeContext;
