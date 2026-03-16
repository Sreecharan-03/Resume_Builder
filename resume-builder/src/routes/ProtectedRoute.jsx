import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Wraps routes that require authentication
 * Redirects to /auth if user is not authenticated
 * Preserves the intended destination for redirect after login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication status
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)'
      }}>
        <div style={{ 
          color: '#22d3ee', 
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div className="loading-spinner" style={{
            width: '24px',
            height: '24px',
            border: '3px solid rgba(34, 211, 238, 0.3)',
            borderTop: '3px solid #22d3ee',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  // Save the attempted URL for redirecting after login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
