import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import InstructorLoginPage from './pages/auth/InstructorLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import MyCourses from './pages/MyCourses';
import AdminDashboard from './pages/AdminDashboard';
import AdminBriefingManager from './pages/AdminBriefingManager';
import AdminEnterpriseManager from './pages/AdminEnterpriseManager';
import AdminSubscriptionPage from './pages/AdminSubscriptionPage';
import AdminLabsPage from './pages/AdminLabsPage';
import AdminLabEditorPage from './pages/AdminLabEditorPage';
import AdminQuizzesPage from './pages/AdminQuizzesPage';
import AdminQuizEditorPage from './pages/AdminQuizEditorPage';
import InstructorDashboard from './pages/InstructorDashboard';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import CourseLandingPage from './pages/CourseLandingPage';
import LabsPage from './pages/LabsPage';
import LabPlayerPage from './pages/LabPlayerPage';
import AchievementsPage from './pages/AchievementsPage';
import BadgesPage from './pages/BadgesPage';
import CertificatesPage from './pages/CertificatesPage';
import CertificationRoadmap from './pages/CertificationRoadmap';
import AdminCertificationManager from './pages/AdminCertificationManager';
import CertificateVerificationPage from './pages/CertificateVerificationPage';
import DatasetReferencePage from './pages/DatasetReferencePage';
import QuizzesPage from './pages/QuizzesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import InstructorCoursesPage from './pages/instructor/InstructorCoursesPage';
import InstructorCourseDetailsPage from './pages/instructor/InstructorCourseDetailsPage';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import AdminCourseDetails from './pages/AdminCourseDetails';
import AdminCampaignManager from './pages/AdminCampaignManager';
import AnalyticsPage from './pages/AnalyticsPage';
import EnterpriseAnalytics from './pages/EnterpriseAnalytics';
import LabAnalyticsPage from './pages/LabAnalyticsPage';
import LabSubmissionsPage from './pages/LabSubmissionsPage';
import ExecutiveIntelligence from './pages/ExecutiveIntelligence';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import PricingPage from './pages/PricingPage';
import SecurityLogs from './pages/SecurityLogs';
import AICopilot from './pages/AICopilot';
import DeviceManagementPage from './pages/DeviceManagementPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import Navbar from './components/Navbar';
import Sidebar, { SidebarProvider } from './components/Sidebar';
import Footer from './components/Footer';
import PhishingScanner from './pages/PhishingScanner';
import ScenarioGenerator from './pages/ScenarioGenerator';
import QuizPlayerPage from './pages/QuizPlayerPage';
import QuizResultPage from './pages/QuizResultPage';
import SimulationResult from './pages/SimulationResult';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingSupportAI from './components/ai/FloatingSupportAI';

// --- Loading Component (Modern Emerald) ---
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <div className="flex flex-col items-center gap-8">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20  rounded-full animate-pulse" />
                <div className="w-20 h-20 border-[3px] border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin relative z-10" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 animate-pulse">Initializing Neural Link</div>
                <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">Secure Node Gateway v7.2</div>
            </div>
        </div>
    </div>
);

// --- Route Guards ---
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
    
    const isAdminPrivileged = ['admin', 'superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user?.role);
    if (!isAdminPrivileged) return <Navigate to="/dashboard" replace />;
    
    return children;
};

const InstructorRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/instructor/login" replace />;
    
    const isInstructorPrivileged = ['instructor', 'admin', 'superAdmin', 'internalTester'].includes(user?.role);
    if (!isInstructorPrivileged) return <Navigate to="/dashboard" replace />;
    
    return children;
};

const UserRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role === 'instructor' && window.location.pathname === '/dashboard') return <Navigate to="/instructor/dashboard" replace />;
    if (user?.role === 'admin' && window.location.pathname === '/dashboard') return <Navigate to="/admin/dashboard" replace />;
    return children;
};

// --- Structural Wrapper (Premium Layout) ---
const AuthWrapper = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const isLight = theme === 'light';

    const isFullScreenPage = [
        '/ai-copilot', 
        '/admin/ai', 
        '/scenario-generator'
    ].includes(location.pathname) || 
    location.pathname.startsWith('/labs/') || 
    location.pathname.startsWith('/courses/');

    if (loading) return <LoadingSpinner />;

    return (
        <div 
            className="min-h-screen relative transition-all duration-700 flex flex-col bg-[#0A0A0A] overflow-x-hidden"
            style={{ color: isLight ? '#0d1117' : '#ffffff' }}
        >
            {/* High-Fidelity Ambient Background */}
            {!isLight && (
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#0A0A0A] to-[#121212]" />
                    <div className="star-field" />
                    <div className="nebula-emerald" />
                    <div className="nebula-lime" />
                    <div className="cyber-grid-perspective" />
                    <div className="scanning-beam" />
                </div>
            )}

            {/* Content Layout */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <div className="flex flex-1 pt-20">
                    {isAuthenticated && <Sidebar />}
                    
                    <main className={`flex-1 transition-all duration-700 ${isAuthenticated 
                        ? `lg:pl-28 ${isFullScreenPage ? 'pt-0' : 'pt-12'}` 
                        : 'pt-0'
                    } flex flex-col`}>
                        <div className={`flex-1 flex flex-col ${isAuthenticated && !isFullScreenPage 
                            ? 'px-6 sm:px-10 lg:px-16 max-w-[1800px] mx-auto w-full pb-20' 
                            : 'w-full h-full'}`}>
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex-1 flex flex-col"
                                >
                                    {children}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        {!isFullScreenPage && <Footer />}
                    </main>
                </div>

                {/* Global Support AI */}
                {isAuthenticated && <FloatingSupportAI />}
            </div>
        </div>
    );
};


