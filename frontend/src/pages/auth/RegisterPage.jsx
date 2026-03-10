import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Input, Badge } from '../../components/ui';
import { Mail, Lock, User, AlertCircle, ShieldPlus, CheckCircle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'learner',
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            console.log('Attempting registration with email:', formData.email);
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            console.log('Registration successful');
            navigate('/login', {
                state: { message: 'Registration successful! Node initialized. Please authenticate.' }
            });
        } catch (err) {
            console.error('Registration error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Registration sequence aborted. Check input parameters.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page relative min-h-screen flex items-center justify-center p-4 bg-cyber-black overflow-hidden">
            {/* Background FX */}
            <div className="absolute inset-0 bg-cyber-grid opacity-10" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-purple/10 blur-[150px] rounded-full" />

            <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 gap-8 items-center">

                {/* Left Side: Onboarding Intel */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:block space-y-8 pr-12"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldPlus className="w-8 h-8 text-cyber-purple" />
                        <span className="text-2xl font-black tracking-tighter uppercase italic">AntiPhish<span className="cyber-gradient-text italic">X</span></span>
                    </div>

                    <h1 className="text-5xl font-black leading-tight">
                        Initialize your <span className="text-cyber-purple">Identity Node</span>
                    </h1>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-cyber-purple/20 text-cyber-purple">
                                <Fingerprint size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-white uppercase tracking-tight text-sm">Secure Identity</p>
                                <p className="text-xs text-cyber-gray leading-relaxed font-medium">Your credentials are protected by military-grade Argon2id hashing.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-cyber-cyan/20 text-cyber-cyan">
                                <ShieldPlus size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-white uppercase tracking-tight text-sm">Enterprise Ready</p>
                                <p className="text-xs text-cyber-gray leading-relaxed font-medium">Join thousands of professionals in the AntiPhishX cyber ecosystem.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <Badge variant="primary">ISO-27001 Aligned</Badge>
                        <Badge variant="cyan">MFA Ready</Badge>
                    </div>
                </motion.div>

                {/* Right Side: Register Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-8 lg:p-10">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-2xl font-black mb-2 tracking-tight">Create Identity Node</h2>
                            <p className="text-cyber-gray text-xs font-bold uppercase tracking-widest">Access Enterprise Cybersecurity Labs</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-bold"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    icon={User}
                                    placeholder="Agent"
                                    required
                                />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    icon={User}
                                    placeholder="Name"
                                    required
                                />
                            </div>

                            <Input
                                label="Enterprise Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={Mail}
                                placeholder="name@company.com"
                                required
                            />

                            <Input
                                label="Access Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                icon={Lock}
                                placeholder="••••••••"
                                required
                            />

                            <Input
                                label="Confirm Access Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                icon={Lock}
                                placeholder="••••••••"
                                required
                            />

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-cyber-gray ml-1">
                                    Identity Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 rounded-xl bg-cyber-black border border-white/10 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyber-purple/40 transition-all cursor-pointer appearance-none"
                                >
                                    <option value="learner">Learner (Agent)</option>
                                    <option value="instructor">Instructor (Lead)</option>
                                    <option value="admin">Admin (Command Core)</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 mt-4"
                                loading={loading}
                            >
                                Initialize Node Sequence
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-cyber-gray text-xs font-medium">
                                Existing identity node?{' '}
                                <Link to="/login" className="text-cyber-purple hover:text-cyber-purple/80 font-black hover:underline underline-offset-4 transition-all">
                                    Authenticate
                                </Link>
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
