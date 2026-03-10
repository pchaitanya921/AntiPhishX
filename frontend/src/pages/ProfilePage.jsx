import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { User, Mail, Shield, Camera, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.profileImage || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;
                setProfileImage(base64Image);

                // Upload image immediately
                try {
                    const token = localStorage.getItem('accessToken');
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/image`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ profileImage: base64Image })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        updateProfile({ profileImage: data.profileImage });
                        setSuccess('Profile image updated successfully!');
                        setTimeout(() => setSuccess(''), 3000);
                    } else {
                        if (response.status === 401) {
                            setError('Session expired. Redirecting to login...');
                            setTimeout(() => navigate('/login'), 1500);
                        } else {
                            setError('Failed to upload image');
                        }
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    setError('Failed to upload image');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    profileImage: profileImage
                })
            });

            const data = await response.json();

            if (response.ok) {
                updateProfile(data.user);
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                console.error('Update failed:', data);
                if (response.status === 401) {
                    setError('Session expired. Redirecting to login...');
                    setTimeout(() => navigate('/login'), 1500);
                } else {
                    setError(`Server Error (${response.status}): ${data.message || data.error || JSON.stringify(data)}`);
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(`Network/Client Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || ''
        });
        setProfileImage(user?.profileImage || null);
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    // Generate avatar URL from UI Avatars API
    const getAvatarUrl = () => {
        if (profileImage) return profileImage;
        if (user?.profileImage) return user.profileImage;
        const name = `${formData.firstName}+${formData.lastName}`;
        return `https://ui-avatars.com/api/?name=${name}&background=7C3AED&color=fff&size=256&bold=true&font-size=0.4`;
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            {/* Background FX */}
            <div className="absolute inset-0 bg-cyber-grid opacity-10" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-purple/10 blur-[150px] rounded-full" />

            <div className="relative z-10 w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="backdrop-blur-3xl bg-gradient-to-br from-white/10 to-white/5 p-10 rounded-3xl border border-white/20 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">Profile Settings</h1>
                            <p className="text-white/60">Manage your account information</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/30 transition-all font-bold"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg shadow-cyber-purple/50 border-4 border-cyber-purple/30">
                                <img
                                    src={getAvatarUrl()}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {isEditing && (
                                <>
                                    <input
                                        type="file"
                                        id="profile-image"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="profile-image"
                                        className="absolute bottom-2 right-2 p-3 rounded-xl bg-cyber-purple/80 backdrop-blur-sm border border-cyber-purple hover:bg-cyber-purple transition-all cursor-pointer"
                                    >
                                        <Camera size={18} className="text-white" />
                                    </label>
                                </>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <h2 className="text-2xl font-black text-white">{formData.firstName} {formData.lastName}</h2>
                            <p className="text-cyber-purple font-bold uppercase text-sm tracking-wider mt-1">
                                {user?.role === 'instructor' ? 'Lead Instructor' : user?.role === 'admin' ? 'Administrator' : 'Security Learner'}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/60 text-sm font-bold mb-3 uppercase tracking-wider">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyber-purple/50 transition-all ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                            }`}
                                        placeholder="First Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/60 text-sm font-bold mb-3 uppercase tracking-wider">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyber-purple/50 transition-all ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                            }`}
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-white/60 text-sm font-bold mb-3 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyber-purple/50 transition-all ${!isEditing ? 'cursor-not-allowed opacity-60' : ''
                                        }`}
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div>
                            <label className="block text-white/60 text-sm font-bold mb-3 uppercase tracking-wider">
                                Account Role
                            </label>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                <Shield className="w-5 h-5 text-cyber-purple" />
                                <span className="text-white font-semibold capitalize">{user?.role || 'Learner'}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyber-purple to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-cyber-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={20} />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X size={20} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-white/40 uppercase tracking-wider font-bold mb-2">Member Since</p>
                                <p className="text-white font-semibold">January 2026</p>
                            </div>
                            <div>
                                <p className="text-white/40 uppercase tracking-wider font-bold mb-2">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-green-500 font-semibold">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
