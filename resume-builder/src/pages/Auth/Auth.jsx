import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Mail, 
  Lock, 
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they tried to visit, or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (isSignUp && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      let result;
      if (isSignUp) {
        result = await register(formData.name, formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }
      
      if (result.success) {
        // Redirect to the page they tried to visit, or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setApiError(result.error || 'Authentication failed. Please try again.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const features = [
    {
      icon: <Zap size={20} />,
      title: 'AI-Powered Writing',
      description: 'Our AI crafts compelling content tailored to your experience.'
    },
    {
      icon: <Shield size={20} />,
      title: 'ATS-Optimized',
      description: 'Get past applicant tracking systems with smart formatting.'
    },
    {
      icon: <TrendingUp size={20} />,
      title: 'Real-Time Scoring',
      description: 'Instant feedback to improve your resume performance.'
    }
  ];

  return (
    <div className="auth-container">
      {/* Background */}
      <div className="auth-background">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>

      {/* Left Side - Features */}
      <motion.div 
        className="auth-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="auth-float-element auth-float-1"></div>
        <div className="auth-float-element auth-float-2"></div>
        <div className="auth-float-element auth-float-3"></div>

        <div className="auth-left-content">
          <motion.h1 
            className="auth-left-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Build Resumes That
            <br />
            <span className="gradient-text">Get You Hired</span>
          </motion.h1>
          
          <motion.p 
            className="auth-left-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join thousands of professionals who've landed their dream jobs 
            using our AI-powered resume builder. Create, optimize, and succeed.
          </motion.p>

          <motion.div 
            className="auth-features-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="auth-feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              >
                <div className="auth-feature-icon">
                  {feature.icon}
                </div>
                <div className="auth-feature-text">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="auth-right">
        <motion.div 
          className="auth-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Logo */}
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <FileText size={26} />
            </div>
            <span className="auth-logo-text">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Form Card */}
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="auth-subtitle">
                {isSignUp 
                  ? 'Start building your professional resume today' 
                  : 'Sign in to continue to your dashboard'}
              </p>
            </div>

            {/* Toggle */}
            <div className="auth-toggle">
              <button 
                className={`auth-toggle-btn ${!isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
              <button 
                className={`auth-toggle-btn ${isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {apiError && (
                <div className="auth-api-error">
                  {apiError}
                </div>
              )}
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div 
                    key="name-field"
                    className="form-group"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <label className="form-label">Full Name</label>
                    <div className="form-input-wrapper">
                      <input
                        type="text"
                        name="name"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      <User size={18}  />
                    </div>
                    {errors.name && (
                      <span className="form-error">{errors.name}</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <Mail size={18}  />
                </div>
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <Lock size={18} />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="form-error">{errors.password}</span>
                )}
              </div>

              {!isSignUp && (
                <a href="#" className="auth-forgot-link">Forgot password?</a>
              )}

              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div 
                    key="terms-checkbox"
                    className="form-checkbox-wrapper"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      id="agreeTerms"
                      className="form-checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agreeTerms" className="form-checkbox-label">
                      I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line"></div>
              <span className="auth-divider-text">or continue with</span>
              <div className="auth-divider-line"></div>
            </div>

            {/* Social Buttons */}
            <div className="auth-social-buttons">
              <motion.button 
                className="auth-social-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>
              <motion.button 
                className="auth-social-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
