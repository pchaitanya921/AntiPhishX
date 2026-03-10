import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import MyCourses from './pages/MyCourses';
import AdminDashboard from './pages/AdminDashboard';
import AdminLabsPage from './pages/AdminLabsPage';
import AdminLabEditorPage from './pages/AdminLabEditorPage';
import InstructorDashboard from './pages/InstructorDashboard';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import LabsPage from './pages/LabsPage';
import LabPlayerPage from './pages/LabPlayerPage';
import AchievementsPage from './pages/AchievementsPage';
import BadgesPage from './pages/BadgesPage';
import CertificatesPage from './pages/CertificatesPage';
import QuizzesPage from './pages/QuizzesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import InstructorCoursesPage from './pages/instructor/InstructorCoursesPage';
import InstructorCourseDetailsPage from './pages/instructor/InstructorCourseDetailsPage';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import AdminCourseDetails from './pages/AdminCourseDetails';
import AdminAnalytics from './pages/AdminAnalytics';
import LabAnalyticsPage from './pages/LabAnalyticsPage';
import LabSubmissionsPage from './pages/LabSubmissionsPage';
import SecurityLogs from './pages/SecurityLogs';
// Old AIControl page removed - new multi-mode AI system will be added
import AICopilot from './pages/AICopilot';
// Old AIChat removed - new multi-mode AI system added as full page
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { SidebarProvider } from './components/Sidebar';
import Footer from './components/Footer';
import PhishingScanner from './pages/PhishingScanner';
import ScenarioGenerator from './pages/ScenarioGenerator';
import DatasetReferencePage from './pages/DatasetReferencePage';
import QuizPlayerPage from './pages/QuizPlayerPage';
import QuizResultPage from './pages/QuizResultPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cyber-black">
                <div className="w-16 h-16 border-4 border-cyber-purple/30 border-t-cyber-purple rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AuthWrapper = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const isLight = theme === 'light';

    // Check if current route is a fullscreen page (AI, Lab Player, Course Player)
    const isAiPage = location.pathname === '/ai-copilot' || location.pathname === '/admin/ai';
    const isLabPlayer = location.pathname.startsWith('/labs/');
    const isCoursePlayer = location.pathname.startsWith('/courses/');
    const isFullScreenPage = isAiPage || isLabPlayer || isCoursePlayer;

    if (loading) return null;

    return (
        <div
            className="cyber-space-container min-h-screen relative transition-all duration-500 flex flex-col"
            style={{
                background: isLight
                    ? 'radial-gradient(circle at 50% 20%, #e8eeff 0%, #f0f4ff 100%)'
                    : undefined,
                color: isLight ? '#0d1117' : '#ffffff',
            }}
        >
            {!isLight && <div className="star-field opacity-100" />}
            {!isLight && <div className="nebula-purple opacity-60 blend-mode-screen" />}
            {!isLight && <div className="nebula-cyan opacity-40 blend-mode-screen" />}
            {!isLight && <div className="cyber-grid-perspective opacity-100" />}

            {/* Galaxy Effects */}
            <div className="galaxy-dust galaxy-dust-1" />
            <div className="galaxy-dust galaxy-dust-2" />
            <div className="galaxy-dust galaxy-dust-3" />

            {/* Shooting Stars */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <div key={`star-${i}`} className="shooting-star" />
                ))}
            </div>

            {/* New Animated Elements */}
            <div className="scanning-beam" />
            <div className="glow-orb glow-orb-1" />
            <div className="glow-orb glow-orb-2" />

            {/* Floating Particles */}
            <div className="floating-particles">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="particle" />
                ))}
            </div>

            {/* Data Streams */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="data-stream" />
                ))}
            </div>

            {isAuthenticated && <Navbar />}

            <div className="flex relative z-10 flex-1 flex-col">
                <div className="flex flex-1">
                    {isAuthenticated && <Sidebar />}
                    <main className={`flex-1 transition-all duration-500 ${isAuthenticated
                        ? `lg:pl-24 ${isFullScreenPage ? 'pt-16 sm:pt-20' : 'pt-20 sm:pt-32'}`
                        : 'pt-0'
                        } flex flex-col min-h-0`}>
                        <div className={`flex-1 flex flex-col min-h-0 ${isAuthenticated && !isFullScreenPage ? 'px-4 sm:px-6 lg:px-10 max-w-[1700px] mx-auto w-full mb-12' : 'w-full h-full'}`}>
                            {children}
                        </div>
                        {/* Hide global footer on AI and other fullscreen pages to maximize space */}
                        {!isFullScreenPage && <Footer />}
                    </main>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <SidebarProvider>
                    <AuthWrapper>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/social-logs" element={<SecurityLogs />} />
                            <Route path="/ai-copilot" element={<AICopilot />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />


                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-courses"
                                element={
                                    <ProtectedRoute>
                                        <MyCourses />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/courses"
                                element={
                                    <ProtectedRoute>
                                        <CoursesPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/courses/:id"
                                element={
                                    <ProtectedRoute>
                                        <CoursePlayerPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute>
                                        <SettingsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/labs"
                                element={
                                    <ProtectedRoute>
                                        <LabsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/labs/:id"
                                element={
                                    <ProtectedRoute>
                                        <LabPlayerPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Achievements Route */}
                            <Route
                                path="/achievements"
                                element={
                                    <ProtectedRoute>
                                        <AchievementsPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Badges Route */}
                            <Route
                                path="/badges"
                                element={
                                    <ProtectedRoute>
                                        <BadgesPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Certificates Route */}
                            <Route
                                path="/certificates"
                                element={
                                    <ProtectedRoute>
                                        <CertificatesPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Quizzes Route */}
                            <Route
                                path="/quizzes"
                                element={
                                    <ProtectedRoute>
                                        <QuizzesPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Leaderboard Route */}
                            <Route
                                path="/leaderboard"
                                element={
                                    <ProtectedRoute>
                                        <LeaderboardPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Instructor Routes */}
                            <Route
                                path="/instructor"
                                element={
                                    <ProtectedRoute requiredRole="instructor">
                                        <InstructorDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/instructor/courses"
                                element={
                                    <ProtectedRoute requiredRole="instructor">
                                        <InstructorCoursesPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/instructor/courses/:id"
                                element={
                                    <ProtectedRoute requiredRole="instructor">
                                        <InstructorCourseDetailsPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Lab Management Routes */}
                            <Route
                                path="/admin/labs"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminLabsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/labs/new"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminLabEditorPage />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Context-Aware Lab Tools (Admin + Instructor) */}
                            <Route
                                path="/admin/labs/:id/analytics"
                                element={
                                    <ProtectedRoute requiredRole="instructor">
                                        <LabAnalyticsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/labs/:id/submissions"
                                element={
                                    <ProtectedRoute requiredRole="instructor">
                                        <LabSubmissionsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/labs/:id/edit"
                                element={
                                    <ProtectedRoute requiredRole="instructor">
                                        <AdminLabEditorPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <UserManagement />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/courses"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <CourseManagement />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/courses/:id"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminCourseDetails />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/analytics"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminAnalytics />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/security/logs"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <SecurityLogs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/ai"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AICopilot />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Research Feature Routes */}
                            <Route
                                path="/phishing-scanner"
                                element={<ProtectedRoute><PhishingScanner /></ProtectedRoute>}
                            />
                            <Route
                                path="/scenario-generator"
                                element={<ProtectedRoute requiredRole="instructor"><ScenarioGenerator /></ProtectedRoute>}
                            />
                            <Route
                                path="/datasets"
                                element={<ProtectedRoute><DatasetReferencePage /></ProtectedRoute>}
                            />
                            <Route
                                path="/quizzes/:quizId"
                                element={<ProtectedRoute><QuizPlayerPage /></ProtectedRoute>}
                            />
                            <Route
                                path="/quiz-result"
                                element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>}
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AuthWrapper>
                </SidebarProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
