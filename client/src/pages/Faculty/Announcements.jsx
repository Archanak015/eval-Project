import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const Announcements = () => {
    const [notices, setNotices] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetRole, setTargetRole] = useState('all');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/api/notifications');
            const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
            setNotices(list);
        } catch (error) {
            console.error('Error fetching notices', error);
            toast.error('Failed to load campus announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post('/api/notifications', {
                title,
                message,
                targetRole
            });
            toast.success('Announcement broadcasted successfully!');
            setTitle('');
            setMessage('');
            fetchNotices();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error posting announcement');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Communication</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Campus Announcement Center
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Broadcast official bulletins to faculty and students.</p>
                    </div>

                    <Link
                        to="/dashboard"
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    >
                        ← Back to Hub
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Posting Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 sticky top-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-slate-900">New Announcement</h2>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">Bulletin</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Notice Title
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="e.g. End-Semester Examination Schedule"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Target Audience
                                    </label>
                                    <select
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                    >
                                        <option value="all">Everyone (All Campus)</option>
                                        <option value="student">Students Only</option>
                                        <option value="faculty">Faculty Members Only</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Announcement Content
                                    </label>
                                    <textarea
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 h-32 resize-none"
                                        placeholder="Write notice details, instructions, or deadlines..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm transition disabled:opacity-50"
                                >
                                    {submitting ? 'Publishing...' : 'Broadcast Notice'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Timeline / Board History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-sm text-slate-900">Official Notice Board ({notices.length})</h3>
                                <button
                                    onClick={fetchNotices}
                                    className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                    ↻ Refresh
                                </button>
                            </div>

                            {loading ? (
                                <div className="p-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-3 text-slate-400 text-xs">Loading announcements...</p>
                                </div>
                            ) : notices.length === 0 ? (
                                <div className="p-8">
                                    <EmptyState title="No announcements yet" description="Broadcast your first notice to students or faculty from the side panel." />
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notices.map((notice) => (
                                        <div key={notice._id} className="p-6 hover:bg-slate-50/60 transition">
                                            <div className="flex justify-between items-start mb-2 gap-3">
                                                <h4 className="font-bold text-slate-900 text-base">{notice.title}</h4>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                    notice.targetRole === 'student' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    notice.targetRole === 'faculty' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                    {notice.targetRole === 'all' ? 'Everyone' : notice.targetRole}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mt-1">
                                                {notice.message}
                                            </p>
                                            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100/80">
                                                <span>Posted by: <strong className="text-slate-600">{notice.sender?.name || 'Academic Administration'}</strong></span>
                                                <span>
                                                    {notice.createdAt ? new Date(notice.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
