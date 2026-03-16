import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { resumeService, atsService } from '../../services';
import { 
  FileText, 
  Home,
  LayoutDashboard,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Menu,
  X,
  Rocket,
  FileEdit,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [bestResume, setBestResume] = useState(null);
  const [analyzingATS, setAnalyzingATS] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Fetch resumes from backend
  useEffect(() => {
    const fetchResumes = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const result = await resumeService.getAllResumes();
        if (result.success) {
          const resumeData = result.data?.resumes || result.data || [];
          const list = Array.isArray(resumeData) ? resumeData : [];
          setResumes(list);

          // Find resume with highest stored atsScore to show immediately
          if (list.length > 0) {
            const topResume = list.reduce((best, r) =>
              (r.atsScore || 0) > (best.atsScore || 0) ? r : best, list[0]);
            setBestResume(topResume);
            // Auto-run fresh AI analysis on the top resume
            runAIAnalysis(topResume.id, list);
          }
        }
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResumes();
  }, [isAuthenticated]);

  // Analyze a specific resume with AI, then update bestResume if score is higher
  const runAIAnalysis = async (resumeId, resumeList) => {
    try {
      setAnalyzingATS(true);
      const result = await atsService.analyzeResume(resumeId, {
        phase: 'PHASE3',
        useAI: true,
      });
      if (result.success && result.data) {
        setAtsAnalysis(result.data);
        // Find and set the best resume (the one we just analyzed)
        const target = (resumeList || resumes).find(r => r.id === resumeId);
        if (target) setBestResume({ ...target, atsScore: result.data.overallScore });
      }
    } catch (error) {
      console.error('Failed to analyze resume:', error);
    } finally {
      setAnalyzingATS(false);
    }
  };

  // Analyze ALL resumes and show the one with the highest score
  const analyzeLatestResume = async () => {
    if (resumes.length === 0) return;
    setAnalyzingATS(true);
    let bestScore = -1;
    let bestData = null;
    let topResume = null;
    try {
      for (const resume of resumes) {
        try {
          const result = await atsService.analyzeResume(resume.id, { phase: 'PHASE3', useAI: true });
          if (result.success && result.data?.overallScore > bestScore) {
            bestScore = result.data.overallScore;
            bestData = result.data;
            topResume = resume;
          }
        } catch (_) {}
      }
      if (bestData) {
        setAtsAnalysis(bestData);
        setBestResume({ ...topResume, atsScore: bestScore });
        // Refresh resume list to get updated atsScores
        const refreshed = await resumeService.getAllResumes();
        if (refreshed.success) {
          const list = refreshed.data?.resumes || refreshed.data || [];
          setResumes(Array.isArray(list) ? list : []);
        }
      }
    } finally {
      setAnalyzingATS(false);
    }
  };

  // User data from auth context
  const userData = {
    name: user?.fullName || user?.name || 'User',
    email: user?.email || '',
    initials: (user?.fullName || user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()
  };

  // Calculate stats from real data
  const totalResumes = resumes.length;
  const maxAtsScore = resumes.length > 0
    ? Math.max(...resumes.map(r => r.atsScore || 0))
    : 0;
  const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloads || 0), 0);

  const stats = [
    {
      icon: <FileText size={24} />,
      value: String(totalResumes),
      label: 'Total Resumes',
      trend: '+' + totalResumes,
      trendUp: true,
      iconClass: 'primary'
    },
    {
      icon: <Target size={24} />,
      value: maxAtsScore + '%',
      label: 'Best ATS Score',
      trend: '+' + maxAtsScore + '%',
      trendUp: maxAtsScore >= 70,
      iconClass: 'success'
    },
    {
      icon: <Download size={24} />,
      value: String(totalDownloads),
      label: 'Downloads',
      trend: '+' + totalDownloads,
      trendUp: true,
      iconClass: 'warning'
    },
    {
      icon: <Star size={24} />,
      value: '0',
      label: 'Saved Templates',
      trend: '0',
      trendUp: true,
      iconClass: 'accent'
    }
  ];

  const atsScore = atsAnalysis ? {
    score: atsAnalysis.overallScore,
    status: atsAnalysis.status?.toLowerCase() || (atsAnalysis.overallScore >= 85 ? 'excellent' : atsAnalysis.overallScore >= 70 ? 'good' : 'needs-work'),
    isAiAnalyzed: atsAnalysis.aiAnalyzed,
    phase: atsAnalysis.phase,
    resumeName: bestResume?.title || 'Best Resume',
    resumeId: bestResume?.id,
    details: [
      { label: 'Skills Match', value: `${atsAnalysis.skillsMatchScore || 0}%`, status: (atsAnalysis.skillsMatchScore || 0) >= 70 ? 'good' : 'warning' },
      { label: 'Project Relevance', value: `${atsAnalysis.projectRelevanceScore || 0}%`, status: (atsAnalysis.projectRelevanceScore || 0) >= 70 ? 'good' : 'warning' },
      { label: 'Keywords', value: `${atsAnalysis.keywordMatchScore || 0}%`, status: (atsAnalysis.keywordMatchScore || 0) >= 70 ? 'good' : 'warning' },
      { label: 'Formatting', value: `${atsAnalysis.formattingScore || 0}%`, status: (atsAnalysis.formattingScore || 0) >= 70 ? 'good' : 'warning' }
    ],
    aiFeedback: atsAnalysis.aiFeedback,
    recommendations: atsAnalysis.recommendations || [],
    missingKeywords: atsAnalysis.missingKeywords || [],
  } : bestResume && bestResume.atsScore ? {
    score: bestResume.atsScore,
    status: bestResume.atsScore >= 85 ? 'excellent' : bestResume.atsScore >= 70 ? 'good' : 'needs-work',
    isAiAnalyzed: false,
    resumeName: bestResume.title || 'Best Resume',
    resumeId: bestResume.id,
    details: [
      { label: 'Keywords Match', value: bestResume.atsScore >= 80 ? 'Good' : 'Fair', status: bestResume.atsScore >= 80 ? 'good' : 'warning' },
      { label: 'Format Score', value: 'Good', status: 'good' },
      { label: 'Experience Level', value: 'Good', status: 'good' },
      { label: 'Education Match', value: 'Good', status: 'good' }
    ]
  } : {
    score: 0,
    status: 'none',
    isAiAnalyzed: false,
    resumeId: null,
    details: [
      { label: 'Keywords Match', value: 'N/A', status: 'warning' },
      { label: 'Format Score', value: 'N/A', status: 'warning' },
      { label: 'Experience Level', value: 'N/A', status: 'warning' },
      { label: 'Education Match', value: 'N/A', status: 'warning' }
    ]
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const quickActions = [
    {
      icon: <Rocket size={26} />,
      title: 'Build from Scratch',
      description: 'Create a new resume using our AI-powered builder',
      iconClass: 'primary',
      link: '/builder'
    },
    {
      icon: <FileEdit size={26} />,
      title: 'Improve Existing',
      description: 'Upload and enhance your current resume',
      iconClass: 'secondary',
      link: '/upload'
    },
    {
      icon: <Target size={26} />,
      title: 'Target Company',
      description: 'Optimize your resume for a specific job',
      iconClass: 'accent',
      link: '/company-role'
    }
  ];

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'My Resumes', id: 'resumes', path: '/profile' },
    { icon: <FolderOpen size={20} />, label: 'Templates', id: 'templates', path: '/templates' },
    { icon: <Target size={20} />, label: 'Job Tracker', id: 'jobs', path: '/company-role' },
  ];

  const bottomNavItems = [
    { icon: <Settings size={20} />, label: 'Settings', id: 'settings', path: '/profile' },
    { icon: <HelpCircle size={20} />, label: 'Help & Support', id: 'help', path: null, action: 'mailto:support@resumebuilder.com' },
  ];

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (atsScore.score / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 85) return '#6ee7b7';
    if (score >= 70) return '#fcd34d';
    return '#ffa1b3';
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button 
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        <Link to="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <FileText size={24} />
          </div>
          <span className="sidebar-logo-text">
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="sidebar-nav-divider" />

          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (item.action) {
                  window.location.href = item.action;
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <button 
            className="sidebar-nav-item"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {userData.initials}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userData.name}</div>
            <div className="sidebar-user-email">{userData.email}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dashboard-header-left">
            <h1>Welcome back, {userData.name.split(' ')[0]}! 👋</h1>
            <p>Here's what's happening with your resumes today.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="header-btn header-btn-secondary" onClick={() => navigate('/templates')}>
              <Search size={18} />
              Templates
            </button>
            <button className="header-btn header-btn-primary" onClick={() => navigate('/builder')}>
              <Plus size={18} />
              New Resume
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="stats-grid"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="stat-card-header">
                <div className={`stat-card-icon ${stat.iconClass}`}>
                  {stat.icon}
                </div>
                <span className={`stat-card-trend ${stat.trendUp ? 'up' : 'down'}`}>
                  {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.trend}
                </span>
              </div>
              <div className="stat-card-value">{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ATS Score Card */}
        <motion.div 
          className="ats-score-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ cursor: atsScore.resumeId ? 'pointer' : 'default' }}
          onClick={() => atsScore.resumeId && navigate(`/preview?id=${atsScore.resumeId}`)}
          title={atsScore.resumeId ? `View: ${atsScore.resumeName}` : ''}
        >
          {/* ── Header ── */}
          <div className="ats-score-header">
            <div className="ats-score-title-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 className="ats-score-title">
                  {atsScore.isAiAnalyzed ? 'AI-Powered ATS Score' : 'Best ATS Score'}
                </h2>
                {atsScore.isAiAnalyzed && (
                  <span className="ai-badge">
                    <Sparkles size={13} />
                    AI Analyzed
                  </span>
                )}
              </div>
              {atsScore.resumeName && (
                <span className="ats-resume-name">{atsScore.resumeName}</span>
              )}
            </div>
            <div className="ats-score-actions">
              <button
                className="analyze-btn"
                onClick={(e) => { e.stopPropagation(); analyzeLatestResume(); }}
                disabled={analyzingATS || resumes.length === 0}
              >
                {analyzingATS ? (
                  <><RefreshCw size={16} className="spinning" /> Analyzing...</>
                ) : (
                  <><Zap size={16} /> Analyze with AI</>
                )}
              </button>
              <span className={`ats-score-badge ${atsScore.status}`}>
                {atsScore.status === 'none' ? 'No Data' : atsScore.status.charAt(0).toUpperCase() + atsScore.status.slice(1).replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* ── Score Ring + Detail Bars ── */}
          <div className="ats-score-content">
            <div className="ats-score-circle">
              <svg viewBox="0 0 120 120">
                <circle className="ats-score-circle-bg" cx="60" cy="60" r="54" />
                <motion.circle
                  className="ats-score-circle-progress"
                  cx="60" cy="60" r="54"
                  stroke={getScoreColor(atsScore.score)}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </svg>
              <div className="ats-score-circle-value">
                <motion.span
                  className="ats-score-number"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {atsScore.score}
                </motion.span>
                <span className="ats-score-label">out of 100</span>
              </div>
            </div>

            <div className="ats-score-details">
              {atsScore.details.map((detail, index) => {
                const numVal = parseInt(detail.value) || 0;
                return (
                  <div key={index} className="ats-detail-item">
                    <span className="ats-detail-label">{detail.label}</span>
                    <div className="ats-detail-bar-track">
                      <motion.div
                        className={`ats-detail-bar-fill ${detail.status}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${isNaN(numVal) ? 50 : numVal}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <span className={`ats-detail-value ${detail.status}`}>
                      {detail.status === 'good'    && <CheckCircle size={13} />}
                      {detail.status === 'warning' && <AlertCircle size={13} />}
                      {detail.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── AI Feedback ── */}
          {atsScore.aiFeedback && (
            <>
              <div className="ats-section-divider" />
              <div className="ats-ai-feedback">
                <h4><Sparkles size={14} /> AI Insights</h4>
                <p>{atsScore.aiFeedback}</p>
              </div>
            </>
          )}

          {/* ── Recommendations + Missing Skills ── */}
          {(atsScore.recommendations?.length > 0 || atsScore.missingKeywords?.length > 0) && (
            <div className="ats-bottom-row">
              {atsScore.recommendations?.length > 0 && (
                <div className="ats-recommendations">
                  <h4>Top Recommendations</h4>
                  <ul>
                    {atsScore.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {atsScore.missingKeywords?.length > 0 && (
                <div className="ats-missing-skills">
                  <h4>Skills to Add</h4>
                  <div className="skill-tags">
                    {atsScore.missingKeywords.slice(0, 6).map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Recent Resumes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">Recent Resumes</h2>
            <Link to="/profile" className="section-link">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="resume-grid">
            {loading ? (
              <div className="empty-state">
                <p>Loading resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} />
                <h3>No resumes yet</h3>
                <p>Create your first resume to get started!</p>
                <Link to="/builder" className="create-resume-btn">
                  <Plus size={18} />
                  Create Resume
                </Link>
              </div>
            ) : (
              resumes.slice(0, 3).map((resume, index) => (
              <motion.div 
                key={resume.id}
                className="resume-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/builder?resumeId=${resume.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="resume-card-preview">
                  <div className="preview-placeholder">
                    <div className="preview-line title"></div>
                    <div className="preview-line short"></div>
                    <div className="preview-line medium"></div>
                    <div className="preview-line"></div>
                    <div className="preview-line short"></div>
                  </div>
                </div>
                <div className="resume-card-content">
                  <h3 className="resume-card-title">
                    {resume.title || 'Untitled Resume'}
                    <ChevronRight size={18} className="text-dark-500" />
                  </h3>
                  <p className="resume-card-date">
                    <Clock size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Updated {formatDate(resume.updatedAt)}
                  </p>
                  <div className="resume-card-stats">
                    <div className="resume-stat">
                      <Target size={16} className="resume-stat-icon" />
                      <span className="resume-stat-value">{resume.atsScore || 0}%</span>
                      <span className="resume-stat-label">ATS</span>
                    </div>
                    <div className="resume-stat">
                      <Download size={16} className="resume-stat-icon" />
                      <span className="resume-stat-value">{resume.downloads || 0}</span>
                      <span className="resume-stat-label">Downloads</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <motion.div 
                key={index}
                className="quick-action-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(action.link)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`quick-action-icon ${action.iconClass}`}>
                  {action.icon}
                </div>
                <div className="quick-action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
