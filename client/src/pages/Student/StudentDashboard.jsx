import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('courses'); // courses, attendance, results, timetable

    useEffect(() => {
        const fetchStudentPortal = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get('/api/student/dashboard');
                setData(res.data?.data || res.data);
            } catch (err) {
                console.error('Error fetching student dashboard', err);
                toast.error('Unable to load student academic records');
            } finally {
                setLoading(false);
            }
        };
        fetchStudentPortal();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-slate-500 text-sm">Loading Student Academic Portal...</p>
                </div>
            </div>
        );
    }

    const student = data?.student;
    const registeredSubjects = data?.registeredSubjects || [];
    const attendanceBySubject = data?.attendanceBySubject || [];
    const results = data?.results || [];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Banner */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Student Academic Portal</h1>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                                Enrolled • {student?.status || 'Active'}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">
                            Welcome, <strong className="text-slate-800">{user?.name}</strong> (USN / Enrollment: <span className="font-mono text-blue-600">{student?.enrollmentNo}</span>)
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Department: <strong>{student?.department}</strong> • Degree Course: <strong>{student?.course?.name || student?.courseCode || 'B.E'}</strong> • Semester: <strong>{student?.semester}</strong> • Section: <strong>{student?.section || 'A'}</strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs uppercase font-bold text-slate-400">Semester Attendance</p>
                            <p className="text-2xl font-black text-blue-600">{data?.overallAttendanceRate || 95}%</p>
                        </div>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                        >
                            Hub
                        </Link>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                    {[
                        { id: 'courses', label: '📚 Registered Curriculum Subjects' },
                        { id: 'attendance', label: '📊 Attendance Record' },
                        { id: 'results', label: '🏆 Examination Grades' },
                        { id: 'timetable', label: '🗓️ Class Schedule' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab 1: Registered Subjects */}
                {activeTab === 'courses' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {registeredSubjects.map(sub => (
                            <div key={sub._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{sub.code}</span>
                                    <span className="text-xs font-bold text-slate-500">{sub.credits} Credits</span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                                <p className="text-xs text-slate-400 mt-1">Semester {sub.semester} • {sub.department}</p>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                                    <span>Max Marks: <strong>{sub.maxMarks || 100}</strong></span>
                                    <span>Internal: <strong>{sub.internalMarks || 40}</strong></span>
                                    <span>External: <strong>{sub.externalMarks || 60}</strong></span>
                                </div>
                            </div>
                        ))}
                        {registeredSubjects.length === 0 && (
                            <div className="col-span-full">
                                <EmptyState
                                    title="No registered curriculum subjects"
                                    description="Your subject registrations are assigned by the Administrator. Please contact your department coordinator."
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Attendance */}
                {activeTab === 'attendance' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Subject Attendance Breakdown</h3>
                        <div className="space-y-4">
                            {attendanceBySubject.map((att, idx) => {
                                const rate = att.total > 0 ? Math.round((att.present / att.total) * 100) : 100;
                                return (
                                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <p className="font-bold text-slate-900">{att.subjectName} <span className="font-mono text-xs text-blue-600">({att.code})</span></p>
                                            <p className="text-xs text-slate-400 mt-1">Attended {att.present} of {att.total} lecture sessions</p>
                                        </div>
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-full md:w-48 bg-slate-200 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${rate}%` }}></div>
                                            </div>
                                            <span className="font-bold text-sm text-slate-800">{rate}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {attendanceBySubject.length === 0 && (
                                <p className="text-xs text-slate-400 italic">No attendance records logged yet for this semester.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab 3: Results */}
                {activeTab === 'results' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">Official Exam Results & Grade Transcript</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-sm">
                                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Examination</th>
                                        <th className="px-6 py-3 text-left">Subject</th>
                                        <th className="px-6 py-3 text-left">Max Marks</th>
                                        <th className="px-6 py-3 text-left">Marks Obtained</th>
                                        <th className="px-6 py-3 text-left">Percentage</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {results.map(r => {
                                        const max = r.exam?.totalMarks || 100;
                                        const pct = Math.round((r.marksObtained / max) * 100);
                                        const passed = pct >= 40;
                                        return (
                                            <tr key={r._id} className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-semibold text-slate-900">{r.exam?.name || 'Assessment'}</td>
                                                <td className="px-6 py-3 text-slate-600">{r.exam?.subject?.name} ({r.exam?.subject?.code})</td>
                                                <td className="px-6 py-3 text-slate-600">{max}</td>
                                                <td className="px-6 py-3 font-bold text-blue-600">{r.marksObtained}</td>
                                                <td className="px-6 py-3 font-semibold text-slate-800">{pct}%</td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                        {passed ? 'Passed' : 'Needs Improvement'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {results.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-xs text-slate-400 italic">
                                                No examination grades published yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
