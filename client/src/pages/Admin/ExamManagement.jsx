import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const ExamManagement = () => {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newExam, setNewExam] = useState({ name: '', subject: '', date: '', totalMarks: 100, description: '' });

    const fetchExams = async () => {
        try {
            setLoading(true);
            const [examRes, subjectRes] = await Promise.all([
                axiosClient.get('/api/exams/exams'),
                axiosClient.get('/api/academic/subjects')
            ]);

            setExams(Array.isArray(examRes.data?.data) ? examRes.data.data : (Array.isArray(examRes.data) ? examRes.data : []));
            setSubjects(Array.isArray(subjectRes.data?.data) ? subjectRes.data.data : (Array.isArray(subjectRes.data) ? subjectRes.data : []));
        } catch (error) {
            console.error("Error fetching exams", error);
            toast.error('Failed to load exam data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/exams/exams', newExam);
            toast.success('Exam scheduled successfully');
            setNewExam({ name: '', subject: '', date: '', totalMarks: 100, description: '' });
            fetchExams();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error scheduling exam');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Examinations</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Examination Schedules & Planning
                        </h1>
                    </div>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    >
                        ← Back to Hub
                    </Link>
                </div>

                {user?.role === 'admin' && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Schedule New Examination</h2>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">Admin Control</span>
                        </div>
                        <form onSubmit={handleCreateExam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Exam Title (e.g. Mid-Term Examination 2026)"
                                className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                value={newExam.name}
                                onChange={e => setNewExam({ ...newExam, name: e.target.value })}
                                required
                            />
                            <select
                                className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                                value={newExam.subject}
                                onChange={e => setNewExam({ ...newExam, subject: e.target.value })}
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code}) - Sem {s.semester}</option>)}
                            </select>
                            <input
                                type="datetime-local"
                                className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                value={newExam.date}
                                onChange={e => setNewExam({ ...newExam, date: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                min="1"
                                placeholder="Total Marks"
                                className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                value={newExam.totalMarks}
                                onChange={e => setNewExam({ ...newExam, totalMarks: Number(e.target.value) })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Instructions / Room details (Optional)"
                                className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none md:col-span-2"
                                value={newExam.description}
                                onChange={e => setNewExam({ ...newExam, description: e.target.value })}
                            />
                            <button
                                type="submit"
                                className="md:col-span-2 py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                            >
                                Publish Examination Schedule
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Scheduled Exams ({exams.length})</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {exams.map(exam => (
                        <div key={exam._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                    {exam.subject?.code || 'General'}
                                </span>
                                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                    {exam.totalMarks} Marks
                                </span>
                            </div>
                            <h4 className="text-base font-bold text-slate-900">{exam.name}</h4>
                            <p className="text-sm font-medium text-slate-600 mt-1">{exam.subject?.name || 'Academic Subject'}</p>
                            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                                <p className="flex items-center gap-1.5">
                                    <span>📅</span>
                                    <span>{new Date(exam.date).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                    <span>⏰</span>
                                    <span>{new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </p>
                                {exam.description && <p className="text-slate-400 italic pt-1">{exam.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                {exams.length === 0 && !loading && (
                    <EmptyState
                        title="No scheduled exams"
                        description="There are currently no exams scheduled for this term."
                    />
                )}
            </div>
        </div>
    );
};

export default ExamManagement;
