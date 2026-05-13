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
    Fingerprint,
    Cpu,
    LockKeyhole
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Redirect if already authenticated as admin
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password, 'admin');
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Authentication failed. Administrative access only.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#020203] text-white flex items-center justify-center p-6 selection:bg-cyber-purple selection:text-white overflow-hidden">
            {/* Mesh Gradient Background - Admin Red/Purple Theme */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyber-purple/20  animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/5  animate-pulse [animation-delay:2s]" />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            </div>

            {/* Header / Logo */}
            <div className="fixed top-12 left-12 z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-cyber-purple/50 transition-all duration-500">
                        <Shield className="w-6 h-6 text-white group-hover:text-cyber-purple transition-colors" />
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">
                        AntiPhish<span className="text-cyber-purple">X</span>
                    </span>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-[500px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                >
                    <div className="p-10 lg:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5  shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="mb-10 text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-cyber-purple/20 border border-cyber-purple/30 flex items-center justify-center mb-6">
                                    <LockKeyhole size={32} className="text-cyber-purple" />
                                </div>
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase">
                                    Command Core
                                </h2>
                                <Badge className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1">Administrative Access Only</Badge>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group/input">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyber-purple transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="admin@enterprise.com"
                                            className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                                        />
                                    </div>

                                    <div className="relative group/input">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-cyber-purple transition-colors">
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
                                    className="w-full h-16 rounded-full bg-white text-black hover:bg-cyber-purple hover:text-white font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all duration-500"
                                    loading={loading}
                                >
                                    Authorize Access
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

