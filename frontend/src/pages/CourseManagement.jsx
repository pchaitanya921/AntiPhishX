import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Users,
    Clock,
    BarChart3,
    CheckCircle,
    XCircle,
    X,
    Save
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { adminAPI } from '../services/api';

export default function CourseManagement() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [publishedFilter, setPublishedFilter] = useState('all');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        published: false
    });

    useEffect(() => {
        fetchCourses();
    }, [searchTerm, publishedFilter]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllCourses({
                published: publishedFilter === 'all' ? undefined : publishedFilter === 'published',
                search: searchTerm
            });
            console.log('Courses fetched:', response.data);
            setCourses(response.data.courses || []);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await adminAPI.createCourse(formData);
            alert('Course created successfully!');
            setShowCreateModal(false);
            resetForm();
            fetchCourses();
        } catch (err) {
            alert(`Failed to create course: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleEdit = async () => {
        try {
            await adminAPI.updateCourse(selectedCourse._id, formData);
            alert('Course updated successfully!');
            setShowEditModal(false);
            resetForm();
            fetchCourses();
        } catch (err) {
            alert(`Failed to update course: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            await adminAPI.deleteCourse(selectedCourse._id);
            alert('Course deleted successfully!');
            setShowDeleteDialog(false);
            setSelectedCourse(null);
            fetchCourses();
        } catch (err) {
            alert(`Failed to delete course: ${err.response?.data?.error || err.message}`);
        }
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const openEditModal = (course) => {
        setSelectedCourse(course);
        setFormData({
            title: course.title,
            description: course.description || '',
            published: course.published || false
        });
        setShowEditModal(true);
    };

    const openDeleteDialog = (course) => {
        setSelectedCourse(course);
        setShowDeleteDialog(true);
    };

    const handleView = (course) => {
        navigate(`/admin/courses/${course._id}`);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            published: false
        });
        setSelectedCourse(null);
    };

    if (loading && courses.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Loading Courses...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        Training <span className="cyber-gradient-text">Topics</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        {courses.length} Total Topics
                    </p>
                </div>
                <Button
                    onClick={openCreateModal}
                    className="bg-gradient-to-r from-cyber-purple to-cyber-cyan hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all"
                >
                    <Plus size={18} className="mr-2" />
                    Create Topic
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/5 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search Bar */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-purple group-hover:text-cyber-cyan transition-colors duration-300" />
                            <input
                                type="text"
                                placeholder="Search topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:border-cyber-purple focus:bg-white/[0.05] transition-all duration-300 outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Status Filters */}
                    <div className="flex gap-3">
                        {[
                            { value: 'all', label: 'All' },
                            { value: 'published', label: 'Published' },
                            { value: 'draft', label: 'Draft' }
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setPublishedFilter(value)}
                                className={`
                                    px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300
                                    ${publishedFilter === value
                                        ? 'bg-gradient-to-br from-cyber-purple to-cyber-cyan text-white shadow-[0_0_30px_rgba(124,58,237,0.3)]'
                                        : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.08] hover:text-white border-2 border-white/5 hover:border-white/10'
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="p-6 hover:border-cyber-purple/30 transition-all duration-300 group relative overflow-hidden">
                            {/* Background glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 to-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-white mb-2 group-hover:text-cyber-purple transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs text-white/60 line-clamp-2">
                                            {course.description || 'No description'}
                                        </p>
                                    </div>
                                    <Badge variant={course.published ? 'success' : 'default'}>
                                        {course.published ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>

                                {/* Structure Info */}
                                <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-xs">
                                        <BookOpen size={14} className="text-cyber-cyan" />
                                        <span className="text-white/60">{course.modules?.length || 0} Levels</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <BarChart3 size={14} className="text-cyber-purple" />
                                        <span className="text-white/60">
                                            {course.modules?.reduce((acc, m) => acc + (m.videos?.length || 0), 0) || 0} Videos
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleView(course)}
                                        className="flex-1 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.08] rounded-lg transition-colors text-xs font-bold text-white/60 hover:text-white flex items-center justify-center gap-2"
                                    >
                                        <Eye size={14} />
                                        View
                                    </button>
                                    <button
                                        onClick={() => openEditModal(course)}
                                        className="flex-1 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.08] rounded-lg transition-colors text-xs font-bold text-white/60 hover:text-white flex items-center justify-center gap-2"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteDialog(course)}
                                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-xs font-bold text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {!loading && courses.length === 0 && (
                <Card className="p-12 text-center">
                    <BookOpen size={64} className="mx-auto mb-4 text-white/20" />
                    <h3 className="text-xl font-black text-white/60 mb-2">No Topics Found</h3>
                    <p className="text-sm text-white/40 mb-6">
                        {searchTerm || publishedFilter !== 'all'
                            ? 'Try adjusting your filters or search term'
                            : 'Create your first topic to get started'}
                    </p>
                    <Button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-cyber-purple to-cyber-cyan"
                    >
                        <Plus size={18} className="mr-2" />
                        Create First Topic
                    </Button>
                </Card>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(showCreateModal || showEditModal) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setShowCreateModal(false);
                            setShowEditModal(false);
                            resetForm();
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0118] border-2 border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setShowEditModal(false);
                                    resetForm();
                                }}
                                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-white/60" />
                            </button>

                            {/* Header */}
                            <h2 className="text-3xl font-black mb-6 cyber-gradient-text">
                                {showCreateModal ? 'Create New Topic' : 'Edit Topic'}
                            </h2>

                            {/* Form */}
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-2">
                                        Topic Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter topic title..."
                                        className="w-full px-4 py-3 bg-white/[0.03] border-2 border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyber-purple focus:bg-white/[0.05] transition-all outline-none"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter course description..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/[0.03] border-2 border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyber-purple focus:bg-white/[0.05] transition-all outline-none resize-none"
                                    />
                                </div>



                                {/* Published */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="w-5 h-5 rounded border-2 border-white/20 bg-white/[0.03] checked:bg-cyber-purple checked:border-cyber-purple transition-all"
                                    />
                                    <label htmlFor="published" className="text-sm font-bold text-white/80 cursor-pointer">
                                        Publish topic immediately
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-8">
                                <Button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setShowEditModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-white/5 hover:bg-white/10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={showCreateModal ? handleCreate : handleEdit}
                                    className="flex-1 bg-gradient-to-r from-cyber-purple to-cyber-cyan hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                                >
                                    <Save size={18} className="mr-2" />
                                    {showCreateModal ? 'Create Topic' : 'Save Changes'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {showDeleteDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setShowDeleteDialog(false);
                            setSelectedCourse(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0118] border-2 border-red-500/30 rounded-3xl p-8 max-w-md w-full"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={32} className="text-red-400" />
                            </div>

                            {/* Content */}
                            <h2 className="text-2xl font-black text-white text-center mb-3">
                                Delete Course?
                            </h2>
                            <p className="text-white/60 text-center mb-2">
                                Are you sure you want to delete
                            </p>
                            <p className="text-cyber-purple font-bold text-center mb-6">
                                "{selectedCourse?.title}"?
                            </p>
                            <p className="text-sm text-red-400 text-center mb-8">
                                This action cannot be undone. All topic data, courses, and enrollments will be permanently deleted.
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        setShowDeleteDialog(false);
                                        setSelectedCourse(null);
                                    }}
                                    className="flex-1 bg-white/5 hover:bg-white/10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                                >
                                    <Trash2 size={18} className="mr-2" />
                                    Delete Topic
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
