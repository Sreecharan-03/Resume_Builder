import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home from '../pages/Home/Home';
import Auth from '../pages/Auth/Auth';

// Protected Pages - Core
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Profile/Profile';

// Phase 1: Build from Scratch
import Builder from '../pages/Builder/Builder';
import Templates from '../pages/Templates/Templates';
import Preview from '../pages/Preview/Preview';

// Phase 2: Upload & Enhance
import Upload from '../pages/Upload/Upload';
import Enhance from '../pages/Enhance/Enhance';

// Phase 3: Role-Targeted Resume Building
import CompanyRole from '../pages/CompanyRole/CompanyRole';
import ResumeSource from '../pages/ResumeSource/ResumeSource';
import RoleResumeBuilder from '../pages/RoleResumeBuilder/RoleResumeBuilder';
import ATSResult from '../pages/ATSResult/ATSResult';
import ImprovementGuide from '../pages/ImprovementGuide/ImprovementGuide';
import ImproveResume from '../pages/ImproveResume/ImproveResume';
import FinalResume from '../pages/FinalResume/FinalResume';

/**
 * AppRoutes - Centralized routing configuration
 * 
 * ROUTING ARCHITECTURE:
 * =====================
 * 
 * PUBLIC ROUTES (No authentication required):
 * - /           → Home (Landing page)
 * - /auth       → Auth (Login/Signup)
 * 
 * PROTECTED ROUTES (Authentication required):
 * 
 * Core:
 * - /dashboard  → Dashboard (Main hub)
 * - /profile    → Profile (User profile & resume history)
 * 
 * Phase 1 - Build from Scratch:
 * - /builder    → Builder (Create resume step-by-step)
 * - /templates  → Templates (Select template)
 * - /preview    → Preview (Preview & download)
 * 
 * Phase 2 - Upload & Enhance:
 * - /upload     → Upload (Upload existing resume)
 * - /enhance    → Enhance (Edit uploaded resume)
 * 
 * Phase 3 - Role-Targeted Resume Building:
 * - /company-role      → CompanyRole (Enter company & job details)
 * - /resume-source     → ResumeSource (Choose: scratch or upload)
 * - /role-builder      → RoleResumeBuilder (Build with role guidance)
 * - /ats-result        → ATSResult (View ATS score)
 * - /improvement-guide → ImprovementGuide (Get improvement tips)
 * - /improve-resume    → ImproveResume (Make improvements)
 * - /final-resume      → FinalResume (Final resume & download)
 * 
 * PAGE FLOWS:
 * ===========
 * 
 * Auth Flow:
 * Home → Auth → Dashboard
 * 
 * Phase 1 Flow (Build from Scratch):
 * Dashboard → Builder → Templates → Preview → Dashboard
 * 
 * Phase 2 Flow (Upload Existing):
 * Dashboard → Upload → Enhance → Templates → Preview → Dashboard
 * 
 * Phase 3 Flow (Role-Targeted):
 * Dashboard → CompanyRole → ResumeSource → 
 *   → (role-builder OR upload→enhance) → ATSResult →
 *   → ImprovementGuide → ImproveResume → ATSResult (loop) →
 *   → FinalResume → Dashboard
 */

const AppRoutes = () => {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Legacy routes - redirect to new paths */}
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<Navigate to="/auth" replace />} />

      {/* ========== PROTECTED ROUTES - CORE ========== */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* ========== PHASE 1: BUILD FROM SCRATCH ========== */}
      <Route 
        path="/builder" 
        element={
          <ProtectedRoute>
            <Builder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/templates" 
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/preview" 
        element={
          <ProtectedRoute>
            <Preview />
          </ProtectedRoute>
        } 
      />

      {/* ========== PHASE 2: UPLOAD & ENHANCE ========== */}
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enhance" 
        element={
          <ProtectedRoute>
            <Enhance />
          </ProtectedRoute>
        } 
      />

      {/* ========== PHASE 3: ROLE-TARGETED RESUME ========== */}
      <Route 
        path="/company-role" 
        element={
          <ProtectedRoute>
            <CompanyRole />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resume-source" 
        element={
          <ProtectedRoute>
            <ResumeSource />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/role-builder" 
        element={
          <ProtectedRoute>
            <RoleResumeBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ats-result" 
        element={
          <ProtectedRoute>
            <ATSResult />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/improvement-guide" 
        element={
          <ProtectedRoute>
            <ImprovementGuide />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/improve-resume" 
        element={
          <ProtectedRoute>
            <ImproveResume />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/final-resume" 
        element={
          <ProtectedRoute>
            <FinalResume />
          </ProtectedRoute>
        } 
      />

      {/* ========== CATCH-ALL: 404 ========== */}
      <Route 
        path="*" 
        element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
            color: '#fff',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <h1 style={{ fontSize: '6rem', margin: 0, color: '#22d3ee' }}>404</h1>
            <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              The page you're looking for doesn't exist or has been moved.
            </p>
            <a 
              href="/dashboard" 
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
                color: '#0a0a0f',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Go to Dashboard
            </a>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
