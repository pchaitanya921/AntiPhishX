import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Award, CheckCircle2, ArrowRight, CreditCard, Sparkles, Globe, Target } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../config/plans';
import { paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function PricingPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly');

    const handleSubscribe = async (planId, planName, cycle = 'monthly') => {
        if (!isAuthenticated) {
            toast.error('Authentication Required');
            navigate('/login', { state: { from: '/pricing' } });
            return;
        }

        const isInternalRole = ['admin', 'superAdmin', 'enterpriseAdmin', 'internalTester'].includes(user?.role);
        if (isInternalRole) {
            toast.success('Internal Access Granted');
            navigate('/dashboard');
            return;
        }

        if (typeof window.Razorpay === 'undefined') {
            toast.error('Payment SDK failed to load. Please check your connection.');
            return;
        }

        try {
            setLoading(true);
            const { data: orderRes } = await paymentAPI.createOrder(planId, cycle);

            if (!orderRes.success) {
                throw new Error(orderRes.message || 'Order creation failed');
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderRes.order.amount,
                currency: orderRes.order.currency,
                name: "AntiPhishX",
                description: `${planName} (${cycle.toUpperCase()}) Subscription`,
                order_id: orderRes.order.id,
                handler: async (response) => {
                    try {
                        const { data: verifyRes } = await paymentAPI.verifyPayment({
                            ...response,
                            planId,
                            billingCycle: cycle
                        });

                        if (verifyRes.success) {
                            toast.success(`${planName} Node Activated`);
                            navigate('/payment-success', { state: { invoiceNumber: verifyRes.data.invoiceNumber } });
                        }
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email
                },
                theme: { color: "#10b981" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Checkout Initialization Error:', err);
            const errorMsg = err.response?.data?.message || 'Checkout failed to initialize';
            const errorDetail = err.response?.data?.details ? ` (${err.response.data.details})` : '';
            toast.error(`${errorMsg}${errorDetail}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-24 py-12">
            {/* Cinematic Header */}
            <div className="relative text-center space-y-8 max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md mb-4"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">Enterprise Subscription Governance</span>
                </motion.div>
                
                <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-none text-white uppercase">
                    Fortify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-500">Neural Defense</span>
                </h1>
                
                <p className="text-white/40 text-lg font-medium italic max-w-2xl mx-auto leading-relaxed">
                    Deploy AntiPhishX at scale. Select an operational tier to unlock advanced phishing simulations, 
                    executive-level intelligence, and automated threat response.
                </p>

                {/* Billing Toggle */}
                <div className="flex flex-col items-center gap-6 pt-8">
                    <div className="relative p-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-10 ${billingCycle === 'monthly' ? 'text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('annual')}
                            className={`relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-10 ${billingCycle === 'annual' ? 'text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            Annual
                            <span className="absolute -top-3 -right-3 px-2 py-0.5 rounded-md bg-emerald-500 text-[8px] font-black text-black">BEST VALUE</span>
                        </button>
                        
                        <motion.div 
                            className="absolute bg-emerald-500 rounded-xl"
                            initial={false}
                            animate={{ 
                                left: billingCycle === 'monthly' ? '6px' : 'calc(50% + 2px)',
                                width: billingCycle === 'monthly' ? 'calc(50% - 8px)' : 'calc(50% - 8px)',
                                height: 'calc(100% - 12px)'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
                <PricingCard 
                    tier="Core Node"
                    price={billingCycle === 'monthly' ? '399' : '3999'}
                    label={billingCycle === 'monthly' ? '/ USER / MONTH' : '/ USER / YEAR'}
                    savings={billingCycle === 'annual' ? 'Save ₹789 yearly' : null}
                    description="Essential cyber resilience for individual learners and small teams."
                    icon={Shield}
                    color="emerald"
                    features={[
                        "Beginner Training Modules",
                        "Basic Phishing Simulations",
                        "Standard HRI Scorecard",
                        "Email Support",
                        "Maximum 2 Devices"
                    ]}
                    onAction={() => handleSubscribe(PLANS.CORE, 'CORE NODE', billingCycle)}
                    loading={loading}
                />
                
                <PricingCard 
                    tier="Neural Advanced"
                    price={billingCycle === 'monthly' ? '999' : '9999'}
                    label={billingCycle === 'monthly' ? '/ USER / MONTH' : '/ USER / YEAR'}
                    savings={billingCycle === 'annual' ? 'Save ₹1,989 yearly' : null}
                    description="AI-adaptive defense for growing enterprises needing deep intelligence."
                    icon={Zap}
                    color="purple"
                    features={[
                        "All Core Features",
                        "AI-Adaptive Simulations",
                        "Advanced Risk Modeling",
                        "Custom Lab Environments",
                        "Maximum 5 Devices"
                    ]}
                    isPopular={true}
                    onAction={() => handleSubscribe(PLANS.NEURAL, 'NEURAL ADVANCED', billingCycle)}
                    loading={loading}
                />
                
                <PricingCard 
                    tier="Enterprise Lattice"
                    price={billingCycle === 'monthly' ? '5999' : '59999'}
                    label={billingCycle === 'monthly' ? '/ USER / MONTH' : '/ USER / YEAR'}
                    savings={billingCycle === 'annual' ? 'Save ₹11,989 yearly' : null}
                    description="Hardened infrastructure with dedicated orchestration and SSO."
                    icon={Award}
                    color="cyan"
                    features={[
                        "Unlimited Node Deployments",
                        "Dedicated Success Architect",
                        "Full API Orchestration",
                        "SSO & SCIM Integration",
                        "Infinite Device Matrix"
                    ]}
                    onAction={() => handleSubscribe(PLANS.LATTICE, 'ENTERPRISE LATTICE', billingCycle)}
                    loading={loading}
                />
            </div>

            {/* Trust Badges */}
            <div className="pt-12 border-t border-white/5 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                <TrustItem icon={Globe} label="Global Deployment" />
                <TrustItem icon={Target} label="Precision Analytics" />
                <TrustItem icon={CreditCard} label="Secure Razorpay Link" />
                <TrustItem icon={Sparkles} label="Premium Support" />
            </div>
        </div>
    );
}

function PricingCard({ tier, price, label, savings, description, icon: Icon, color, features, onAction, isPopular, loading }) {
    const variants = {
        emerald: 'text-emerald-400 bg-emerald-400/5 border-emerald-500/20',
        purple: 'text-cyber-purple bg-cyber-purple/5 border-cyber-purple/20',
        cyan: 'text-cyber-cyan bg-cyber-cyan/5 border-cyber-cyan/20'
    };

    const buttonVariants = {
        emerald: 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
        purple: 'bg-cyber-purple hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
        cyan: 'bg-cyber-cyan hover:bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
    };

    return (
        <Card className={`relative p-12 bg-[#0A0A0B]/60 backdrop-blur-3xl border-white/5 rounded-[3.5rem] flex flex-col h-full group hover:border-white/10 transition-all duration-700 overflow-hidden ${isPopular ? 'border-emerald-500/20 ring-1 ring-emerald-500/20' : ''}`}>
            {isPopular && (
                <div className="absolute top-8 right-8">
                    <Badge className="bg-emerald-500 text-black font-black uppercase text-[8px] tracking-widest px-4 py-1.5 border-none shadow-lg">Most Deployed</Badge>
                </div>
            )}
            
            <div className="mb-12">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-500 ${variants[color]}`}>
                    <Icon size={24} />
                </div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">{tier}</h3>
                    {savings && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest animate-pulse">
                            {savings}
                        </span>
                    )}
                </div>
                <p className="text-sm font-medium text-white/30 leading-relaxed">{description}</p>
                {(import.meta.env.VITE_RAZORPAY_KEY_ID?.startsWith('rzp_test')) && (
                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">Sandbox Mode Active</span>
                    </div>
                )}
            </div>

            <div className="mb-12">
                <div className="flex items-baseline gap-1">
                    <motion.span 
                        key={price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-black italic tracking-tighter leading-none"
                    >
                        ₹{price}
                    </motion.span>
                    <span className="text-white/20 text-xs font-black uppercase tracking-widest">{label}</span>
                </div>
            </div>

            <div className="flex-1 space-y-4 mb-16">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group/item">
                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${color === 'purple' ? 'bg-cyber-purple' : color === 'cyan' ? 'bg-cyber-cyan' : 'bg-emerald-500'} opacity-40 group-hover/item:opacity-100 transition-opacity`} />
                        <span className="text-xs font-medium text-white/50 group-hover/item:text-white transition-colors leading-tight">{feature}</span>
                    </div>
                ))}
            </div>

            <Button
                onClick={onAction}
                disabled={loading}
                className={`w-full h-16 rounded-2xl text-black font-black uppercase tracking-widest text-[10px] gap-3 transition-all duration-500 group/btn ${buttonVariants[color]}`}
            >
                {price === 'Custom' ? 'Request Orchestration' : 'Activate Access'}
                <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
            </Button>
        </Card>
    );
}

function TrustItem({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-3 text-white/20 group hover:text-white/40 transition-colors">
            <Icon size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
        </div>
    );
}
