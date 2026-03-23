import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { atsService } from '../../services';
import {
  FileText,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Code,
  Briefcase,
  GraduationCap,
  User,
  Lightbulb,
  TrendingUp,
  Award,
  Zap,
  RotateCcw,
  Download
} from 'lucide-react';
import './ATSResult.css';

const ATSResult = () => {
  const navigate = useNavigate();
  const [jobContext, setJobContext] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [atsScore, setAtsScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [sectionScores, setSectionScores] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Role-specific keywords and expectations
  const roleExpectations = {
    'Java Full Stack Developer': {
      skills: ['java', 'spring boot', 'react', 'javascript', 'sql', 'rest api', 'microservices', 'hibernate', 'maven', 'git'],
      keywords: ['full stack', 'backend', 'frontend', 'api', 'database', 'scalable', 'agile'],
      minProjects: 3,
      minExperience: 1
    },
    'Frontend Developer': {
      skills: ['react', 'javascript', 'typescript', 'css', 'html', 'redux', 'webpack', 'responsive', 'ui/ux', 'git'],
      keywords: ['frontend', 'ui', 'user interface', 'responsive', 'component', 'spa', 'performance'],
      minProjects: 3,
      minExperience: 1
    },
    'Backend Developer': {
      skills: ['node.js', 'python', 'java', 'sql', 'mongodb', 'rest api', 'docker', 'aws', 'microservices', 'git'],
      keywords: ['backend', 'api', 'database', 'server', 'scalable', 'architecture', 'security'],
      minProjects: 2,
      minExperience: 1
    },
    'Data Scientist': {
      skills: ['python', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'sql', 'deep learning', 'statistics', 'visualization', 'scikit-learn'],
      keywords: ['data', 'analysis', 'model', 'prediction', 'algorithm', 'insight', 'ml'],
      minProjects: 2,
      minExperience: 0
    },
    'DevOps Engineer': {
      skills: ['docker', 'kubernetes', 'aws', 'jenkins', 'terraform', 'linux', 'python', 'ci/cd', 'ansible', 'monitoring'],
      keywords: ['devops', 'deployment', 'automation', 'infrastructure', 'pipeline', 'cloud', 'scalable'],
      minProjects: 2,
      minExperience: 1
    },
    'default': {
      skills: ['communication', 'teamwork', 'problem solving', 'leadership', 'analytical', 'project management'],
      keywords: ['experience', 'project', 'team', 'developed', 'managed', 'implemented'],
      minProjects: 2,
      minExperience: 0
    }
  };

  useEffect(() => {
    const storedContext = localStorage.getItem('jobContext');
    const storedResume = localStorage.getItem('resumeData');
    const storedResumeId = localStorage.getItem('currentResumeId');

    if (storedContext) setJobContext(JSON.parse(storedContext));
    if (storedResume) setResumeData(JSON.parse(storedResume));
    if (storedResumeId) setCurrentResumeId(storedResumeId);
  }, []);

  // Apply API response to state
  const applyAPIResponse = (data) => {
    setAtsScore(data.overallScore || 0);
    const apiSections = data.sectionScores || {};
    const scores = {
      skills: {
        score: Math.round((data.skillsMatchScore || 0) * 30 / 100),
        max: 30,
        items: {
          matched: (data.matchedKeywords || []).slice(0, 5),
          missing: (data.missingKeywords || []).slice(0, 5)
        }
      },
      keywords: {
        score: Math.round((data.keywordMatchScore || 0) * 20 / 100),
        max: 20,
        items: {
          matched: (data.matchedKeywords || []).slice(5, 10),
          missing: (data.missingKeywords || []).slice(5, 10)
        }
      },
      experience: {
        score: Math.round(((apiSections.experience || 0) * 20) / 100),
        max: 20,
        items: {
          matched: (data.matchedKeywords || []).filter(k => /experience|work|job/i.test(k)).slice(0, 2),
          issues: (data.improvementSuggestions || []).filter(s => /experience|work/i.test(s)).slice(0, 2)
        }
      },
      projects: {
        score: Math.round((data.projectRelevanceScore || 0) * 15 / 100),
        max: 15,
        items: {
          matched: (data.matchedKeywords || []).filter(k => /project|built|developed/i.test(k)).slice(0, 2),
          issues: (data.improvementSuggestions || []).filter(s => /project/i.test(s)).slice(0, 2)
        }
      },
      education: {
        score: Math.round(((apiSections.education || 0) * 10) / 100),
        max: 10,
        items: {
          matched: (apiSections.education || 0) >= 50 ? ['Education section present'] : [],
          issues: (apiSections.education || 0) < 50 ? ['Add or improve education details'] : []
        }
      },
      formatting: {
        score: Math.round((data.formattingScore || 0) * 5 / 100),
        max: 5,
        items: {
          matched: (data.formattingScore || 0) >= 60 ? ['Good formatting & structure'] : [],
          issues: (data.formattingScore || 0) < 60 ? ['Improve resume formatting and structure'] : []
        }
      }
    };
    setSectionScores(scores);
    setAnalysis({
      missingSkills: data.missingKeywords || [],
      issues: data.improvementSuggestions || data.recommendations || [],
      strengths: (data.matchedKeywords || []).slice(0, 5).map(s => `Strong match: ${s}`)
    });
    if (data.aiFeedback) setAiError('');
  };

  // Fetch ATS score from OpenAI API
  const fetchAIAtsScore = async (ctx) => {
    setAiLoading(true);
    setAiError('');
    try {
      const rid = currentResumeId;
      // Always run fresh AI analysis (skip cached result)
      const result = await atsService.analyzeResume(rid, {
        phase: 'PHASE3',
        useAI: true,
        targetRole: ctx?.role || null,
        jobDescription: ctx?.jobDescription || null
      });
      if (result.success && result.data) {
        applyAPIResponse(result.data);
      } else {
        setAiError(result.message || 'AI analysis failed');
        analyzeResumeLocally();
      }
    } catch (err) {
      console.error('AI ATS error:', err);
      setAiError('AI analysis unavailable. Showing local estimate.');
      analyzeResumeLocally();
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!jobContext) return;
    if (currentResumeId) {
      fetchAIAtsScore(jobContext);
    } else if (resumeData) {
      analyzeResumeLocally();
    }
  }, [resumeData, jobContext, currentResumeId]);

  useEffect(() => {
    // Animate score
    if (atsScore > 0) {
      const duration = 2000;
      const steps = 60;
      const increment = atsScore / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= atsScore) {
          setAnimatedScore(atsScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [atsScore]);

  const analyzeResumeLocally = () => {
    const role = jobContext?.role || 'default';
    
    // Use extracted keywords from job description if available
    let expectations;
    if (jobContext?.extractedKeywords && jobContext.extractedKeywords.length > 0) {
      expectations = {
        skills: jobContext.extractedKeywords,
        keywords: jobContext.extractedKeywords.slice(0, 7),
        minProjects: 2,
        minExperience: 1
      };
    } else {
      expectations = roleExpectations[role] || roleExpectations['default'];
    }
    
    let scores = {
      skills: { score: 0, max: 30, items: { matched: [], missing: [] } },
      keywords: { score: 0, max: 20, items: { matched: [], missing: [] } },
      experience: { score: 0, max: 20, items: { matched: [], issues: [] } },
      projects: { score: 0, max: 15, items: { matched: [], issues: [] } },
      education: { score: 0, max: 10, items: { matched: [], issues: [] } },
      formatting: { score: 0, max: 5, items: { matched: [], issues: [] } }
    };

    // Analyze Skills
    const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
    const expectedSkills = expectations.skills;
    
    expectedSkills.forEach(skill => {
      if (resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))) {
        scores.skills.items.matched.push(skill);
      } else {
        scores.skills.items.missing.push(skill);
      }
    });
    
    const skillMatchRate = scores.skills.items.matched.length / expectedSkills.length;
    scores.skills.score = Math.round(skillMatchRate * scores.skills.max);

    // Analyze Keywords in summary and descriptions
    const allText = [
      resumeData.personal?.summary || resumeData.summary || '',
      ...(resumeData.experience || []).map(e => `${e.description || ''} ${e.position || ''}`),
      ...(resumeData.projects || []).map(p => `${p.description || ''} ${p.title || p.name || ''}`)
    ].join(' ').toLowerCase();

    expectations.keywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        scores.keywords.items.matched.push(keyword);
      } else {
        scores.keywords.items.missing.push(keyword);
      }
    });

    const keywordMatchRate = scores.keywords.items.matched.length / expectations.keywords.length;
    scores.keywords.score = Math.round(keywordMatchRate * scores.keywords.max);

    // Analyze Experience
    const experienceCount = (resumeData.experience || []).length;
    if (experienceCount >= expectations.minExperience) {
      scores.experience.items.matched.push(`${experienceCount} experience entries found`);
      scores.experience.score = Math.min(scores.experience.max, experienceCount * 7);
    } else {
      scores.experience.items.issues.push(`Only ${experienceCount} experience entries (recommend ${expectations.minExperience}+)`);
      scores.experience.score = experienceCount * 5;
    }

    // Check for quantified achievements
    const hasQuantified = (resumeData.experience || []).some(e => 
      /\d+%|\d+ users|\d+x|increased|decreased|improved/i.test(e.description || '')
    );
    if (hasQuantified) {
      scores.experience.items.matched.push('Includes quantified achievements');
      scores.experience.score = Math.min(scores.experience.max, scores.experience.score + 5);
    } else {
      scores.experience.items.issues.push('Add quantified achievements (numbers, percentages)');
    }

    // Analyze Projects
    const projectCount = (resumeData.projects || []).length;
    if (projectCount >= expectations.minProjects) {
      scores.projects.items.matched.push(`${projectCount} projects showcase your work`);
      scores.projects.score = Math.min(scores.projects.max, projectCount * 5);
    } else {
      scores.projects.items.issues.push(`Only ${projectCount} projects (recommend ${expectations.minProjects}+)`);
      scores.projects.score = projectCount * 3;
    }

    // Check project descriptions
    const hasDetailedProjects = (resumeData.projects || []).every(p => 
      (p.description || '').length > 50
    );
    if (hasDetailedProjects && projectCount > 0) {
      scores.projects.items.matched.push('Projects have detailed descriptions');
    } else if (projectCount > 0) {
      scores.projects.items.issues.push('Add more detail to project descriptions');
    }

    // Analyze Education
    if ((resumeData.education || []).length > 0) {
      scores.education.items.matched.push('Education section present');
      scores.education.score = 7;

      const hasGPA = (resumeData.education || []).some(e => e.gpa);
      if (hasGPA) {
        scores.education.items.matched.push('GPA included');
        scores.education.score = 10;
      }
    } else {
      scores.education.items.issues.push('Add education details');
    }

    // Analyze Formatting
    const pd = resumeData.personal || resumeData;
    const hasName = pd.fullName || (pd.firstName && pd.lastName) || pd.firstName;
    const hasEmail = pd.email;
    const hasPhone = pd.phone;
    if (hasName && hasEmail && hasPhone) {
      scores.formatting.items.matched.push('Contact info complete');
      scores.formatting.score = 3;
    } else {
      scores.formatting.items.issues.push('Complete all contact information');
    }

    const summaryText = resumeData.personal?.summary || resumeData.summary || '';
    if (summaryText && summaryText.length >= 100) {
      scores.formatting.items.matched.push('Professional summary included');
      scores.formatting.score = Math.min(5, scores.formatting.score + 2);
    } else {
      scores.formatting.items.issues.push('Add a detailed professional summary');
    }

    setSectionScores(scores);

    // Calculate total
    const totalScore = Object.values(scores).reduce((sum, section) => sum + section.score, 0);
    setAtsScore(totalScore);

    // Generate analysis
    const allMissing = scores.skills.items.missing;
    const allIssues = [
      ...scores.experience.items.issues,
      ...scores.projects.items.issues,
      ...scores.education.items.issues,
      ...scores.formatting.items.issues
    ];

    setAnalysis({
      missingSkills: allMissing,
      issues: allIssues,
      strengths: [
        ...scores.skills.items.matched.slice(0, 3).map(s => `Strong ${s} skills`),
        ...scores.experience.items.matched,
        ...scores.projects.items.matched
      ]
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getSectionIcon = (section) => {
    const icons = {
      skills: Code,
      keywords: Target,
      experience: Briefcase,
      projects: Lightbulb,
      education: GraduationCap,
      formatting: FileText
    };
    return icons[section] || FileText;
  };

  const getSectionLabel = (section) => {
    const labels = {
      skills: 'Skills Match',
      keywords: 'Keyword Optimization',
      experience: 'Experience Quality',
      projects: 'Project Relevance',
      education: 'Education',
      formatting: 'Format & Structure'
    };
    return labels[section] || section;
  };

  if (!resumeData || !jobContext) {
    return (
      <div className="ats-result-container">
        <div className="ats-empty">
          <AlertTriangle size={48} />
          <h2>No Resume Data Found</h2>
          <p>Please build your resume first to see ATS analysis</p>
          <Link to="/company-role" className="ats-start-btn">
            <Sparkles size={20} />
            Start Building
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ats-result-container">
      <div className="ats-background">
        <div className="ats-blob ats-blob-1"></div>
        <div className="ats-blob ats-blob-2"></div>
      </div>

      {/* Header */}
      <header className="ats-header">
        <Link to="/" className="ats-logo">
          <div className="ats-logo-icon">
            <FileText size={22} />
          </div>
          <span className="ats-logo-text">Resume<span className="gradient-text">Builder</span></span>
        </Link>

        <div className="ats-context">
          <Target size={16} />
          <span>Analyzing for <strong>{jobContext.role}</strong> at <strong>{jobContext.company}</strong></span>
        </div>

        <div className="ats-header-actions">
          <button className="ats-action-btn secondary" onClick={() => navigate('/improve-resume')}>
            <RotateCcw size={18} />
            Improve Resume
          </button>
          <button className="ats-action-btn primary" onClick={() => navigate('/final-resume')}>
            <Download size={18} />
            Download
          </button>
        </div>
      </header>

      <main className="ats-main">
        {/* AI Loading / Error Banner */}
        {aiLoading && (
          <div className="ats-ai-banner loading">
            <Zap size={18} className="spin-icon" />
            <span>Analyzing your resume with AI (OpenAI)… This may take a few seconds.</span>
          </div>
        )}
        {!aiLoading && aiError && (
          <div className="ats-ai-banner warning">
            <AlertTriangle size={18} />
            <span>{aiError}</span>
          </div>
        )}

        {/* Score Hero */}
        <motion.div
          className="ats-score-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="ats-score-circle-wrap">
            <svg className="ats-score-ring" viewBox="0 0 200 200">
              <circle
                className="ats-ring-bg"
                cx="100"
                cy="100"
                r="85"
                fill="none"
                strokeWidth="12"
              />
              <circle
                className="ats-ring-fill"
                cx="100"
                cy="100"
                r="85"
                fill="none"
                strokeWidth="12"
                strokeDasharray={`${(animatedScore / 100) * 534} 534`}
                style={{ stroke: getScoreColor(atsScore) }}
              />
            </svg>
            <div className="ats-score-center">
              <span className="ats-score-value" style={{ color: getScoreColor(atsScore) }}>
                {animatedScore}
              </span>
              <span className="ats-score-caption">{getScoreLabel(atsScore)}</span>
            </div>
          </div>

          <div className="ats-score-info">
            <h1>ATS Compatibility Score</h1>
            <p>
              Your resume has been analyzed against the requirements for 
              <strong> {jobContext.role}</strong> position. 
              {atsScore >= 80 
                ? " Great job! Your resume is well-optimized."
                : atsScore >= 60
                ? " Good start! A few improvements can boost your chances."
                : " There's room for improvement. Follow our recommendations below."
              }
            </p>

            {atsScore < 80 && (
              <button className="ats-improve-cta" onClick={() => navigate('/improvement-guide')}>
                <Zap size={20} />
                Get Improvement Guide
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Section Breakdown */}
        <motion.div
          className="ats-sections"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="ats-sections-title">
            <Target size={24} />
            Section-wise Breakdown
          </h2>

          <div className="ats-sections-grid">
            {Object.entries(sectionScores).map(([key, section], index) => {
              const Icon = getSectionIcon(key);
              const percentage = Math.round((section.score / section.max) * 100);
              
              return (
                <motion.div
                  key={key}
                  className="ats-section-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="ats-section-header">
                    <div className="ats-section-icon" style={{ background: `${getScoreColor(percentage)}20`, color: getScoreColor(percentage) }}>
                      <Icon size={20} />
                    </div>
                    <div className="ats-section-meta">
                      <h3>{getSectionLabel(key)}</h3>
                      <span className="ats-section-score" style={{ color: getScoreColor(percentage) }}>
                        {section.score}/{section.max} points
                      </span>
                    </div>
                  </div>

                  <div className="ats-section-bar">
                    <div 
                      className="ats-section-bar-fill"
                      style={{ 
                        width: `${percentage}%`,
                        background: getScoreColor(percentage)
                      }}
                    ></div>
                  </div>

                  <div className="ats-section-details">
                    {section.items.matched?.slice(0, 2).map((item, i) => (
                      <div key={i} className="ats-detail-item success">
                        <CheckCircle size={14} />
                        <span>{item}</span>
                      </div>
                    ))}
                    {(section.items.missing || section.items.issues)?.slice(0, 2).map((item, i) => (
                      <div key={i} className="ats-detail-item warning">
                        <AlertTriangle size={14} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="ats-actions-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="ats-action-card improve" onClick={() => navigate('/improvement-guide')}>
            <div className="ats-action-icon">
              <TrendingUp size={28} />
            </div>
            <div className="ats-action-content">
              <h3>View Improvement Guide</h3>
              <p>Get personalized recommendations to boost your score</p>
            </div>
            <ChevronRight size={24} />
          </div>

          <div className="ats-action-card edit" onClick={() => navigate('/improve-resume')}>
            <div className="ats-action-icon">
              <RotateCcw size={28} />
            </div>
            <div className="ats-action-content">
              <h3>Edit & Re-analyze</h3>
              <p>Make changes and check your updated score</p>
            </div>
            <ChevronRight size={24} />
          </div>

          <div className="ats-action-card download" onClick={() => navigate('/final-resume')}>
            <div className="ats-action-icon">
              <Award size={28} />
            </div>
            <div className="ats-action-content">
              <h3>Download Resume</h3>
              <p>Get your resume with ATS score badge</p>
            </div>
            <ChevronRight size={24} />
          </div>
        </motion.div>

        {/* Key Findings */}
        {analysis && (
          <motion.div
            className="ats-findings"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="ats-findings-col strengths">
              <h3>
                <CheckCircle size={20} />
                Strengths
              </h3>
              <ul>
                {analysis.strengths.slice(0, 5).map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="ats-findings-col improvements">
              <h3>
                <AlertTriangle size={20} />
                Areas to Improve
              </h3>
              <ul>
                {analysis.missingSkills.slice(0, 3).map((skill, i) => (
                  <li key={i}>Add <strong>{skill}</strong> to your skills</li>
                ))}
                {analysis.issues.slice(0, 2).map((issue, i) => (
                  <li key={`issue-${i}`}>{issue}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ATSResult;
