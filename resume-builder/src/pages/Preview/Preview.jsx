import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Edit3, 
  Share2, 
  Printer,
  Check,
  AlertCircle,
  ArrowLeft,
  Palette,
  Sparkles,
  Loader,
  TrendingUp,
  XCircle,
  ThumbsUp,
  Lightbulb,
  BarChart2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { resumeService, atsService } from '../../services';
import { ResumeTemplate } from '../../templates/ResumeTemplates';
import { templates } from '../../templates';
import html2pdf from 'html2pdf.js';
import './Preview.css';

// Default resume data structure for when no data is available
const defaultResumeData = {
  personal: {
    fullName: '',
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: []
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Preview() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { resumeData: contextResumeData, selectedTemplate: contextSelectedTemplate } = useResume();
  
  const [atsScore, setAtsScore] = useState(0);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsFeedback, setAtsFeedback] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(
    location.state?.templateId || contextSelectedTemplate || parseInt(localStorage.getItem('selectedTemplate')) || 1
  );
  
  // State to hold the actual resume data to display
  const [displayData, setDisplayData] = useState(defaultResumeData);
  const [loading, setLoading] = useState(true);

  // Load resume data from various sources
  useEffect(() => {
    const loadResumeData = async () => {
      setLoading(true);
      
      // Check if we have a resume ID in query params
      const resumeId = searchParams.get('id');
      
      if (resumeId) {
        setCurrentResumeId(resumeId);
        // Load from backend
        try {
          const result = await resumeService.getResume(resumeId);
          if (result.success && result.data?.content) {
            setDisplayData(transformResumeData(result.data.content));
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to load resume:', error);
        }
      }
      
      // Try to get data from context
      if (contextResumeData && contextResumeData.personal?.firstName) {
        setDisplayData(transformResumeData(contextResumeData));
        setLoading(false);
        // Check for stored resume ID
        const storedId = localStorage.getItem('currentResumeId');
        if (storedId) setCurrentResumeId(storedId);
        return;
      }
      
      // Try localStorage
      const storedData = localStorage.getItem('resumeData');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed.personal?.firstName || parsed.personal?.fullName) {
            setDisplayData(transformResumeData(parsed));
            // Check for stored resume ID
            const storedId = localStorage.getItem('currentResumeId');
            if (storedId) setCurrentResumeId(storedId);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing stored resume data:', e);
        }
      }
      
      setLoading(false);
    };
    
    loadResumeData();
  }, [searchParams, contextResumeData]);

  // Transform resume data to the format expected by templates
  const transformResumeData = (data) => {
    if (!data) return defaultResumeData;
    
    const personal = data.personal || {};
    const fullName = personal.fullName || `${personal.firstName || ''} ${personal.lastName || ''}`.trim();
    
    return {
      personal: {
        fullName,
        firstName: personal.firstName || fullName.split(' ')[0] || '',
        lastName: personal.lastName || fullName.split(' ').slice(1).join(' ') || '',
        title: personal.title || '',
        email: personal.email || '',
        phone: personal.phone || '',
        location: personal.location || '',
        linkedin: data.codingProfiles?.linkedin || personal.linkedin || '',
        github: data.codingProfiles?.github || personal.github || '',
        website: data.codingProfiles?.portfolio || personal.website || '',
        summary: personal.summary || '',
      isStudent: personal.isStudent ?? false
      },
      education: (data.education || []).map(edu => ({
        degree: edu.degree || '',
        field: edu.field || '',
        institution: edu.institution || '',
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.current ? 'Present' : (edu.endDate || ''),
        gpa: edu.gpa || ''
      })),
      experience: (data.experience || []).map(exp => ({
        position: exp.position || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.current ? 'Present' : (exp.endDate || ''),
        description: exp.description || '',
        highlights: exp.description ? exp.description.split('\n').filter(l => l.trim()) : []
      })),
      skills: data.skills || [],
      projects: (data.projects || []).map(proj => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || '',
        link: proj.githubLink || proj.liveLink || ''
      })),
      certifications: (data.certifications || []).map(cert => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || ''
      }))
    };
  };

  // Calculate local ATS score based on resume data completeness
  const calculateLocalScore = (data) => {
    let score = 0;
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const projects = data?.projects || [];
    const certifications = data?.certifications || [];
    
    // Personal info (30 points max)
    if (personal.fullName || personal.firstName) score += 5;
    if (personal.email) score += 5;
    if (personal.phone) score += 5;
    if (personal.location) score += 5;
    if (personal.summary && personal.summary.length > 50) score += 10;
    
    // Experience (25 points max)
    if (experience.length > 0) {
      score += 10;
      if (experience.length >= 2) score += 10;
      const hasDetailedExp = experience.some(exp => 
        (exp.description && exp.description.length > 100) ||
        (exp.highlights && exp.highlights.length > 0)
      );
      if (hasDetailedExp) score += 5;
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
    if (projects.length > 0) score += 5;
    if (certifications.length > 0) score += 5;
    
    return Math.min(score, 100);
  };

  // Build feedback items from AI analysis data
  const buildFeedback = (data) => {
    const items = [];
    const matched = data.matchedKeywords || [];
    const missing = data.missingKeywords || [];
    const suggestions = data.improvementSuggestions || data.recommendations || [];
    const formatting = data.formattingScore || 0;
    const skills = data.skillsMatchScore || 0;

    if (matched.length > 0) {
      items.push({ type: 'good', text: `${matched.length} keywords matched (${matched.slice(0, 3).join(', ')})` });
    } else if (skills >= 60) {
      items.push({ type: 'good', text: 'Keywords optimized for the role' });
    }
    if (formatting >= 70) {
      items.push({ type: 'good', text: 'Clean formatting detected' });
    } else if (formatting > 0) {
      items.push({ type: 'warning', text: 'Improve resume formatting & structure' });
    }
    if (suggestions.length > 0) {
      suggestions.slice(0, 2).forEach(s => items.push({ type: 'warning', text: s }));
    } else if (missing.length > 0) {
      items.push({ type: 'warning', text: `Consider adding: ${missing.slice(0, 3).join(', ')}` });
    }

    return items.length > 0 ? items : [
      { type: 'good', text: 'Resume structure looks good' },
      { type: 'warning', text: 'Add more measurable achievements' }
    ];
  };

  // Calculate ATS score when resume is loaded
  useEffect(() => {
    const calculateAtsScore = async () => {
      if (loading) return;

      setAtsLoading(true);

      // Always run fresh AI analysis (skip stale cache)
      if (currentResumeId) {
        try {
          const result = await atsService.analyzeResume(currentResumeId, {
            phase: 'PHASE3',
            useAI: true
          });
          if (result.success && result.data?.overallScore) {
            setAtsScore(result.data.overallScore);
            setAtsFeedback(buildFeedback(result.data));
            setAiAnalysis(result.data);
            localStorage.setItem('lastAtsScore', result.data.overallScore.toString());
            setAtsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to calculate ATS score from API:', error);
        }
      }
      
      // Fallback: calculate local score based on resume data
      const localScore = calculateLocalScore(displayData);
      setAtsScore(localScore);
      setAtsFeedback([
        localScore >= 70
          ? { type: 'good', text: 'Resume looks well-structured' }
          : { type: 'warning', text: 'Add more details to improve score' },
        { type: 'warning', text: 'Add measurable achievements & metrics' }
      ]);
      localStorage.setItem('lastAtsScore', localScore.toString());
      setAtsLoading(false);
    };
    
    calculateAtsScore();
  }, [currentResumeId, loading, displayData]);

  const circumference = 2 * Math.PI * 52;
  const strokeDasharray = `${(atsScore / 100) * circumference} ${circumference}`;

  const handleDownload = async () => {
    const element = document.querySelector('.resume-paper');
    if (!element) {
      alert('Resume not found. Please try again.');
      return;
    }
    
    const fileName = displayData.personal?.fullName 
      ? `${displayData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';
    
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `${displayData.personal?.fullName || 'My'} Resume`,
      text: 'Check out my resume!',
      url: window.location.href
    };
    
    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback: copy link to clipboard
          copyToClipboard();
        }
      }
    } else {
      // Fallback: copy link to clipboard
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Unable to share. Please copy the URL manually.');
    });
  };

  // Show loading state or empty state
  if (loading) {
    return (
      <div className="preview-container">
        <div className="preview-loading">
          <FileText size={48} />
          <h2>Loading Resume...</h2>
        </div>
      </div>
    );
  }

  // Check if we have actual resume data
  const hasData = displayData.personal?.fullName || displayData.personal?.firstName;

  return (
    <div className="preview-container">
      {/* Background */}
      <div className="preview-background">
        <div className="preview-blob preview-blob-1"></div>
        <div className="preview-blob preview-blob-2"></div>
      </div>

      {/* Header */}
      <header className="preview-header">
        <Link to="/templates" className="preview-logo">
          <div className="preview-logo-icon">
            <FileText size={20} />
          </div>
          <span className="preview-logo-text">ResumeAI</span>
        </Link>

        <div className="preview-header-actions">
          <Link to="/dashboard">
            <button className="quick-action-btn">
              Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="preview-main">
        <motion.div
          className="resume-document-wrapper"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="resume-document">
            <div className="resume-paper">
              {/* Dynamic Resume Template */}
              <ResumeTemplate templateId={selectedTemplate} data={displayData} />
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="preview-sidebar"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* ATS Score Card */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">
              <Sparkles size={18} />
              ATS Score
            </h3>
            <div className="ats-score-container">
              <div className="ats-score-circle">
                <svg width="120" height="120">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <circle
                    className="ats-score-bg"
                    cx="60"
                    cy="60"
                    r="52"
                  />
                  <circle
                    className="ats-score-progress"
                    cx="60"
                    cy="60"
                    r="52"
                    strokeDasharray={strokeDasharray}
                  />
                </svg>
                <div className="ats-score-text">
                  {atsLoading ? (
                    <>
                      <Loader size={24} className="spin" />
                      <span className="ats-score-label">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span className="ats-score-value">{atsScore}%</span>
                      <span className="ats-score-label">Score</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="ats-feedback">
              {atsFeedback.length > 0 ? atsFeedback.map((item, i) => (
                <div key={i} className="ats-feedback-item">
                  <div className={`ats-feedback-icon ${item.type === 'good' ? 'good' : 'warning'}`}>
                    {item.type === 'good' ? <Check size={14} /> : <AlertCircle size={14} />}
                  </div>
                  <span className="ats-feedback-text">{item.text}</span>
                </div>
              )) : (
                <>
                  <div className="ats-feedback-item">
                    <div className="ats-feedback-icon good"><Check size={14} /></div>
                    <span className="ats-feedback-text">Keywords optimized for tech roles</span>
                  </div>
                  <div className="ats-feedback-item">
                    <div className="ats-feedback-icon good"><Check size={14} /></div>
                    <span className="ats-feedback-text">Clean formatting detected</span>
                  </div>
                  <div className="ats-feedback-item">
                    <div className="ats-feedback-icon warning"><AlertCircle size={14} /></div>
                    <span className="ats-feedback-text">Consider adding more metrics</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AI Analysis Card */}
          {(atsLoading || aiAnalysis) && (
            <div className="sidebar-card ai-analysis-card">
              <h3 className="sidebar-card-title">
                <Lightbulb size={18} />
                AI Resume Analysis
              </h3>

              {atsLoading ? (
                <div className="ai-analysis-loading">
                  <Loader size={20} className="spin" />
                  <span>Analyzing your resume with AI...</span>
                </div>
              ) : aiAnalysis ? (
                <>
                  {/* AI Feedback Summary */}
                  {aiAnalysis.aiFeedback && (
                    <div className="ai-feedback-summary">
                      <p>{aiAnalysis.aiFeedback}</p>
                    </div>
                  )}

                  {/* Score Breakdown */}
                  <div className="ai-score-breakdown">
                    <div className="ai-score-breakdown-title">
                      <BarChart2 size={14} />
                      Score Breakdown
                    </div>
                    {[
                      { label: 'Skills Match', value: aiAnalysis.skillsMatchScore },
                      { label: 'Keyword Match', value: aiAnalysis.keywordMatchScore },
                      { label: 'Project Relevance', value: aiAnalysis.projectRelevanceScore },
                      { label: 'Formatting', value: aiAnalysis.formattingScore },
                    ].map(({ label, value }) => (
                      <div key={label} className="ai-score-bar-row">
                        <span className="ai-score-bar-label">{label}</span>
                        <div className="ai-score-bar-track">
                          <div
                            className={`ai-score-bar-fill ${
                              value >= 70 ? 'good' : value >= 45 ? 'mid' : 'low'
                            }`}
                            style={{ width: `${value || 0}%` }}
                          />
                        </div>
                        <span className="ai-score-bar-value">{value || 0}</span>
                      </div>
                    ))}
                  </div>

                  {/* What to Improve */}
                  {(aiAnalysis.improvementSuggestions?.length > 0 || aiAnalysis.recommendations?.length > 0) && (
                    <div className="ai-improvements">
                      <div className="ai-section-heading">
                        <TrendingUp size={14} />
                        What to Improve
                      </div>
                      <ol className="ai-improvement-list">
                        {(aiAnalysis.improvementSuggestions?.length > 0
                          ? aiAnalysis.improvementSuggestions
                          : aiAnalysis.recommendations
                        ).slice(0, showFullAnalysis ? 10 : 3).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                      {(aiAnalysis.improvementSuggestions?.length > 3 || aiAnalysis.recommendations?.length > 3) && (
                        <button
                          className="ai-toggle-btn"
                          onClick={() => setShowFullAnalysis(v => !v)}
                        >
                          {showFullAnalysis ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Show {(aiAnalysis.improvementSuggestions || aiAnalysis.recommendations || []).length - 3} more</>}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {aiAnalysis.missingKeywords?.length > 0 && (
                    <div className="ai-keywords-section">
                      <div className="ai-section-heading missing">
                        <XCircle size={14} />
                        Missing Keywords
                      </div>
                      <div className="ai-chips">
                        {aiAnalysis.missingKeywords.slice(0, 8).map((k, i) => (
                          <span key={i} className="ai-chip missing">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Keywords */}
                  {aiAnalysis.matchedKeywords?.length > 0 && (
                    <div className="ai-keywords-section">
                      <div className="ai-section-heading matched">
                        <ThumbsUp size={14} />
                        Matched Keywords
                      </div>
                      <div className="ai-chips">
                        {aiAnalysis.matchedKeywords.slice(0, 8).map((k, i) => (
                          <span key={i} className="ai-chip matched">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* Quick Actions */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn primary" onClick={handleDownload}>
                <div className="quick-action-icon">
                  <Download size={18} />
                </div>
                Download PDF
              </button>

              <Link to="/builder" style={{ textDecoration: 'none' }}>
                <button className="quick-action-btn">
                  <div className="quick-action-icon">
                    <Edit3 size={18} />
                  </div>
                  Edit Resume
                </button>
              </Link>

              <button className="quick-action-btn" onClick={handlePrint}>
                <div className="quick-action-icon">
                  <Printer size={18} />
                </div>
                Print Resume
              </button>

              <button className="quick-action-btn" onClick={handleShare}>
                <div className="quick-action-icon">
                  <Share2 size={18} />
                </div>
                Share Link
              </button>
            </div>
          </div>

          {/* Template Selector */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">
              <Palette size={18} />
              Change Template
            </h3>
            <p className="template-selected-name">
              Current: {templates.find(t => t.id === selectedTemplate)?.name || 'Modern Professional'}
            </p>
            <div className="template-mini-grid">
              {templates.slice(0, 8).map(template => (
                <div
                  key={template.id}
                  className={`template-mini ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                  title={template.name}
                >
                  <div className="template-mini-preview" style={{ borderColor: template.primaryColor }}>
                    <div className="template-mini-line header" style={{ background: template.primaryColor }}></div>
                    <div className="template-mini-line"></div>
                    <div className="template-mini-line short"></div>
                    <div className="template-mini-line"></div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/templates" style={{ textDecoration: 'none', marginTop: '1rem', display: 'block' }}>
              <button className="quick-action-btn" style={{ width: '100%', justifyContent: 'center' }}>
                <Palette size={16} />
                Browse All Templates
              </button>
            </Link>
          </div>

          {/* Back Button */}
          <Link to="/templates" style={{ textDecoration: 'none' }}>
            <button className="quick-action-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <ArrowLeft size={18} />
              Back to Templates
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

export default Preview;
