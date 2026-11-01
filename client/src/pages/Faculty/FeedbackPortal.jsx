import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const FeedbackPortal = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [replyingId, setReplyingId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [newFeedback, setNewFeedback] = useState({
        title: '',
        category: 'Faculty',
        rating: 5,
        description: '',
        isAnonymous: false
    });

    const categories = [
        'Faculty',
        'Subject',
        'Infrastructure',
        'Administration',
        'Library',
        'Hostel',
        'Placement',
        'Laboratory',
        'General Suggestion'
    ];

    const fetchFeedbackData = async () => {
        try {
            setLoading(true);
            const [feedRes, anaRes] = await Promise.all([
                axiosClient.get('/api/feedback'),
                axiosClient.get('/api/feedback/analytics')
            ]);

            setFeedbacks(Array.isArray(feedRes.data?.data) ? feedRes.data.data : (Array.isArray(feedRes.data) ? feedRes.data : []));
            setAnalytics(anaRes.data?.data || null);
        } catch (error) {
            console.error('Error fetching feedback', error);
            toast.error('Failed to load feedback records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbackData();
    }, []);

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post('/api/feedback', newFeedback);
            toast.success('Your feedback has been submitted successfully!');
            setShowSubmitModal(false);
            setNewFeedback({
                title: '',
                category: 'Faculty',
                rating: 5,
                description: '',
                isAnonymous: false
            });
            fetchFeedbackData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendResponse = async (id) => {
        if (!replyText.trim()) return;
        try {
            await axiosClient.patch(`/api/feedback/${id}/response`, {
                response: replyText,
                status: 'Resolved'
            });
            toast.success('Response submitted and marked Resolved');
            setReplyingId(null);
            setReplyText('');
            fetchFeedbackData();
        } catch (error) {
            toast.error('Failed to submit response');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Feedback</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Campus Feedback & Quality Forum
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Submit institutional suggestions, academic evaluations, and resolve student inquiries.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSubmitModal(!showSubmitModal)}
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                        >
                            + Submit Feedback
                        </button>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                        >
                            ← Back to Hub
                        </Link>
                    </div>
                </div>

                {/* Metrics Banner */}
                {analytics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Feedback</p>
                            <h2 className="text-2xl font-bold text-slate-900 mt-1">{analytics.total || 0}</h2>
                            <span className="text-slate-500 text-xs">Campus submissions</span>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Under Review</p>
                            <h2 className="text-2xl font-bold text-amber-600 mt-1">{analytics.pending || 0}</h2>
                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-semibold">Active Inquiries</span>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Resolved</p>
                            <h2 className="text-2xl font-bold text-emerald-600 mt-1">{analytics.resolved || 0}</h2>
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs font-semibold">Closed</span>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Rating</p>
                            <h2 className="text-2xl font-bold text-blue-600 mt-1">{analytics.averageRating} ★</h2>
                            <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-semibold">Satisfaction</span>
                        </div>
                    </div>
                )}

                {/* Submit Feedback Modal Form */}
                {showSubmitModal && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-bold text-slate-900">Submit Campus Feedback</h3>
                            <button onClick={() => setShowSubmitModal(false)} className="text-xs text-slate-400 hover:text-slate-600 font-semibold">✕ Close</button>
                        </div>
                        <form onSubmit={handleSubmitFeedback} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Feedback Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Lab equipment upgrade suggestion"
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newFeedback.title}
                                    onChange={e => setNewFeedback({ ...newFeedback, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                                <select
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newFeedback.category}
                                    onChange={e => setNewFeedback({ ...newFeedback, category: e.target.value })}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Rating (1 to 5 Stars)</label>
                                <select
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newFeedback.rating}
                                    onChange={e => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                                    <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                                    <option value={2}>⭐⭐ (2 - Needs Improvement)</option>
                                    <option value={1}>⭐ (1 - Unsatisfactory)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-5">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={newFeedback.isAnonymous}
                                        onChange={e => setNewFeedback({ ...newFeedback, isAnonymous: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span>Submit Anonymously (Hide Identity)</span>
                                </label>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Details & Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Explain your constructive feedback or observation in detail..."
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newFeedback.description}
                                    onChange={e => setNewFeedback({ ...newFeedback, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Post Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Feedback Stream */}
                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-3 text-slate-500 text-sm">Loading feedback items...</p>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80">
                        <EmptyState title="No feedback logged yet" description="Be the first to submit feedback or course evaluations." />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feedbacks.map(f => (
                            <div key={f._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                            {f.category}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            f.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                            {f.status}
                                        </span>
                                    </div>
                                    <span className="text-amber-500 font-bold text-sm">
                                        {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                                    </span>
                                </div>

                                <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
                                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{f.description}</p>

                                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                                    <span>From: <strong className="text-slate-600">{f.isAnonymous ? 'Anonymous Student' : (f.student?.name || 'Student')}</strong></span>
                                    <span>{new Date(f.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                {/* Response block if resolved or replying */}
                                {f.response && (
                                    <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                                        <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                            <span>💬 Official Faculty / Admin Response:</span>
                                        </div>
                                        <p className="text-slate-600">{f.response}</p>
                                    </div>
                                )}

                                {/* Faculty / Admin reply action */}
                                {(user?.role === 'faculty' || user?.role === 'admin') && !f.response && (
                                    <div className="mt-3 pt-2">
                                        {replyingId === f._id ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Type official response..."
                                                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleSendResponse(f._id)}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg"
                                                >
                                                    Send
                                                </button>
                                                <button
                                                    onClick={() => setReplyingId(null)}
                                                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setReplyingId(f._id); setReplyText(''); }}
                                                className="text-xs text-blue-600 hover:underline font-semibold"
                                            >
                                                + Reply to this Feedback
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackPortal;
