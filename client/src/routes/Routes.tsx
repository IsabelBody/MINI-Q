import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import PatientResponse from '@/pages/PatientResponse';
import Questionnaire from '@/pages/Questionnaire';
import Portal from '@/pages/Portal';
import InviteClinician from '@/pages/ClinicianInvitePage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';  
import { useAuth } from '../context/AuthContext';
import PrivacyStatementEditor from '@/pages/PrivacyStatementEditor';


interface AuthenticatedRedirectProps {
    children: React.ReactNode;
  }

const AuthenticatedRedirect: React.FC<AuthenticatedRedirectProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
  
    if (isAuthenticated) {
      return <Navigate to="/portal" replace />;
    }
  
    return <>{children}</>;
  };

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            {
                path: "login",
                element: (
                  <AuthenticatedRedirect>
                    <LoginPage />
                  </AuthenticatedRedirect>
                ),
              },
            { path: "questions", element: <Questionnaire /> },
            { 
                path: "portal", 
                element: (
                    <ProtectedRoute>
                        <Portal />
                    </ProtectedRoute>
                )
            },
            { 
                path: "patient-response", 
                element: (
                    <ProtectedRoute>
                        <PatientResponse />
                    </ProtectedRoute>
                )
            },
            { 
                path: "invite-clinician", 
                element: (
                    <ProtectedRoute adminOnly>
                        <InviteClinician />
                    </ProtectedRoute>
                )
            },
            { 
                path: "privacy-editor", 
                element: (
                    <ProtectedRoute adminOnly>
                        <PrivacyStatementEditor />
                    </ProtectedRoute>
                )
            },
            { path: "register", element: <RegisterPage /> }, 
        ]
    }
]);
