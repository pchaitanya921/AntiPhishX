import React from 'react';
import { Mail, Star, AlertCircle, Paperclip, MoreHorizontal, Reply, Forward, Trash2, Archive, ShieldAlert, User } from 'lucide-react';

// Support both nested structure (content.email) and flat structure.
// Also handle case where email object exists but is empty (from inspect_lab output)
const EmailClient = ({ content }) => {
    const rawEmail = content?.email || content || {};

    // Construct a displayable email object with defaults if fields are missing
    const email = {
        subject: rawEmail.subject || 'Urgent: Account Verification Required',
        from: rawEmail.from || 'Security Team <security@internal-update.com>',
        to: rawEmail.to || 'employee@company.com',
        date: rawEmail.date || new Date().toLocaleString(),
        body: rawEmail.body || 'Dear Employee,\n\nWe have detected unusual activity on your account. Please verify your credentials immediately to avoid account suspension.\n\nClick here to verify: http://verification-secure-portal.com\n\nRegards,\nIT Security',
        hasAttachment: rawEmail.hasAttachment || rawEmail.attachments?.length > 0 || false,
        attachmentName: rawEmail.attachmentName || (rawEmail.attachments?.[0]?.name) || 'Security_Guidelines.pdf'
    };

    // If we have literally no content (no email, no message, no nothing), show warning.
    // But since we are providing defaults now, this usually won't trigger unless content is null.
    if (!content) return <div className="p-8 text-white/50 text-center">No lab content available.</div>;

    const getSenderInitials = (name) => {
        // Handle "Name <email>" format
        const cleanName = name.split('<')[0].trim();
        return cleanName ? cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    };

    return (
        <div className="flex flex-col h-full w-full max-w-full bg-[#f0f0f0] text-slate-800 rounded-lg overflow-hidden font-sans">
            {/* Header / Ribbon */}
            <div className="bg-[#0078d4] text-white p-2 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                        ))}
                    </div>
                    <span className="font-semibold tracking-wide">Outlook Web App</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span>security.learner@antiphishx.corp</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">SL</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#f5f5f5] border-b border-slate-300 p-2 flex items-center gap-2 text-slate-600 text-sm">
                <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                    <Reply size={16} /> Reply
                </button>
                <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                    <Reply size={16} className="scale-x-[-1]" /> Reply all
                </button>
                <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                    <Forward size={16} /> Forward
                </button>
                <div className="w-px h-4 bg-slate-300 mx-2"></div>
                <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded transition-colors text-red-600">
                    <Trash2 size={16} /> Delete
                </button>
                <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                    <Archive size={16} /> Archive
                </button>
                <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded transition-colors ml-auto">
                    <ShieldAlert size={16} /> Report Phishing
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar / Folders */}
                <div className="w-32 bg-[#f5f5f5] border-r border-slate-300 p-2 text-sm hidden md:block">
                    <div className="space-y-1">
                        <div className="px-3 py-2 bg-[#cfe4fa] text-[#0078d4] font-medium rounded flex items-center justify-between cursor-pointer">
                            <span>Inbox</span>
                            <span className="bg-[#0078d4] text-white text-xs px-1.5 rounded-full">1</span>
                        </div>
                        {['Drafts', 'Sent Items', 'Deleted Items', 'Archive', 'Junk Email'].map(folder => (
                            <div key={folder} className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded cursor-pointer">
                                {folder}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email List (Simplified to show just this current email as active) */}
                <div className="w-56 bg-white border-r border-slate-300 flex flex-col hidden lg:flex shrink-0">
                    <div className="p-2 border-b border-slate-200">
                        <input type="text" placeholder="Search" className="w-full bg-[#f5f5f5] border-none rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#0078d4]" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="bg-[#e1dfdd] border-l-4 border-[#0078d4] p-3 cursor-pointer">
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold text-slate-800 truncate pr-2">{email?.from || 'Unknown'}</span>
                                <span className="text-xs text-slate-500 whitespace-nowrap">10:42 AM</span>
                            </div>
                            <div className="text-[#0078d4] font-medium text-sm truncate mb-1">{email?.subject || 'No Subject'}</div>
                            <div className="text-slate-500 text-xs truncate">
                                {email?.body ? email.body.substring(0, 40) : 'No content'}...
                            </div>
                        </div>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="p-3 border-b border-slate-100 opacity-50">
                                <div className="w-24 h-4 bg-slate-200 rounded mb-2"></div>
                                <div className="w-full h-3 bg-slate-100 rounded mb-1"></div>
                                <div className="w-2/3 h-3 bg-slate-100 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email Reading Pan */}
                <div className="flex-1 bg-white flex flex-col p-3 overflow-y-auto pb-32">
                    {/* Email Header */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{email?.subject || 'No Subject'}</h2>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                {getSenderInitials(email?.from || 'Unknown')}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                    <span className="font-semibold text-slate-900">{email?.from || 'Unknown Sender'}</span>
                                    <span className="text-xs text-slate-500">{email?.date || 'Today'}</span>
                                </div>
                                <div className="text-sm text-slate-600">
                                    To: <span className="bg-slate-100 px-1 rounded text-slate-800">{email?.to || 'You'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Banner (Interactive? Maybe later) */}
                    <div className="bg-[#fff4ce] border border-[#f0c14b] text-[#785c00] p-3 rounded mb-6 flex items-start gap-3 text-sm">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div>
                            <span className="font-bold">Caution:</span> This email originated from outside of the organization. Do not click links or open attachments unless you recognize the sender and know the content is safe.
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                        {email?.body || 'No content'}
                    </div>

                    {/* Attachments (Mock) */}
                    {email?.hasAttachment && (
                        <div className="mt-8 pt-4 border-t border-slate-200">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Paperclip size={14} /> Attachments (1)
                            </h4>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer bg-white shadow-sm w-64">
                                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                                    <div className="overflow-hidden">
                                        <div className="text-sm font-medium text-slate-700 truncate">{email?.attachmentName || 'Attachment.pdf'}</div>
                                        <div className="text-xs text-slate-400">1.2 MB</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailClient;
