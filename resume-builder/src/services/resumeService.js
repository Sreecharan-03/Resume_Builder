
import api from './api';

// Helper function to safely parse JSON
const safeJsonParse = (str, defaultValue = []) => {
  if (!str) return defaultValue;
  if (typeof str === 'object') return str; // Already parsed
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

// Transform frontend nested data to backend flat format
const transformToBackendFormat = (formData, title) => {
  const personal = formData.personal || {};
  const codingProfiles = formData.codingProfiles || {};
  
  return {
    title: title || `${personal.firstName || ''} ${personal.lastName || ''}'s Resume`.trim() || 'Untitled Resume',
    targetRole: personal.title || '',
    fullName: `${personal.firstName || ''} ${personal.lastName || ''}`.trim(),
    email: personal.email || '',
    phone: personal.phone || '',
    location: personal.location || '',
    summary: personal.summary || '',
    skills: JSON.stringify(formData.skills || []),
    experience: JSON.stringify((formData.experience || []).map(exp => ({
      company: exp.company || '',
      position: exp.position || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.current ? 'Present' : (exp.endDate || ''),
      description: exp.description || ''
    }))),
    education: JSON.stringify((formData.education || []).map(edu => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.current ? 'Present' : (edu.endDate || ''),
      gpa: edu.gpa || ''
    }))),
    projects: JSON.stringify((formData.projects || []).map(proj => ({
      name: proj.name || '',
      description: proj.description || '',
      technologies: proj.technologies || '',
      liveLink: proj.liveLink || '',
      githubLink: proj.githubLink || ''
    }))),
    certifications: JSON.stringify((formData.certifications || []).map(cert => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || ''
    }))),
    templateId: formData.templateId || '1',
    // Include additional data for full resume
    codingProfiles: JSON.stringify(codingProfiles),
    languages: JSON.stringify(formData.languages || []),
    activities: JSON.stringify(formData.activities || []),
    hobbies: JSON.stringify(formData.hobbies || [])
  };
};

