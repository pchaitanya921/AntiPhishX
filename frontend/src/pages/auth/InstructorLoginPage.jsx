import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge } from '../../components/ui';
import {
    Mail,
    Lock,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
    Eye,
    EyeOff,
    Shield,
    BookOpen,
    Presentation,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstructorLoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Redirect if already authenticated as instructor
    useEffect(() => {
        if (isAuthenticated && (user?.role === 'instructor' || user?.role === 'admin')) {
            navigate('/instructor', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password, 'instructor');
            navigate('/instructor');
        } catch (err) {
            setError(err.message || 'Authentication failed. Instructor access only.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#020203] text-white flex items-center justify-center p-6 selection:bg-cyber-cyan selection:text-black overflow-hidden">
            {/* Mesh Gradient Background - Instructor Blue/Cyan Theme */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyber-cyan/10  animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-500/10  animate-pulse [animation-delay:2s]" />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            </div>

            {/* Header / Logo */}
            <div className="fixed top-12 left-12 z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-cyber-cyan/50 transition-all duration-500">
                        <Shield className="w-6 h-6 text-white group-hover:text-cyber-cyan transition-colors" />
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">
                        AntiPhish<span className="text-cyber-cyan">X</span>
                    </span>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-[500px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                >
                    <div className="p-10 lg:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5  shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="mb-10 text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-cyber-cyan/20 border border-cyber-cyan/30 flex items-center justify-center mb-6">
                                    <Presentation size={32} className="text-cyber-cyan" />
                                </div>
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase">
                                    Instructor Hub
                                </h2>
                                <Badge className="bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1">Content & Curriculum Access</Badge>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group/input">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyber-cyan transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="instructor@enterprise.com"
                                            className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                                        />
                                    </div>

                                    <div className="relative group/input">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyber-cyan transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            placeholder="••••••••"
                                            className="w-full h-16 pl-16 pr-16 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-16 rounded-full bg-cyber-cyan text-black hover:bg-white transition-all duration-500 font-black uppercase tracking-widest text-[10px] shadow-2xl"
                                    loading={loading}
                                >
                                    Initialize Hub Session
                                </Button>

                                <div className="text-center pt-4">
                                    <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                        Return to Public Node
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

