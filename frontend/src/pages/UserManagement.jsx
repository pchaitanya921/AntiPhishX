import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Shield,
    Calendar,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Lock,
    Unlock,
    BookOpen
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/ui';
import { adminAPI } from '../services/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            console.log('Fetching users with filters:', { searchTerm, roleFilter, page: pagination.page });
            const response = await adminAPI.getUsers({
                search: searchTerm,
                role: roleFilter === 'all' ? undefined : roleFilter,
                page: pagination.page,
                limit: pagination.limit
            });
            console.log('Users fetched successfully:', response.data);
            setUsers(response.data.data || []);
            setPagination(response.data.pagination || { page: 1, limit: 50, total: 0 });
        } catch (err) {
            console.error('Failed to fetch users:', err);
            console.error('Error details:', err.response?.data || err.message);
            // Don't clear users on error, keep showing previous data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search by 300ms

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, roleFilter, pagination.page]);

    const handleLockToggle = async (userId, isLocked) => {
        if (!confirm(`Are you sure you want to ${isLocked ? 'unlock' : 'lock'} this user?`)) {
            return;
        }

        try {
            await adminAPI.updateUser(userId, { accountLocked: !isLocked });
            alert(`User ${isLocked ? 'unlocked' : 'locked'} successfully!`);
            fetchUsers(); // Refresh the list
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Failed to update user status';
            alert(`Error: ${errorMsg}`);
            console.error(err);
        }
    };

    const handleDelete = async (userId, userEmail) => {
        if (!confirm(`Are you sure you want to DELETE user "${userEmail}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await adminAPI.deleteUser(userId);
            alert('User deleted successfully!');
            fetchUsers(); // Refresh the list
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Failed to delete user';
            alert(`Error: ${errorMsg}`);
            console.error('Delete error:', err.response || err);
        }
    };

    const handleEdit = (user) => {
        // For now, just show an alert. You can implement a modal later
        alert(`Edit functionality coming soon for: ${user.firstName} ${user.lastName}`);
        // TODO: Open a modal with editable fields
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'danger';
            case 'instructor': return 'primary';
            case 'learner': return 'cyan';
            default: return 'default';
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mb-4" />
                <p className="text-cyber-gray font-black uppercase tracking-[0.3em] text-[10px]">Loading Users...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-black mb-3 tracking-tighter italic">
                        User <span className="cyber-gradient-text">Management</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        {pagination.total} Total Users
                    </p>
                </div>
            </div>

            {/* Filters - Premium Design */}
            <Card className="p-8 relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/5 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search Bar - Enhanced Design */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-purple group-hover:text-cyber-cyan transition-colors duration-300" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:border-cyber-purple focus:bg-white/[0.05] transition-all duration-300 outline-none font-medium"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    <XCircle size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Role Filters - Enhanced Design */}
                    <div className="flex gap-3">
                        {[
                            { value: 'all', label: 'All Users', icon: Users },
                            { value: 'admin', label: 'Admin', icon: Shield },
                            { value: 'instructor', label: 'Instructor', icon: BookOpen },
                            { value: 'learner', label: 'Learner', icon: Users }
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setRoleFilter(value)}
                                className={`
                                    relative px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 overflow-hidden group
                                    ${roleFilter === value
                                        ? 'bg-gradient-to-br from-cyber-purple to-cyber-cyan text-white shadow-[0_0_30px_rgba(124,58,237,0.3)]'
                                        : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.08] hover:text-white border-2 border-white/5 hover:border-white/10'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon size={14} />
                                    <span className="hidden xl:inline">{label}</span>
                                    <span className="xl:hidden">{value === 'all' ? 'All' : value}</span>
                                </div>
                                {roleFilter === value && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || roleFilter !== 'all') && (
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-widest text-white/40">Active Filters:</span>
                        {searchTerm && (
                            <div className="px-3 py-1.5 bg-cyber-purple/20 border border-cyber-purple/30 rounded-lg text-xs font-bold text-cyber-purple flex items-center gap-2">
                                Search: "{searchTerm}"
                                <button onClick={() => setSearchTerm('')} className="hover:text-white transition-colors">
                                    <XCircle size={14} />
                                </button>
                            </div>
                        )}
                        {roleFilter !== 'all' && (
                            <div className="px-3 py-1.5 bg-cyber-cyan/20 border border-cyber-cyan/30 rounded-lg text-xs font-bold text-cyber-cyan flex items-center gap-2">
                                Role: {roleFilter}
                                <button onClick={() => setRoleFilter('all')} className="hover:text-white transition-colors">
                                    <XCircle size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-white/40">User</th>
                                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-white/40">Email</th>
                                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-white/40">Role</th>
                                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-white/40">Status</th>
                                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-white/40">Joined</th>
                                <th className="text-right p-4 text-xs font-black uppercase tracking-widest text-white/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                >
                                    {/* User Info */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-cyan flex items-center justify-center font-black text-sm">
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-xs text-white/40">
                                                    ID: {user._id.slice(-6)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-white/80">
                                            <Mail size={14} className="text-white/40" />
                                            {user.email}
                                        </div>
                                    </td>

                                    {/* Role */}
                                    <td className="p-4">
                                        <Badge variant={getRoleBadgeColor(user.role)}>
                                            {user.role}
                                        </Badge>
                                    </td>

                                    {/* Status */}
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {user.isEmailVerified ? (
                                                <div className="flex items-center gap-1 text-xs text-green-400">
                                                    <CheckCircle size={14} />
                                                    Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-xs text-yellow-400">
                                                    <XCircle size={14} />
                                                    Unverified
                                                </div>
                                            )}
                                            {user.accountLocked && (
                                                <div className="flex items-center gap-1 text-xs text-red-400">
                                                    <Lock size={14} />
                                                    Locked
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Joined Date */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <Calendar size={14} className="text-white/40" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                                title="Edit user"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleLockToggle(user._id, user.accountLocked)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                                title={user.accountLocked ? 'Unlock user' : 'Lock user'}
                                            >
                                                {user.accountLocked ? <Unlock size={16} /> : <Lock size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id, user.email)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/60 hover:text-red-400"
                                                title="Delete user"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {!loading && users.length === 0 && (
                        <div className="p-12 text-center">
                            <Users size={64} className="mx-auto mb-4 text-white/20" />
                            <h3 className="text-xl font-black text-white/60 mb-2">No Users Found</h3>
                            <p className="text-sm text-white/40">
                                {searchTerm || roleFilter !== 'all'
                                    ? 'Try adjusting your filters or search term'
                                    : 'No users have been registered yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="p-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-xs text-white/40">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page === 1}
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page === pagination.pages}
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