// Transform backend flat data to frontend nested format
const transformToFrontendFormat = (backendData) => {
  if (!backendData) return null;
  
  // Parse name into first and last
  const nameParts = (backendData.fullName || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Parse JSON fields
  const skills = safeJsonParse(backendData.skills, []);
  const experience = safeJsonParse(backendData.experience, []);
  const education = safeJsonParse(backendData.education, []);
  const projects = safeJsonParse(backendData.projects, []);
  const certifications = safeJsonParse(backendData.certifications, []);
  const codingProfiles = safeJsonParse(backendData.codingProfiles, {});
  const languages = safeJsonParse(backendData.languages, []);
  const activities = safeJsonParse(backendData.activities, []);
  const hobbies = safeJsonParse(backendData.hobbies, []);
  
  return {
    id: backendData.id,
    title: backendData.title,
    status: backendData.status,
    atsScore: backendData.atsScore,
    templateId: backendData.templateId,
    createdAt: backendData.createdAt,
    updatedAt: backendData.updatedAt,
    content: {
      personal: {
        firstName,
        lastName,
        email: backendData.email || '',
        phone: backendData.phone || '',
        location: backendData.location || '',
        title: backendData.targetRole || '',
        summary: backendData.summary || ''
      },
      codingProfiles: {
        linkedin: codingProfiles.linkedin || '',
        github: codingProfiles.github || '',
        portfolio: codingProfiles.portfolio || '',
        leetcode: codingProfiles.leetcode || '',
        hackerrank: codingProfiles.hackerrank || '',
        codechef: codingProfiles.codechef || '',
        codeforces: codingProfiles.codeforces || '',
        kaggle: codingProfiles.kaggle || ''
      },
      education: education.length > 0 ? education.map((edu, idx) => ({
        id: idx + 1,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate === 'Present' ? '' : (edu.endDate || ''),
        current: edu.endDate === 'Present',
        gpa: edu.gpa || ''
      })) : [{ id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: '' }],
      experience: experience.length > 0 ? experience.map((exp, idx) => ({
        id: idx + 1,
        company: exp.company || '',
        position: exp.position || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate === 'Present' ? '' : (exp.endDate || ''),
        current: exp.endDate === 'Present',
        description: exp.description || ''
      })) : [{ id: 1, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
      skills: Array.isArray(skills) ? skills : [],
      projects: projects.length > 0 ? projects.map((proj, idx) => ({
        id: idx + 1,
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || '',
        liveLink: proj.liveLink || '',
        githubLink: proj.githubLink || ''
      })) : [{ id: 1, name: '', description: '', technologies: '', liveLink: '', githubLink: '' }],
      certifications: certifications.length > 0 ? certifications.map((cert, idx) => ({
        id: idx + 1,
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
        credentialId: cert.credentialId || '',
        credentialUrl: cert.credentialUrl || '',
        driveLink: cert.driveLink || ''
      })) : [{ id: 1, name: '', issuer: '', date: '', credentialId: '', credentialUrl: '', driveLink: '' }],
      languages: languages.length > 0 ? languages.map((lang, idx) => ({
        id: idx + 1,
        language: lang.language || '',
        proficiency: lang.proficiency || 'intermediate'
      })) : [{ id: 1, language: '', proficiency: 'intermediate' }],
      activities: activities.length > 0 ? activities.map((act, idx) => ({
        id: idx + 1,
        title: act.title || '',
        organization: act.organization || '',
        role: act.role || '',
        description: act.description || '',
        startDate: act.startDate || '',
        endDate: act.endDate || ''
      })) : [{ id: 1, title: '', organization: '', role: '', description: '', startDate: '', endDate: '' }],
      hobbies: Array.isArray(hobbies) ? hobbies : []
    }
  };
};

const resumeService = {
  // Create a new resume
  createResume: async (resumeData) => {
    try {
      // Transform to backend format if content is provided
      const dataToSend = resumeData.content 
        ? transformToBackendFormat(resumeData.content, resumeData.title)
        : resumeData;
      
      const response = await api.post('/resume/create', dataToSend);
      if (response.data.success) {
        // Transform response back to frontend format
        const transformedData = transformToFrontendFormat(response.data.data);
        return { success: true, data: transformedData };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create resume';
      return { success: false, message };
    }
  },

  // Get a specific resume
  getResume: async (id) => {
    try {
      const response = await api.get(`/resume/${id}`);
      if (response.data.success) {
        // Transform response to frontend format
        const transformedData = transformToFrontendFormat(response.data.data);
        return { success: true, data: transformedData };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get resume';
      return { success: false, message };
    }
  },

  // Update a resume
  updateResume: async (id, resumeData) => {
    try {
      // Transform to backend format if content is provided
      const dataToSend = resumeData.content 
        ? transformToBackendFormat(resumeData.content, resumeData.title)
        : resumeData;
      
      const response = await api.put(`/resume/${id}`, dataToSend);
      if (response.data.success) {
        // Transform response back to frontend format
        const transformedData = transformToFrontendFormat(response.data.data);
        return { success: true, data: transformedData };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update resume';
      return { success: false, message };
    }
  },

  // Delete a resume
  deleteResume: async (id) => {
    try {
      const response = await api.delete(`/resume/${id}`);
      if (response.data.success) {
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete resume';
      return { success: false, message };
    }
  },

  // Get all resumes for the logged-in user
  getAllResumes: async () => {
    try {
      const response = await api.get('/resume/all');
      if (response.data.success) {
        // Transform each resume to frontend format
        const resumes = response.data.data.resumes || response.data.data;
        const transformedResumes = Array.isArray(resumes) 
          ? resumes.map(r => transformToFrontendFormat(r))
          : [];
        return { 
          success: true, 
          data: {
            resumes: transformedResumes,
            total: transformedResumes.length
          }
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get resumes';
      return { success: false, message };
    }
  },

  // Save resume to local storage (for draft purposes)
  saveToLocalStorage: (data) => {
    // Save to resumeData key for backward compatibility
    localStorage.setItem('resumeData', JSON.stringify(data));
  },

  // Get resume from local storage
  getFromLocalStorage: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  // Clear local storage data
  clearLocalStorage: (key) => {
    localStorage.removeItem(key);
  },

  // Create a draft resume
  createDraft: async (resumeData) => {
    try {
      // Transform to backend format if content is provided
      const dataToSend = resumeData.content 
        ? transformToBackendFormat(resumeData.content, resumeData.title)
        : resumeData;
      
      const response = await api.post('/resume/draft', dataToSend);
      if (response.data.success) {
        const transformedData = transformToFrontendFormat(response.data.data);
        return { success: true, data: transformedData };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create draft';
      return { success: false, message };
    }
  },

  // Upload existing resume
  uploadResume: async (resumeData) => {
    try {
      const response = await api.post('/resume/upload', resumeData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload resume';
      return { success: false, message };
    }
  },

  // Finalize resume
  finalizeResume: async (id) => {
    try {
      const response = await api.post(`/resume/finalize/${id}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to finalize resume';
      return { success: false, message };
    }
  },

  // Get resumes by user ID
  getResumesByUserId: async (userId) => {
    try {
      const response = await api.get(`/resume/user/${userId}`);
      if (response.data.success) {
        // Transform each resume to frontend format
        const resumes = response.data.data.resumes || response.data.data;
        const transformedResumes = Array.isArray(resumes) 
          ? resumes.map(r => transformToFrontendFormat(r))
          : [];
        return { 
          success: true, 
          data: {
            resumes: transformedResumes,
            total: transformedResumes.length
          }
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get resumes';
      return { success: false, message };
    }
  },

  // Upload and parse resume file (PDF, DOC, DOCX)
  uploadAndParseResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/resume/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return { success: true, data: response.data.data, rawText: response.data.rawText };
      }
      return { success: false, message: response.data.error || 'Failed to parse resume' };
    } catch (error) {
      // Build a more informative error message for debugging
      const apiError = error.response?.data || {};
      let message = apiError.error || apiError.message || error.message || 'Failed to upload and parse resume';
      if (!error.response) {
        message = 'Cannot reach backend server. Make sure backend is running on http://localhost:8083.';
      }
      if (error.response?.status === 403) {
        message = 'You are not authorized to upload resumes. Please log in again.';
      }
      console.error('uploadAndParseResume error:', { message, apiError, error });
      return { success: false, message };
    }
  },
};

export default resumeService;
