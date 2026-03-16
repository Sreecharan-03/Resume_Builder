import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  FileText, 
  Target, 
  Sparkles, 
  Zap, 
  Shield, 
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Star
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const features = [
    {
      icon: <Zap size={28} />,
      title: 'AI-Powered Builder',
      description: 'Let our advanced AI craft compelling content that highlights your unique strengths and achievements.',
      iconClass: 'feature-icon-primary'
    },
    {
      icon: <Target size={28} />,
      title: 'ATS Optimization',
      description: 'Beat applicant tracking systems with smart keyword optimization and formatting that gets you noticed.',
      iconClass: 'feature-icon-secondary'
    },
    {
      icon: <Shield size={28} />,
      title: 'Industry Templates',
      description: 'Choose from 50+ professionally designed templates tailored for every industry and career level.',
      iconClass: 'feature-icon-accent'
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'Real-Time Scoring',
      description: 'Get instant feedback with our proprietary scoring system that rates your resume against top performers.',
      iconClass: 'feature-icon-primary'
    },
    {
      icon: <Award size={28} />,
      title: 'Expert Reviews',
      description: 'Access detailed insights and suggestions from HR professionals and recruiters.',
      iconClass: 'feature-icon-secondary'
    },
    {
      icon: <Sparkles size={28} />,
      title: 'One-Click Export',
      description: 'Download your polished resume as PDF or print directly from your browser.',
      iconClass: 'feature-icon-accent'
    }
  ];

  const stats = [
    { number: 'AI', label: 'Powered Analysis' },
    { number: '10+', label: 'Templates' },
    { number: 'ATS', label: 'Optimized' },
    { number: 'Free', label: 'To Use' }
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
      <motion.header 
        className={`nav-header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <FileText size={24} />
            </div>
            <span>Resume<span className="gradient-text">AI</span></span>
          </Link>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#templates" className="nav-link">Templates</a>
            <Link to="/auth" className="nav-link">Sign In</Link>
            <Link to="/auth" className="nav-btn">
              Get Started <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
            </Link>
          </nav>

          <button 
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-blob blob-1"></div>
          <div className="hero-blob blob-2"></div>
          <div className="hero-blob blob-3"></div>
          
          {/* Floating Elements */}
          <div className="floating-element floating-1"></div>
          <div className="floating-element floating-2"></div>
          <div className="floating-element floating-3"></div>
        </div>

        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="hero-badge">
            <Star size={16} />
           
          </motion.div>

          <motion.h1 variants={fadeInUp} className="hero-title">
            Build Your Perfect Resume with{' '}
            <span className="gradient-text">AI-Powered</span> Precision
          </motion.h1>

          <motion.p variants={fadeInUp} className="hero-subtitle">
            Create stunning, ATS-optimized resumes in minutes. Our intelligent platform 
            transforms your experience into a compelling story that lands interviews.
          </motion.p>

          <motion.div variants={fadeInUp} className="action-buttons">
            <Link to="/builder" className="action-btn action-btn-primary">
              <Rocket size={20} />
              Build from Scratch
            </Link>
            <Link to="/upload" className="action-btn action-btn-secondary">
              <FileText size={20} />
              Improve Existing Resume
            </Link>
            <Link to="/company-role" className="action-btn action-btn-accent">
              <Target size={20} />
              Role-Based Resume Builder
            </Link>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map((i) => (
                <div 
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 border-2 border-dark-950 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-dark-400">Trusted by job seekers</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <motion.div 
          className="features-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="features-title">
            Why Choose <span className="gradient-text">ResumeAI</span>?
          </h2>
          <p className="features-subtitle">
            Everything you need to create professional resumes that get results. 
            Powered by AI, designed by experts.
          </p>
        </motion.div>

        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`feature-icon ${feature.iconClass}`}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <motion.div 
          className="stats-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-item"
              variants={scaleIn}
            >
              <div className="stat-number gradient-text">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="cta-title">
            Ready to Land Your Dream Job?
          </h2>
          <p className="cta-subtitle">
            Join over 500,000 professionals who've transformed their careers 
            with ResumeAI. Start building your future today.
          </p>
          <Link to="/auth" className="action-btn action-btn-primary">
            <Sparkles size={20} />
            Create Your Resume Now
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">ResumeAI</span>
          </div>
          <p className="text-dark-500 text-sm">
            © 2026 ResumeAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-dark-500 hover:text-white transition-colors text-sm">Privacy</a>
            <a href="#" className="text-dark-500 hover:text-white transition-colors text-sm">Terms</a>
            <a href="#" className="text-dark-500 hover:text-white transition-colors text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
