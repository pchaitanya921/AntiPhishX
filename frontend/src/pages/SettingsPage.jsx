import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';
import { Settings as SettingsIcon, Bell, Lock, Globe, Moon, Sun, Shield, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom Toggle Component
const Toggle = ({ enabled, onChange, label, description }) => {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex-1">
                <p className="text-white font-semibold">{label}</p>
                <p className="text-white/60 text-sm">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${enabled
                    ? 'bg-gradient-to-r from-cyber-purple to-purple-600 shadow-lg shadow-cyber-purple/50'
                    : 'bg-white/20'
                    }`}
            >
                <motion.div
                    animate={{ x: enabled ? 28 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-1 w-5 h-5 rounded-full shadow-lg ${enabled ? 'bg-white' : 'bg-white/80'
                        }`}
                >
                    {enabled && (
                        <Check size={12} className="text-cyber-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                </motion.div>
            </button>
        </div>
    );
};


export default function SettingsPage() {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(true); // Always dark mode

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: false,
    });

    // Modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);

    // Password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        // TODO: Implement password change API call
        alert('Password updated successfully! (Demo)');
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handle2FASetup = () => {
        // TODO: Implement 2FA setup
        alert('2FA will be enabled! (Demo)');
        setShow2FAModal(false);
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-black text-white mb-2">Settings</h1>
                    <p className="text-white/60">Manage your account preferences and security</p>
                </motion.div>

                {/* Appearance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-3xl border border-white/20"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30">
                            <Moon className="w-5 h-5 text-cyber-purple" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Appearance</h2>
                            <p className="text-white/60 text-sm">Customize your interface theme</p>
                        </div>
                    </div>

                    <Toggle
                        enabled={darkMode}
                        onChange={() => { }} // Disabled - dark mode only
                        label="Dark Mode"
                        description="Always enabled - Light mode coming in future update"
                    />
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-3xl border border-white/20"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                            <Bell className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Notifications</h2>
                            <p className="text-white/60 text-sm">Control how you receive updates</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Toggle
                            enabled={notifications.email}
                            onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                            label="Email Notifications"
                            description="Receive course updates and security alerts via email"
                        />
                        <Toggle
                            enabled={notifications.push}
                            onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
                            label="Push Notifications"
                            description="Get real-time notifications in your browser"
                        />
                        <Toggle
                            enabled={notifications.sms}
                            onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                            label="SMS Notifications"
                            description="Receive important alerts via text message"
                        />
                    </div>
                </motion.div>

                {/* Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-3xl border border-white/20"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Security</h2>
                            <p className="text-white/60 text-sm">Protect your account with advanced security</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-purple/50 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Lock size={18} className="text-cyber-purple" />
                                <div className="text-left">
                                    <p className="text-white font-semibold">Change Password</p>
                                    <p className="text-white/60 text-sm">Update your account password</p>
                                </div>
                            </div>
                            <div className="text-white/40 group-hover:text-white/80 transition-colors">→</div>
                        </button>

                        <button
                            onClick={() => setShow2FAModal(true)}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={18} className="text-cyan-400" />
                                <div className="text-left">
                                    <p className="text-white font-semibold">Two-Factor Authentication</p>
                                    <p className="text-white/60 text-sm">Add an extra layer of security</p>
                                </div>
                            </div>
                            <div className="text-white/40 group-hover:text-white/80 transition-colors">→</div>
                        </button>
                    </div>
                </motion.div>

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/20 max-w-md w-full"
                        >
                            <h3 className="text-2xl font-black text-white mb-6">Change Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="text-white/60 text-sm font-semibold mb-2 block">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyber-purple/50 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-sm font-semibold mb-2 block">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyber-purple/50 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-sm font-semibold mb-2 block">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyber-purple/50 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-cyber-purple/50 transition-all"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* 2FA Modal */}
                {show2FAModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/20 max-w-md w-full"
                        >
                            <h3 className="text-2xl font-black text-white mb-4">Two-Factor Authentication</h3>
                            <p className="text-white/60 mb-6">
                                Enable 2FA to add an extra layer of security to your account. You'll need to enter a code from your authenticator app when logging in.
                            </p>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 text-center">
                                <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                <p className="text-white/40 text-sm">2FA Setup Coming Soon</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShow2FAModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handle2FASetup}
                                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                                >
                                    Enable 2FA
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
