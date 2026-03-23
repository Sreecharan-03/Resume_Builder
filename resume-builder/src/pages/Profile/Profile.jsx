import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { resumeService, userService } from '../../services';
import {
  FileText,
  LayoutDashboard,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit3,
  Download,
  Trash2,
  Eye,
  Bell,
  Lock,
  Moon,
  Globe,
  Shield,
  Camera,
  Save,
  Target,
  Menu,
  X,
  Crown
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { refreshTrigger } = useResume();
  const [loading, setLoading] = useState(true);
  const [resumeHistory, setResumeHistory] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user resumes
  const fetchResumes = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const result = await resumeService.getAllResumes();
      if (result.success) {
        const resumeData = result.data?.resumes || result.data || [];
        setResumeHistory(Array.isArray(resumeData) ? resumeData : []);
      } else {
        setResumeHistory([]);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setResumeHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [isAuthenticated, refreshTrigger]);

  useEffect(() => {
    const handleResumeUpdated = () => {
      if (isAuthenticated) fetchResumes();
    };

    const handleWindowFocus = () => {
      if (isAuthenticated) fetchResumes();
    };

    const handleStorageChange = (event) => {
      if (event.key === 'resumeLastUpdatedAt' && isAuthenticated) {
        fetchResumes();
      }
    };

    window.addEventListener('resume-updated', handleResumeUpdated);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('resume-updated', handleResumeUpdated);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, refreshTrigger]);

  const nameParts = (user?.fullName || 'User').split(' ');
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    location: '',
    title: '',
    bio: ''
  });

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      const nameParts = (user.fullName || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: true,
    twoFactor: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'My Resumes', path: '/dashboard' },
    { icon: <FolderOpen size={20} />, label: 'Templates', path: '/templates' },
    { icon: <Target size={20} />, label: 'Job Tracker', path: '/dashboard' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="profile-container">
      {/* Mobile Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 60,
          background: 'rgba(6, 182, 212, 0.2)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '12px',
          padding: '0.75rem',
          color: '#22d3ee',
          cursor: 'pointer',
          display: 'none'
        }}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: '280px',
        minHeight: '100vh',
        background: 'rgba(2, 6, 23, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #06b6d4, #f97316)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <FileText size={24} />
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'white'
          }}>
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav style={{ flex: 1 }}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                color: '#94a3b8',
                textDecoration: 'none',
                borderRadius: '12px',
                marginBottom: '0.25rem',
                transition: 'all 0.3s'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1rem 0' }} />

          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(249, 115, 22, 0.15))',
              color: '#22d3ee',
              textDecoration: 'none',
              borderRadius: '12px',
              marginBottom: '0.25rem'
            }}
          >
            <User size={20} />
            Profile
          </Link>

          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              color: '#94a3b8',
              background: 'none',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="profile-main">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="profile-header">
            <h1>Profile Settings</h1>
            <p>Manage your account information and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                {formData.firstName[0]}{formData.lastName[0]}
                <button className="profile-avatar-edit">
                  <Camera size={16} />
                </button>
              </div>
              <div className="profile-info">
                <h2>{formData.firstName} {formData.lastName}</h2>
                <p>{formData.email}</p>
                <span className="badge">
                  <Crown size={14} />
                  Pro Member
                </span>
              </div>
            </div>

            <div className="section-title">
              <div className="section-title-icon">
                <User size={20} />
              </div>
              Personal Information
            </div>

            <div className="profile-form">
              <div className="profile-form-group">
                <label className="profile-form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="profile-form-input"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="profile-form-input"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-form-input"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="profile-form-input"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="profile-form-input"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="profile-form-input"
                />
              </div>
              <div className="profile-form-group full-width">
                <label className="profile-form-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="profile-form-input profile-form-textarea"
                />
              </div>
            </div>

            <motion.button 
              className="profile-save-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={18} />
              Save Changes
            </motion.button>
          </div>

          {/* Resume History */}
          <div className="profile-card">
            <div className="section-title">
              <div className="section-title-icon">
                <FileText size={20} />
              </div>
              Resume History
            </div>

            <div className="resume-history-list">
              {loading ? (
                <p style={{color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '2rem'}}>Loading resumes...</p>
              ) : resumeHistory.length === 0 ? (
                <p style={{color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '2rem'}}>No resumes yet. Create your first resume!</p>
              ) : resumeHistory.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  className="resume-history-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="resume-history-info">
                    <div className="resume-history-icon">
                      <FileText size={24} />
                    </div>
                    <div className="resume-history-details">
                      <h4>{resume.title || 'Untitled Resume'}</h4>
                      <p>Created on {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'N/A'} • ATS Score: {resume.atsScore || 'N/A'}%</p>
                    </div>
                  </div>
                  <div className="resume-history-actions">
                    <button className="history-action-btn" onClick={() => navigate(`/builder?id=${resume.id}`)}>
                      <Eye size={16} />
                    </button>
                    <button className="history-action-btn">
                      <Download size={16} />
                    </button>
                    <button className="history-action-btn delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>


          {/* Settings */}
          <div className="profile-card">
            <div className="section-title">
              <div className="section-title-icon">
                <Settings size={20} />
              </div>
              Preferences
            </div>

            <div className="settings-grid">
              <div className="settings-item">
                <div className="settings-item-info">
                  <div className="settings-item-icon">
                    <Bell size={20} />
                  </div>
                  <div className="settings-item-text">
                    <h4>Email Notifications</h4>
                    <p>Receive updates via email</p>
                  </div>
                </div>
                <div 
                  className={`toggle-switch ${settings.emailNotifications ? 'active' : ''}`}
                  onClick={() => toggleSetting('emailNotifications')}
                />
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <div className="settings-item-icon">
                    <Moon size={20} />
                  </div>
                  <div className="settings-item-text">
                    <h4>Dark Mode</h4>
                    <p>Use dark theme</p>
                  </div>
                </div>
                <div 
                  className={`toggle-switch ${settings.darkMode ? 'active' : ''}`}
                  onClick={() => toggleSetting('darkMode')}
                />
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <div className="settings-item-icon">
                    <Shield size={20} />
                  </div>
                  <div className="settings-item-text">
                    <h4>Two-Factor Auth</h4>
                    <p>Add extra security</p>
                  </div>
                </div>
                <div 
                  className={`toggle-switch ${settings.twoFactor ? 'active' : ''}`}
                  onClick={() => toggleSetting('twoFactor')}
                />
              </div>

              <div className="settings-item">
                <div className="settings-item-info">
                  <div className="settings-item-icon">
                    <Globe size={20} />
                  </div>
                  <div className="settings-item-text">
                    <h4>Public Profile</h4>
                    <p>Make profile visible</p>
                  </div>
                </div>
                <div 
                  className={`toggle-switch ${settings.pushNotifications ? 'active' : ''}`}
                  onClick={() => toggleSetting('pushNotifications')}
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="profile-card">
            <div className="danger-zone">
              <h4>Danger Zone</h4>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button className="danger-btn">Delete Account</button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
