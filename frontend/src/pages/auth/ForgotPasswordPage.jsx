import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState('email'); // 'email' or 'password'
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Skip email verification in dev, go straight to password reset
        setStep('password');
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                email,
                newPassword
            });

            if (response.data.success) {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
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
                        Your password has been reset. You can now login with your new password.
                    </p>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full px-6 py-4 bg-cyber-cyan text-black font-black rounded-2xl hover:bg-cyber-cyan/80 transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Login
                </Link>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    {step === 'email' ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-black text-white mb-3">
                                    Forgot Password? 🔐
                                </h1>
                                <p className="text-white/60">
                                    Enter your email address to reset your password.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <p className="text-red-500 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-3">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan/40 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-6 py-4 bg-cyber-cyan text-black font-black rounded-2xl hover:bg-cyber-cyan/80 transition-all"
                                >
                                    Continue
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-black text-white mb-3">
                                    Set New Password
                                </h1>
                                <p className="text-white/60">
                                    Enter your new password for {email}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <p className="text-red-500 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handlePasswordReset} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-3">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan/40 transition-all"
                                    />
                                    <p className="text-xs text-white/40 mt-2">Minimum 8 characters</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-4 bg-cyber-cyan text-black font-black rounded-2xl hover:bg-cyber-cyan/80 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
