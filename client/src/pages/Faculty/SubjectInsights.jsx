import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../api/config';

const SubjectInsights = () => {
    const { subjectId } = useParams();
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_BASE_URL}/api/academic/subjects/insights/${subjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInsights(data);
            } catch (error) {
                toast.error('Error fetching subject insights');
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [subjectId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!insights) return <div className="p-8 text-center text-red-500">Subject not found.</div>;

    const { subject, attendance, performance } = insights;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
                        <p className="text-gray-500 text-lg uppercase tracking-wider font-semibold mt-1">{subject.code} • {subject.department}</p>
                    </div>
                    <Link to="/faculty/subjects" className="text-indigo-600 font-bold hover:text-indigo-800 transition flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Subjects
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Classes</p>
                        <h3 className="text-3xl font-bold text-gray-900">{attendance.totalSessions}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Scheduled Exams</p>
                        <h3 className="text-3xl font-bold text-gray-900">{performance.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Avg Score</p>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {performance.length > 0
                                ? (performance.reduce((acc, p) => acc + parseFloat(p.avg), 0) / performance.length).toFixed(1)
                                : 'N/A'
                            }%
                        </h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Students</p>
                        <h3 className="text-3xl font-bold text-gray-900">{Object.keys(attendance.studentStats).length}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Analytics */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Exam Performance</h3>
                        </div>
                        <div className="p-6">
                            {performance.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No exam results uploaded yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {performance.map((exam, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                                            <h4 className="font-bold text-gray-900 mb-3">{exam.name}</h4>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                    <div className="text-[10px] uppercase text-gray-400 font-bold">Average</div>
                                                    <div className="text-lg font-bold text-indigo-600">{exam.avg}</div>
                                                </div>
                                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                    <div className="text-[10px] uppercase text-gray-400 font-bold">Max</div>
                                                    <div className="text-lg font-bold text-green-600">{exam.max}</div>
                                                </div>
                                                <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                    <div className="text-[10px] uppercase text-gray-400 font-bold">Min</div>
                                                    <div className="text-lg font-bold text-red-600">{exam.min}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attendance Distribution */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Attendance Distribution</h3>
                        </div>
                        <div className="p-6">
                            {Object.keys(attendance.studentStats).length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No attendance records found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(attendance.studentStats).map(([sid, stats]) => {
                                        const percentage = ((stats.present / insights.attendance.totalSessions) * 100).toFixed(0);
                                        return (
                                            <div key={sid}>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className="text-gray-500 font-mono">Roll: {stats.name}</span>
                                                    <span className={percentage < 75 ? 'text-red-500' : 'text-green-600'}>{percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${percentage < 75 ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectInsights;
