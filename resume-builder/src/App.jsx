import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import { AppRoutes } from './routes';

/**
 * App - Main application component
 * 
 * Structure:
 * - AuthProvider: Provides authentication context throughout the app
 * - ResumeProvider: Provides resume data context for live preview sync
 * - Router: React Router for navigation
 * - AppRoutes: Centralized route configuration
 * 
 * See src/routes/AppRoutes.jsx for complete routing documentation
 */
function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ResumeProvider>
    </AuthProvider>
  );
}

export default App;
