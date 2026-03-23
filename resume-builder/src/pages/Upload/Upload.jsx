import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';
import { resumeService, atsService } from '../../services';
import { 
  FileText, 
  Upload as UploadIcon, 
  File,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
  FileType,
  AlertCircle,
  Target,
  TrendingUp,
  Loader
} from 'lucide-react';
import './Upload.css';

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

function Upload() {
  const navigate = useNavigate();
  const { triggerResumeListRefresh } = useResume();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  // ATS score and parsed data state
  const [atsScore, setAtsScore] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState(null);
  const [atsSuggestions, setAtsSuggestions] = useState([]);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
    } else {
      setError('Please upload a PDF, DOC, or DOCX file');
    }
  };

  const handleFileSelect = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
    } else if (selectedFile) {
      setError('Please upload a PDF, DOC, or DOCX file');
    }
  };

  const isValidFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const filename = file.name.toLowerCase();
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => filename.endsWith(ext));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setAtsScore(null);
    setAtsError(null);
    setAtsSuggestions([]);
    setSaveStatus({ type: '', message: '' });
    setPendingFormData(null);
    setSavedResumeId(null);
    setUploadProgress(10);

    try {
      // Step 1: Upload & parse resume
      setUploadProgress(25);
      const result = await resumeService.uploadAndParseResume(file);
      setUploadProgress(50);

      if (!result.success) {
        setError(result.message || 'Failed to parse resume. Please try again.');
        setUploadProgress(0);
        return;
      }

      // Step 2: Transform parsed data to Builder format
      const parsedData = result.data || {};
      const formData = transformParsedDataToFormData(parsedData);
      setPendingFormData(formData);

      if (!parsedData || Object.keys(parsedData).length === 0) {
        setError('Resume could not be fully parsed. You can still proceed and edit manually.');
      }

      setUploadProgress(65);

      // Step 3: Save resume to backend to get a resumeId for ATS analysis
      let resumeId = null;
      try {
        const jobCtx = JSON.parse(localStorage.getItem('jobContext') || '{}');
        const saveResult = await resumeService.createResume({
          title: `${formData.personal.firstName} ${formData.personal.lastName}`.trim() || 'Uploaded Resume',
          content: formData
        });
        if (saveResult.success && saveResult.data?.id) {
          resumeId = saveResult.data.id;
          setSavedResumeId(resumeId);
          localStorage.setItem('currentResumeId', resumeId.toString());
          // Trigger refresh of resume list across the app
          triggerResumeListRefresh();
          setSaveStatus({
            type: 'success',
            message: 'Resume saved successfully. It will appear in Dashboard.'
          });
        } else {
          setSaveStatus({
            type: 'error',
            message: saveResult?.message || 'Resume was parsed but could not be saved to Dashboard.'
          });
        }
      } catch (saveErr) {
        console.warn('Could not save resume to backend:', saveErr);
        setSaveStatus({
          type: 'error',
          message: 'Resume was parsed but could not be saved to Dashboard.'
        });
      }

      setUploadProgress(80);

      // Step 4: Call ATS AI analysis
      setAtsLoading(true);
      try {
        if (resumeId) {
          const jobCtx = JSON.parse(localStorage.getItem('jobContext') || '{}');
          const atsResult = await atsService.analyzeResume(resumeId, {
            phase: 'PHASE3',
            useAI: true,
            targetRole: jobCtx?.role || null,
            jobDescription: jobCtx?.jobDescription || null
          });
          if (atsResult.success && atsResult.data) {
            setAtsScore(atsResult.data.overallScore ?? null);
            setAtsSuggestions(
              atsResult.data.improvementSuggestions ||
              atsResult.data.recommendations ||
              []
            );
          } else {
            setAtsError('AI scoring unavailable — showing local estimate.');
            setAtsScore(calculateLocalScore(formData));
          }
        } else {
          // No resumeId: fallback to local score
          setAtsError('Could not save resume — showing local estimate.');
          setAtsScore(calculateLocalScore(formData));
        }
      } catch (atsErr) {
        console.warn('ATS analysis failed:', atsErr);
        setAtsError('AI scoring unavailable — showing local estimate.');
        setAtsScore(calculateLocalScore(formData));
      } finally {
        setAtsLoading(false);
      }

      // Save formData to localStorage for Builder
      localStorage.setItem('parsedResumeData', JSON.stringify(formData));
      localStorage.setItem('resumeSource', 'upload');

      setUploadProgress(100);
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred while processing your resume. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Local score estimate based on data completeness
  const calculateLocalScore = (fd) => {
    let score = 0;
    const p = fd?.personal || {};
    if (p.firstName || p.lastName) score += 10;
    if (p.email) score += 10;
    if (p.phone) score += 5;
    if (p.location) score += 5;
    if (p.summary && p.summary.length > 30) score += 10;
    const exp = (fd?.experience || []).filter(e => e.company || e.position);
    if (exp.length > 0) score += 15;
    if (exp.length >= 2) score += 10;
    const edu = (fd?.education || []).filter(e => e.institution || e.degree);
    if (edu.length > 0) score += 10;
    const skills = fd?.skills || [];
    if (skills.length >= 3) score += 5;
    if (skills.length >= 7) score += 5;
    const proj = (fd?.projects || []).filter(p => p.name);
    if (proj.length > 0) score += 5;
    if (proj.length >= 2) score += 5;
    return Math.min(score, 100);
  };

  // Proceed to builder after user reviews ATS score
  const handleContinue = () => {
    const dataToPass = pendingFormData;
    if (!dataToPass) return;
    localStorage.setItem('parsedResumeData', JSON.stringify(dataToPass));
    localStorage.setItem('resumeSource', 'upload');
    const selectedTemplate = localStorage.getItem('selectedTemplate') || 1;
    navigate('/builder', {
      state: {
        parsedData: dataToPass,
        source: 'upload',
        fileName: file?.name || '',
        templateId: parseInt(selectedTemplate)
      }
    });
  };

  // Transform parsed resume data to match Builder's formData structure
  const transformParsedDataToFormData = (parsed) => {
    // Split full name into first and last name
    const nameParts = (parsed.fullName || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Extract coding profiles from parsed data
    const codingProfiles = parsed.codingProfiles || {};

    const fullName = `${firstName} ${lastName}`.trim();

    return {
      personal: {
        fullName,
        firstName,
        lastName,
        email: parsed.email || '',
        phone: parsed.phone || '',
        location: parsed.location || '',
        title: '',
        summary: parsed.summary || ''
      },
      codingProfiles: {
        linkedin: parsed.linkedin || '',
        github: parsed.github || '',
        portfolio: parsed.portfolio || '',
        leetcode: codingProfiles.leetcode || '',
        hackerrank: codingProfiles.hackerrank || '',
        codechef: codingProfiles.codechef || '',
        codeforces: codingProfiles.codeforces || '',
        kaggle: codingProfiles.kaggle || ''
      },
      education: (parsed.education && parsed.education.length > 0) 
        ? parsed.education.map((edu, idx) => ({
            id: idx + 1,
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: edu.startDate || edu.dates?.split('-')[0]?.trim() || '',
            endDate: edu.endDate || edu.dates?.split('-')[1]?.trim() || '',
            current: (edu.endDate || '').toLowerCase().includes('present'),
            gpa: edu.grade || edu.gpa || '',
            location: edu.location || ''
          })).slice(0, 5) 
        : [{ id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: '' }],
      experience: (parsed.experience && parsed.experience.length > 0) 
        ? parsed.experience.map((exp, idx) => ({
            id: idx + 1,
            company: exp.company || exp.employer || '',
            position: exp.position || exp.jobTitle || exp.title || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: (exp.endDate || '').toLowerCase().includes('present'),
            description: exp.description || exp.summary || ''
          })).slice(0, 5) 
        : [{ id: 1, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
      skills: parsed.skills || [],
      projects: (parsed.projects && parsed.projects.length > 0) 
        ? parsed.projects.map((proj, idx) => ({
            id: idx + 1,
            name: proj.name || '',
            description: proj.description || '',
            technologies: proj.technologies || '',
            liveLink: proj.liveLink || proj.link || '',
            githubLink: proj.githubLink || proj.github || ''
          })).slice(0, 5) 
        : [{ id: 1, name: '', description: '', technologies: '', liveLink: '', githubLink: '' }],
      certifications: (parsed.certifications && parsed.certifications.length > 0) 
        ? parsed.certifications.map((cert, idx) => ({
            id: idx + 1,
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
            credentialId: cert.credentialId || '',
            credentialUrl: cert.credentialUrl || '',
            driveLink: cert.driveLink || ''
          })).slice(0, 5) 
        : [{ id: 1, name: '', issuer: '', date: '', credentialId: '', credentialUrl: '', driveLink: '' }],
      languages: (parsed.languages && parsed.languages.length > 0)
        ? parsed.languages.map((lang, idx) => ({
            id: idx + 1,
            language: lang.language || '',
            proficiency: lang.proficiency || 'intermediate'
          })).slice(0, 5)
        : [{ id: 1, language: '', proficiency: 'intermediate' }],
      activities: (parsed.achievements && parsed.achievements.length > 0)
        ? parsed.achievements.map((ach, idx) => ({
            id: idx + 1,
            title: ach,
            organization: '',
            role: '',
            description: '',
            startDate: '',
            endDate: ''
          })).slice(0, 5)
        : [{ id: 1, title: '', organization: '', role: '', description: '', startDate: '', endDate: '' }],
      hobbies: parsed.hobbies || []
    };
  };

  const features = [
    {
      icon: <Zap size={24} />,
      title: 'AI-Powered Extraction',
      desc: 'Our AI accurately extracts all your resume content'
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Private',
      desc: 'Your data is encrypted and never shared'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Smart Enhancement',
      desc: 'Get AI suggestions to improve your resume'
    }
  ];

  const scoreColor = atsScore !== null
    ? atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#fbbf24' : '#ef4444'
    : '#6b7280';

  const scoreLabel = atsScore !== null
    ? atsScore >= 80 ? 'Excellent — ATS Ready!' : atsScore >= 60 ? 'Good — Minor improvements needed' : 'Needs Improvement'
    : '';

  return (
    <div className="upload-container">
      {/* Background */}
      <div className="upload-background">
        <div className="upload-blob upload-blob-1"></div>
        <div className="upload-blob upload-blob-2"></div>
      </div>

      {/* Header */}
      <header className="upload-header">
        <Link to="/dashboard" className="upload-logo">
          <div className="upload-logo-icon">
            <FileText size={20} />
          </div>
          <span className="upload-logo-text">ResumeAI</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="upload-main">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Page Header */}
          <motion.div variants={fadeInUp} className="page-header">
            <h1 className="page-title">
              Upload Your <span className="gradient-text">Resume</span>
            </h1>
            <p className="page-subtitle">
              Upload your existing resume and let our AI enhance it for better results
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div variants={fadeInUp} className="upload-zone-wrapper">
            <div
              className={`upload-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              <div className="upload-zone-icon">
                {file ? <CheckCircle size={40} /> : <UploadIcon size={40} />}
              </div>


              {file ? (
                <>
                  <p className="upload-zone-text">File Ready!</p>
                  <p className="upload-zone-subtext">
                    Your resume is ready to be processed
                  </p>
                </>
              ) : (
                <>
                  <p className="upload-zone-text">Drag & Drop your resume here</p>
                  <p className="upload-zone-subtext">PDF, DOC, or DOCX</p>
                  <span className="format-badge">
                    <FileType size={16} className="format-badge-icon" />
                    PDF
                  </span>
                  <span className="format-badge">
                    <FileType size={16} className="format-badge-icon" />
                    DOCX
                  </span>
                  <span className="format-badge">
                    <FileType size={16} className="format-badge-icon" />
                    DOC
                  </span>
                </>
              )}



              {/* File Preview */}
              {file && (
                <div className="file-preview" onClick={(e) => e.stopPropagation()}>
                  <div className="file-preview-icon">
                    <File size={24} />
                  </div>
                  <div className="file-preview-info">
                    <p className="file-preview-name">{file.name}</p>
                    <p className="file-preview-size">
                      {formatFileSize(file.size)} • {getFileExtension(file.name)}
                    </p>
                  </div>
                  <button 
                    className="file-preview-remove"
                    onClick={handleRemoveFile}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>{uploadProgress < 50 ? 'Uploading...' : uploadProgress < 90 ? 'Parsing resume...' : 'Finishing up...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}

            </div>

            {/* ── ATS Score Card (shown inline below file, after upload) ── */}
            {(atsLoading || atsScore !== null) && (
              <motion.div
                className="upload-ats-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {atsLoading ? (
                  <div className="upload-ats-loading">
                    <Loader size={22} className="ats-spin" />
                    <span>Calculating ATS score with AI…</span>
                  </div>
                ) : (
                  <>
                    <div className="upload-ats-header">
                      <Target size={22} style={{ color: scoreColor }} />
                      <span className="upload-ats-title">ATS Score</span>
                      <span className="upload-ats-score" style={{ color: scoreColor }}>
                        {atsScore}/100
                      </span>
                    </div>

                    {/* Score bar */}
                    <div className="upload-ats-bar-bg">
                      <div
                        className="upload-ats-bar-fill"
                        style={{ width: `${atsScore}%`, background: scoreColor }}
                      />
                    </div>

                    <p className="upload-ats-label" style={{ color: scoreColor }}>
                      {scoreLabel}
                    </p>

                    {saveStatus.message && (
                      <p className={`upload-save-status ${saveStatus.type}`}>
                        {saveStatus.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {saveStatus.message}
                      </p>
                    )}

                    {atsError && (
                      <p className="upload-ats-warning">
                        <AlertCircle size={14} /> {atsError}
                      </p>
                    )}

                    {atsSuggestions.length > 0 && (
                      <div className="upload-ats-suggestions">
                        <p className="upload-ats-suggestions-title">
                          <TrendingUp size={15} /> Top suggestions to improve:
                        </p>
                        <ul>
                          {atsSuggestions.slice(0, 4).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Error note if parse was partial */}
                    {error && (
                      <p className="upload-ats-warning">
                        <AlertCircle size={14} /> {error}
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Error shown standalone if no ATS card yet */}
            {error && atsScore === null && !atsLoading && (
              <div className="upload-error-standalone">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </motion.div>

          {/* Features */}
          <motion.div variants={fadeInUp} className="upload-features">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeInUp} className="upload-actions">
            <Link to="/dashboard">
              <button className="action-btn secondary">
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
            </Link>

            {/* Show "Continue to Builder" once ATS is done, otherwise show "Enhance Resume" */}
            {pendingFormData && !atsLoading ? (
              <button
                className="action-btn primary"
                onClick={handleContinue}
              >
                Continue to Builder
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                className="action-btn primary"
                onClick={handleUpload}
                disabled={!file || isUploading || atsLoading}
              >
                {isUploading ? 'Processing...' : atsLoading ? 'Analyzing…' : 'Enhance Resume'}
                <ArrowRight size={18} />
              </button>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default Upload;
