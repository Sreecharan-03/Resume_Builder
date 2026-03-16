import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  Share2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Award,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Loader
} from 'lucide-react';
import { atsService } from '../../services';
import html2pdf from 'html2pdf.js';
import './FinalResume.css';

const FinalResume = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeRef = useRef(null);
  const [jobContext, setJobContext] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [atsScore, setAtsScore] = useState(0);
  const [atsLoading, setAtsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);

  // Load resume data
  useEffect(() => {
    const storedContext = localStorage.getItem('jobContext');
    const storedResume = localStorage.getItem('resumeData');
    const resumeIdFromUrl = searchParams.get('id');
    const storedResumeId = localStorage.getItem('currentResumeId');
    
    // Set resume ID from URL or localStorage
    if (resumeIdFromUrl) {
      setCurrentResumeId(resumeIdFromUrl);
    } else if (storedResumeId) {
      setCurrentResumeId(storedResumeId);
    }

    if (storedContext) setJobContext(JSON.parse(storedContext));
    if (storedResume) {
      const parsed = JSON.parse(storedResume);
      // Transform data if it's in the new nested format
      if (parsed.personal) {
        const personal = parsed.personal;
        setResumeData({
          fullName: `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || personal.fullName || '',
          email: personal.email || '',
          phone: personal.phone || '',
          location: personal.location || '',
          summary: personal.summary || '',
          linkedin: parsed.codingProfiles?.linkedin || personal.linkedin || '',
          github: parsed.codingProfiles?.github || personal.github || '',
          skills: parsed.skills || [],
          experience: (parsed.experience || [])
            .filter(exp => exp.company || exp.position)
            .map(exp => ({
              position: exp.position || '',
              company: exp.company || '',
              duration: exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`,
              description: exp.description || ''
            })),
          education: (parsed.education || [])
            .filter(edu => edu.institution || edu.degree)
            .map(edu => ({
              degree: `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`.trim(),
              institution: edu.institution || '',
              year: edu.current ? `${edu.startDate} - Present` : `${edu.startDate} - ${edu.endDate}`,
              gpa: edu.gpa || ''
            })),
          projects: (parsed.projects || [])
            .filter(proj => proj.name || proj.description)
            .map(proj => ({
              title: proj.name || '',
              techStack: proj.technologies || '',
              description: proj.description || '',
              github: proj.githubLink || '',
              liveLink: proj.liveLink || ''
            })),
          certifications: (parsed.certifications || []).filter(cert => cert.name),
          languages: (parsed.languages || []).filter(lang => lang.language)
        });
      } else {
        setResumeData(parsed);
      }
    }
  }, [searchParams]);

  // Calculate local ATS score based on resume data completeness
  const calculateLocalScore = (data) => {
    if (!data) return 50;
    
    let score = 0;
    
    // Personal info (30 points max)
    if (data.fullName) score += 5;
    if (data.email) score += 5;
    if (data.phone) score += 5;
    if (data.location) score += 5;
    if (data.summary && data.summary.length > 50) score += 10;
    
    // Experience (25 points max)
    const experience = data.experience || [];
    if (experience.length > 0) {
      score += 10;
      if (experience.length >= 2) score += 10;
      const hasDetailedExp = experience.some(exp => 
        exp.description && exp.description.length > 100
      );
      if (hasDetailedExp) score += 5;
    }
    
    // Education (20 points max)
    const education = data.education || [];
    if (education.length > 0) {
      score += 15;
      if (education.some(edu => edu.gpa)) score += 5;
    }
    
    // Skills (15 points max)
    const skills = data.skills || [];
    if (skills.length >= 3) score += 5;
    if (skills.length >= 5) score += 5;
    if (skills.length >= 8) score += 5;
    
    // Extras (10 points max)
    const projects = data.projects || [];
    const certifications = data.certifications || [];
    if (projects.length > 0) score += 5;
    if (certifications.length > 0) score += 5;
    
    return Math.min(score, 100);
  };

  // Calculate/load ATS score when resume ID is available
  useEffect(() => {
    const loadAtsScore = async () => {
      setAtsLoading(true);
      
      // If we have a resume ID, fetch/calculate the ATS score from API
      if (currentResumeId) {
        try {
          // Try to get existing ATS result first
          const existingResult = await atsService.getATSResult(currentResumeId);
          if (existingResult.success && existingResult.data?.overallScore) {
            setAtsScore(existingResult.data.overallScore);
            setAtsLoading(false);
            return;
          }
          
          // Calculate new ATS score if no existing result
          const result = await atsService.analyzeResume(currentResumeId, {
            phase: 'PHASE3',
            useAI: true
          });
          if (result.success && result.data?.overallScore) {
            setAtsScore(result.data.overallScore);
            setAtsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to calculate ATS score from API:', error);
        }
      }
      
      // Fallback: calculate local score based on resume data
      const localScore = calculateLocalScore(resumeData);
      setAtsScore(localScore);
      setAtsLoading(false);
    };
    
    loadAtsScore();
  }, [currentResumeId, resumeData]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    
    const element = resumeRef.current;
    if (!element) {
      alert('Resume not found. Please try again.');
      setDownloading(false);
      return;
    }
    
    const fileName = resumeData?.fullName 
      ? `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';
    
    const opt = {
      margin: 0.5,
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
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${resumeData?.fullName || 'My'} Resume`,
      text: 'Check out my resume!',
      url: window.location.href
    };
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
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

  if (!resumeData || !jobContext) {
    return (
      <div className="final-container">
        <div className="final-empty">
          <AlertTriangle size={48} />
          <h2>No Resume Data Found</h2>
          <p>Please complete your resume first</p>
          <Link to="/company-role" className="final-start-btn">
            <Sparkles size={20} />
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="final-container">
      <div className="final-background">
        <div className="final-blob final-blob-1"></div>
        <div className="final-blob final-blob-2"></div>
      </div>

      {/* Header */}
      <header className="final-header no-print">
        <Link to="/" className="final-logo">
          <div className="final-logo-icon">
            <FileText size={22} />
          </div>
          <span className="final-logo-text">Resume<span className="gradient-text">Builder</span></span>
        </Link>

        <div className="final-score-badge">
          <Award size={18} />
          <span>ATS Score: {atsLoading ? (
            <Loader size={14} className="spin" style={{ marginLeft: '4px' }} />
          ) : (
            <strong style={{ color: getScoreColor(atsScore) }}>{atsScore}%</strong>
          )}</span>
        </div>

        <div className="final-header-actions">
          <button className="final-action-btn secondary" onClick={() => navigate('/improve-resume')}>
            <RefreshCw size={18} />
            Edit
          </button>
          <button className="final-action-btn secondary" onClick={() => navigate('/ats-result')}>
            <TrendingUp size={18} />
            Score
          </button>
          <button className="final-action-btn primary" onClick={handleDownload} disabled={downloading}>
            <Download size={18} />
            {downloading ? 'Preparing...' : 'Download PDF'}
          </button>
        </div>
      </header>

      <main className="final-main">
        {/* Controls Panel */}
        <div className="final-controls no-print">
          <h2>Your Resume is Ready!</h2>
          <p>Review your resume below and download it when you're satisfied.</p>

          <div className="final-actions-grid">
            <button className="final-control-btn" onClick={handleDownload}>
              <Download size={20} />
              <span>Download PDF</span>
            </button>
            <button className="final-control-btn" onClick={handlePrint}>
              <Printer size={20} />
              <span>Print</span>
            </button>
          </div>

          <div className="final-tips">
            <h3><Sparkles size={18} /> Final Tips</h3>
            <ul>
              <li>Save your resume as PDF for best compatibility</li>
              <li>Name your file: FirstName_LastName_Resume.pdf</li>
              <li>Always tailor your resume for each application</li>
            </ul>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="final-preview-wrap">
          <div className="final-resume" ref={resumeRef}>
            {/* ATS Badge */}
            <div className="resume-ats-badge no-print">
              <CheckCircle size={14} />
              <span>ATS Score: {atsLoading ? '...' : `${atsScore}%`}</span>
            </div>

            {/* Header Section */}
            <header className="resume-header">
              <h1 className="resume-name">{resumeData.fullName || 'Your Name'}</h1>
              <p className="resume-title">{jobContext.role}</p>
              
              <div className="resume-contact">
                {resumeData.email && (
                  <span><Mail size={14} /> {resumeData.email}</span>
                )}
                {resumeData.phone && (
                  <span><Phone size={14} /> {resumeData.phone}</span>
                )}
                {resumeData.location && (
                  <span><MapPin size={14} /> {resumeData.location}</span>
                )}
                {resumeData.linkedin && (
                  <span><Linkedin size={14} /> LinkedIn</span>
                )}
                {resumeData.github && (
                  <span><Github size={14} /> GitHub</span>
                )}
              </div>
            </header>

            {/* Summary */}
            {resumeData.summary && (
              <section className="resume-section">
                <h2 className="resume-section-title">Professional Summary</h2>
                <p className="resume-summary">{resumeData.summary}</p>
              </section>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Technical Skills</h2>
                <div className="resume-skills">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="resume-skill">{skill}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Work Experience</h2>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <h3 className="resume-item-title">{exp.position}</h3>
                        <p className="resume-item-subtitle">{exp.company}</p>
                      </div>
                      <span className="resume-item-date">{exp.duration}</span>
                    </div>
                    {exp.description && (
                      <p className="resume-item-description">{exp.description}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Projects</h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <h3 className="resume-item-title">{project.title}</h3>
                        {project.techStack && (
                          <p className="resume-item-tech">{project.techStack}</p>
                        )}
                      </div>
                      <div className="resume-project-links">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github size={14} />
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    {project.description && (
                      <p className="resume-item-description">{project.description}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Education</h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <h3 className="resume-item-title">{edu.degree}</h3>
                        <p className="resume-item-subtitle">{edu.institution}</p>
                      </div>
                      <div className="resume-item-meta">
                        <span className="resume-item-date">{edu.year}</span>
                        {edu.gpa && <span className="resume-gpa">GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Certifications</h2>
                <ul className="resume-list">
                  {resumeData.certifications.map((cert, index) => (
                    <li key={index}>{cert.name} {cert.issuer && `- ${cert.issuer}`}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Languages</h2>
                <div className="resume-languages">
                  {resumeData.languages.map((lang, index) => (
                    <span key={index} className="resume-language">
                      {lang.language} {lang.proficiency && `(${lang.proficiency})`}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Back Navigation */}
      <div className="final-back-nav no-print">
        <button onClick={() => navigate('/ats-result')}>
          <ArrowLeft size={18} />
          Back to ATS Analysis
        </button>
      </div>
    </div>
  );
};

export default FinalResume;
