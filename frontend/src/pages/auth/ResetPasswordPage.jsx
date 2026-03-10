import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const validatePassword = (pwd) => {
        const requirements = {
            length: pwd.length >= 12,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /\d/.test(pwd),
            special: /[@$!%*?&]/.test(pwd)
        };
        return requirements;
    };

    const requirements = validatePassword(password);
    const allRequirementsMet = Object.values(requirements).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!allRequirementsMet) {
            setError('Password does not meet all requirements');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/password-reset/confirm`, {
                token,
                password
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-black text-white mb-4">
                        Password Reset Successful!
                    </h1>

                    <p className="text-white/60 mb-8">
                        Your password has been reset successfully. Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-white mb-3">
                            Reset Password 🔐
                        </h1>
                        <p className="text-white/60">
                            Enter your new password below.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-3">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan/40 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-3">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan/40 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                            <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">
                                Password Requirements
                            </p>
                            <div className="space-y-2">
                                <RequirementItem met={requirements.length} text="At least 12 characters" />
                                <RequirementItem met={requirements.uppercase} text="One uppercase letter" />
                                <RequirementItem met={requirements.lowercase} text="One lowercase letter" />
                                <RequirementItem met={requirements.number} text="One number" />
                                <RequirementItem met={requirements.special} text="One special character (@$!%*?&)" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !allRequirementsMet || password !== confirmPassword}
                            className="w-full px-6 py-4 bg-cyber-cyan text-black font-black rounded-2xl hover:bg-cyber-cyan/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RequirementItem({ met, text }) {
    return (
        <div className="flex items-center gap-2">
            {met ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
                <XCircle className="w-4 h-4 text-white/20" />
            )}
            <span className={`text-sm ${met ? 'text-green-500' : 'text-white/40'}`}>
                {text}
            </span>
        </div>
    );
}
