import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Input } from '../../components/ui';
import {
    Mail,
    Lock,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
    Eye,
    EyeOff,
    BookOpen,
    HelpCircle,
    Award,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const successMessage = location.state?.message;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with email:', formData.email);
            await login(formData.email, formData.password);
            console.log('Login successful');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Authentication failed. Invalid credentials.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page relative min-h-screen flex items-center justify-center p-6 bg-cyber-black overflow-hidden">
            {/* Background FX */}
            <div className="absolute inset-0 bg-cyber-grid opacity-10" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-purple/10 blur-[150px] rounded-full" />

            {/* Logo - Fixed at top left */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30 backdrop-blur-sm">
                    <Shield className="w-6 h-6 text-cyber-purple" />
                </div>
                <span className="text-xl font-black text-white italic tracking-tighter uppercase">
                    AntiPhish<span className="cyber-gradient-text">X</span>
                </span>
            </div>

            <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Welcome Message */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:block space-y-8"
                >
                    <div>
                        <h1 className="text-5xl font-black mb-4 leading-tight text-white">
                            Welcome to <span className="cyber-gradient-text">AntiPhishX</span>
                        </h1>
                        <p className="text-white/80 text-lg font-medium tracking-widest">
                            ACCESS ENTERPRISE CYBERSECURITY LABS
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30">
                                <Shield className="w-6 h-6 text-cyber-purple" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">SECURE IDENTITY</h3>
                                <p className="text-white/70 text-sm">Your credentials are protected by military-grade Argon2id hashing.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">ENTERPRISE READY</h3>
                                <p className="text-white/70 text-sm">Join thousands of professionals in the AntiPhishX cyber ecosystem.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <div className="px-4 py-2 rounded-lg bg-cyber-purple/10 border border-cyber-purple/30">
                            <span className="text-cyber-purple font-black text-xs uppercase tracking-wider">ISO 27001 ALIGNED</span>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                            <span className="text-cyan-400 font-black text-xs uppercase tracking-wider">MFA READY</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full"
                >
                    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-10 rounded-3xl border border-white/20 shadow-2xl">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white mb-2">
                                Welcome Back 👋
                            </h2>
                            <p className="text-white/50 text-sm font-medium">
                                Securely access your AntiPhishX account.
                            </p>
                        </div>

                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
                            >
                                <CheckCircle2 className="text-green-400" size={20} />
                                <p className="text-green-300 text-sm font-medium">{successMessage}</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                            >
                                <AlertCircle className="text-red-400" size={20} />
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2 ml-1">
                                    EMAIL ADDRESS
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyber-purple/40 focus:border-cyber-purple/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2 ml-1">
                                    ACCESS PASSWORD
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full h-14 pl-12 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyber-purple/40 focus:border-cyber-purple/50 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-cyber-purple to-purple-600 hover:from-cyber-purple/90 hover:to-purple-600/90 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg hover:shadow-cyber-purple/50 transition-all duration-300"
                                loading={loading}
                            >
                                {loading ? 'Authenticating...' : 'Sign In'}
                            </Button>

                            {/* Forgot Password Link */}
                            <div className="text-center">
                                <Link to="/forgot-password" className="text-white/60 hover:text-cyber-purple text-sm font-medium transition-colors">
                                    Forgot your password?
                                </Link>
                            </div>
                        </form>

                        {/* Security Indicators */}
                        <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-cyan-400" />
                                <span>Encrypted Session</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-cyan-400" />
                                <span>MFA Protected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-cyan-400" />
                                <span>Zero Trust</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-white/40">Existing identity node? </span>
                            <Link to="/register" className="text-cyber-purple font-bold hover:underline underline-offset-4">
                                Authenticate
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
