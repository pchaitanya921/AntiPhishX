import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <footer className={`mt-auto border-t transition-colors duration-300 ${isDark
                ? 'bg-[#0a0a0a] border-white/5'
                : 'bg-gray-50 border-gray-200'
            }`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

                    {/* About Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="text-cyber-purple" size={20} />
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                AntiPhishX
                            </h3>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Advanced cybersecurity training platform for phishing detection and prevention
                        </p>
                    </div>

                    {/* Developer Info Section */}
                    <div>
                        <h4 className={`font-semibold mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            AntiPhishX Platform
                        </h4>
                        <div className="space-y-1.5">
                            <p className="text-cyan-500 font-medium text-xs">LAKSHMI CHAITANYA SAI</p>
                            <p className="text-green-500 font-medium text-xs">VENKATA JESHWANTH</p>
                            <p className="text-purple-500 font-medium text-xs">PAVAN KUMAR</p>
                            <div className="flex items-center gap-2 mt-2">
                                <GraduationCap className={isDark ? 'text-slate-400' : 'text-gray-400'} size={14} />
                                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                    Veltech University
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className={`font-semibold mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Quick Links
                        </h4>
                        <ul className="space-y-1.5">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/courses', label: 'Courses' },
                                { to: '/labs', label: 'Labs' },
                                { to: '/leaderboard', label: 'Leaderboard' },
                                { to: '/achievements', label: 'Achievements' },
                            ].map(({ to, label }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className={`text-xs transition-colors hover:text-cyber-purple ${isDark ? 'text-slate-400' : 'text-gray-500'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={`pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                    <div className="text-center">
                        <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            © {currentYear} AntiPhishX - Major Project
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            Veltech University | Computer Science and Engineering - Cyber Security
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