import { SocketProvider } from './context/SocketContext';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <SidebarProvider>
                        <AuthWrapper>
                            <Toaster 
                                position="top-right"
                                toastOptions={{
                                    style: {
                                        background: '#0c0c0e',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '1rem',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }
                                }}
                            />
                            <Routes>
                                {/* ... routes ... */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/admin/login" element={<AdminLoginPage />} />
                                <Route path="/instructor/login" element={<InstructorLoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="/reset-password" element={<ResetPasswordPage />} />
                                <Route path="/pricing" element={<PricingPage />} />
                                <Route path="/training/:courseSlug" element={<CourseLandingPage />} />

                                <Route path="/dashboard" element={<UserRoute><DashboardPage /></UserRoute>} />
                                <Route path="/my-courses" element={<UserRoute><MyCourses /></UserRoute>} />
                                <Route path="/courses" element={<UserRoute><CoursesPage /></UserRoute>} />
                                <Route path="/courses/:id" element={<UserRoute><CoursePlayerPage /></UserRoute>} />
                                <Route path="/labs" element={<UserRoute><LabsPage /></UserRoute>} />
                                <Route path="/labs/:id" element={<UserRoute><LabPlayerPage /></UserRoute>} />
                                <Route path="/phishing-scanner" element={<UserRoute><PhishingScanner /></UserRoute>} />
                                <Route path="/quizzes" element={<UserRoute><QuizzesPage /></UserRoute>} />
                                <Route path="/quizzes/:quizId" element={<UserRoute><QuizPlayerPage /></UserRoute>} />
                                <Route path="/quiz-result" element={<UserRoute><QuizResultPage /></UserRoute>} />
                                <Route path="/leaderboard" element={<UserRoute><LeaderboardPage /></UserRoute>} />
                                <Route path="/achievements" element={<UserRoute><AchievementsPage /></UserRoute>} />
                                <Route path="/badges" element={<UserRoute><BadgesPage /></UserRoute>} />
                                <Route path="/certificates" element={<UserRoute><CertificatesPage /></UserRoute>} />
                                <Route path="/academy/roadmap" element={<UserRoute><CertificationRoadmap /></UserRoute>} />
                                <Route path="/datasets" element={<UserRoute><DatasetReferencePage /></UserRoute>} />
                                <Route path="/profile" element={<UserRoute><ProfilePage /></UserRoute>} />
                                <Route path="/settings" element={<UserRoute><SettingsPage /></UserRoute>} />
                                <Route path="/ai-copilot" element={<UserRoute><AICopilot /></UserRoute>} />
                                <Route path="/dashboard/devices" element={<UserRoute><DeviceManagementPage /></UserRoute>} />

                                <Route path="/instructor/dashboard" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
                                <Route path="/instructor/courses" element={<InstructorRoute><InstructorCoursesPage /></InstructorRoute>} />
                                <Route path="/instructor/courses/:id" element={<InstructorRoute><InstructorCourseDetailsPage /></InstructorRoute>} />

                                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                                <Route path="/admin/certifications" element={<AdminRoute><AdminCertificationManager /></AdminRoute>} />
                                <Route path="/admin/briefings" element={<AdminRoute><AdminBriefingManager /></AdminRoute>} />
                                <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptionPage /></AdminRoute>} />
                                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                                <Route path="/admin/courses" element={<AdminRoute><CourseManagement /></AdminRoute>} />
                                <Route path="/admin/courses/:id" element={<AdminRoute><AdminCourseDetails /></AdminRoute>} />
                                <Route path="/admin/labs" element={<AdminRoute><AdminLabsPage /></AdminRoute>} />
                                <Route path="/admin/labs/new" element={<AdminRoute><AdminLabEditorPage /></AdminRoute>} />
                                <Route path="/admin/labs/:id/edit" element={<AdminRoute><AdminLabEditorPage /></AdminRoute>} />
                                <Route path="/admin/labs/:id/analytics" element={<AdminRoute><LabAnalyticsPage /></AdminRoute>} />
                                <Route path="/admin/labs/:id/submissions" element={<AdminRoute><LabSubmissionsPage /></AdminRoute>} />
                                <Route path="/admin/quizzes" element={<AdminRoute><AdminQuizzesPage /></AdminRoute>} />
                                <Route path="/admin/quizzes/new" element={<AdminRoute><AdminQuizEditorPage /></AdminRoute>} />
                                <Route path="/admin/quizzes/:id/edit" element={<AdminRoute><AdminQuizEditorPage /></AdminRoute>} />
                                <Route path="/admin/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
                                <Route path="/admin/enterprise" element={<AdminRoute><AdminEnterpriseManager /></AdminRoute>} />
                                <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaignManager /></AdminRoute>} />
                                <Route path="/admin/intelligence" element={<AdminRoute><ExecutiveIntelligence /></AdminRoute>} />
                                <Route path="/admin/enterprise-dashboard" element={<AdminRoute><EnterpriseDashboard /></AdminRoute>} />
                                <Route path="/admin/security/logs" element={<AdminRoute><SecurityLogs /></AdminRoute>} />
                                <Route path="/admin/ai" element={<AdminRoute><AICopilot /></AdminRoute>} />
                                <Route path="/scenario-generator" element={<AdminRoute><ScenarioGenerator /></AdminRoute>} />

                                <Route path="/simulation-result" element={<SimulationResult />} />
                                <Route path="/verify/:certId" element={<CertificateVerificationPage />} />
                                <Route path="/verify-certificate/:certId" element={<CertificateVerificationPage />} />
                                <Route path="/payment-success" element={<UserRoute><PaymentSuccessPage /></UserRoute>} />
                                <Route path="/social-logs" element={<SecurityLogs />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </AuthWrapper>
                    </SidebarProvider>
                </BrowserRouter>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;

