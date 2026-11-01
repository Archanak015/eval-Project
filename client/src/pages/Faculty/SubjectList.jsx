import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const SubjectList = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get('/api/academic/subjects');
                const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                // If admin, show all subjects; if faculty, show their assigned ones, or fallback to all if none
                const mySubjects = user?.role === 'admin'
                    ? list
                    : list.filter(sub => sub.faculty?._id === user?._id || sub.faculty === user?._id || !sub.faculty);
                setSubjects(mySubjects.length > 0 ? mySubjects : list);
            } catch (error) {
                console.error("Error fetching subjects", error);
                toast.error('Failed to load subjects list');
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [user?._id, user?.role]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Dashboard Back Link */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Academics</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Assigned Curriculum Subjects
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage subjects, syllabus records, and class registers.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/faculty/add-subject"
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                        >
                            + Add New Subject
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                        >
                            ← Back to Hub
                        </Link>
                    </div>
                </div>

                {/* Subjects Table */}
                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-3 text-slate-500 text-sm">Loading curriculum subjects...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left">Code</th>
                                        <th className="px-6 py-3.5 text-left">Subject Name</th>
                                        <th className="px-6 py-3.5 text-left">Department</th>
                                        <th className="px-6 py-3.5 text-left">Course</th>
                                        <th className="px-6 py-3.5 text-left">Semester</th>
                                        <th className="px-6 py-3.5 text-left">Credits</th>
                                        <th className="px-6 py-3.5 text-right">Quick Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white text-sm">
                                    {subjects.map((sub) => (
                                        <tr key={sub._id} className="hover:bg-slate-50/60 transition">
                                            <td className="px-6 py-4 font-mono font-bold text-blue-600">
                                                {sub.code}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {sub.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {sub.department || 'CS'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {sub.course || 'B.Tech'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                Sem {sub.semester}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-700">
                                                    {sub.credits} Credits
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Link
                                                        to={`/faculty/attendance`}
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                                                    >
                                                        Attendance
                                                    </Link>
                                                    <Link
                                                        to={`/faculty/marks/${sub._id}`}
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                                                    >
                                                        Marks
                                                    </Link>
                                                    <Link
                                                        to={`/faculty/attendance-history/${sub._id}`}
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                                    >
                                                        History
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {subjects.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="py-8">
                                                <EmptyState
                                                    title="No curriculum subjects found"
                                                    description="Get started by clicking + Add New Subject."
                                                />
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

export default SubjectList;
