import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, GraduationCap, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <footer className="relative bg-[#020203] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
            
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
                    
                    {/* Brand & Mission */}
                    <div className="lg:col-span-1 space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-cyber-cyan transition-all">
                                <Shield className="w-6 h-6 text-white group-hover:text-cyber-cyan transition-colors" />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter uppercase">
                                AntiPhish<span className="text-cyber-cyan">X</span>
                            </span>
                        </Link>
                        <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
                            Architecting the future of human-risk intelligence. We empower organizations to quantify and mitigate behavioral vulnerabilities through adaptive AI.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={Twitter} />
                            <SocialLink icon={Github} />
                            <SocialLink icon={Linkedin} />
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Platform</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/features">Intelligence Engine</FooterLink>
                            <FooterLink to="/pricing">Pricing Plans</FooterLink>
                            <FooterLink to="/enterprise">Enterprise Node</FooterLink>
                            <FooterLink to="/labs">Simulations</FooterLink>
                        </ul>
                    </div>

                    {/* Resource Links */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Resources</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/docs">Documentation</FooterLink>
                            <FooterLink to="/api">API Reference</FooterLink>
                            <FooterLink to="/security">Security Portal</FooterLink>
                            <FooterLink to="/status">System Status</FooterLink>
                        </ul>
                    </div>

                    {/* Contact & Legal */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Governance</h4>
                        <div className="space-y-6">
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Compliance Engine</p>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black">SOC2</div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black">GDPR</div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black">ISO27001</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <a href="mailto:support@antiphishx.com" className="text-sm font-bold flex items-center gap-2 hover:text-cyber-cyan transition-colors">
                                    <Mail size={16} className="text-white/20" />
                                    support@antiphishx.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>© {currentYear} AntiPhishX</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>All Rights Reserved</span>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">Terms of Service</a>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">System Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

function FooterLink({ to, children }) {
    return (
        <li>
            <Link to={to} className="group flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-all">
                {children}
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
            </Link>
        </li>
    );
}

function SocialLink({ icon: Icon }) {
    return (
        <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all">
            <Icon size={18} />
        </a>
    );
}

export default Footer;

