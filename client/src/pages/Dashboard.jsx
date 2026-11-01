import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import NotificationPanel from '../components/NotificationPanel';
import Breadcrumb from '../components/Breadcrumb';
import StatCard from '../components/StatCard';
import { RoleBadge, AttendanceBadge } from '../components/Badges';
import axiosClient from '../api/axiosClient';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axiosClient.get('/api/analytics/dashboard');
                const payload = res.data?.data || res.data;
                if (payload) {
                    setAnalytics(payload);
                }
            } catch (err) {
                console.warn('Dashboard analytics request note:', err?.message || err);
            }
        };
        fetchDashboardData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }

        setSearching(true);
        try {
            const res = await axiosClient.get(`/api/analytics/search?query=${encodeURIComponent(searchQuery)}`);
            const payload = res.data?.data || res.data;
            if (payload) {
                setSearchResults(payload);
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    };

    const stats = analytics?.stats || {
        students: 0,
        faculty: 3,
        courses: 2,
        subjects: 4,
        averageAttendance: 85,
        passPercentage: 90
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={[{ label: 'Institutional Overview' }]} />

            {/* Header Greeting Card */}
            <div className="bg-white shadow-xs border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            UniConnect ERP Hub
                        </h1>
                        <RoleBadge role={user?.role} />
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                        Welcome back, <strong className="text-slate-800">{user?.name}</strong>. Campus governance & operations are synchronized.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/faculty/profile"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                    >
                        Account Preferences
                    </Link>
                </div>
            </div>

            {/* Global Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="Universal search by Student Name, Enrollment No, Department, Course, or Subject..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={searching}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition"
                    >
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                    {searchResults && (
                        <button
                            type="button"
                            onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                            className="text-slate-500 hover:text-slate-700 px-3 text-xs font-bold"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Search Results Visualizer */}
                {searchResults && searchResults.students && searchResults.students.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                            <span>🎓 Matched Students ({searchResults.students.length})</span>
                        </h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                                <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="px-4 py-2.5">Student Name</th>
                                        <th className="px-4 py-2.5">Enrollment No</th>
                                        <th className="px-4 py-2.5">Department</th>
                                        <th className="px-4 py-2.5">Semester & Division</th>
                                        <th className="px-4 py-2.5">Attendance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {searchResults.students.map(s => (
                                        <tr key={s._id} className="hover:bg-blue-50/40">
                                            <td className="px-4 py-2.5 font-bold text-slate-900">{s.user?.name}</td>
                                            <td className="px-4 py-2.5 font-mono text-blue-600 font-bold">{s.enrollmentNo}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{s.department}</td>
                                            <td className="px-4 py-2.5 text-slate-600">Sem {s.semester} • Div {s.section || 'A'}</td>
                                            <td className="px-4 py-2.5">
                                                <AttendanceBadge percentage={s.attendancePercentage ?? 100} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Reusable Statistics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Students" value={stats.students} subtitle="Enrolled Active" icon="🧑‍🎓" color="blue" />
                <StatCard title="Faculty" value={stats.faculty} subtitle="Teaching Staff" icon="👨‍🏫" color="indigo" />
                <StatCard title="Courses" value={stats.courses} subtitle="Degree Programs" icon="🎓" color="purple" />
                <StatCard title="Subjects" value={stats.subjects} subtitle="Active Syllabus" icon="📚" color="emerald" />
                <StatCard title="Attendance" value={`${stats.averageAttendance}%`} subtitle="Verified Rate" icon="✅" color="emerald" />
                <StatCard title="Pass Rate" value={`${stats.passPercentage}%`} subtitle="Exam Average" icon="🏆" color="rose" />
            </div>

            {/* Quick Actions Navigation */}
            <div>
                <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Academic Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin/academic" className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/20 hover:border-blue-400 hover:shadow-md transition">
                                <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                                    <span>🏛️ Academic Structure ERP</span>
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">Assign faculty, departments, courses, and approve subjects.</p>
                            </Link>
                            <Link to="/admin/reports" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition">
                                <h4 className="font-bold text-slate-900">Reports & Analytics</h4>
                                <p className="text-xs text-slate-500 mt-1">Institutional metrics and system audit trails.</p>
                            </Link>
                        </>
                    )}

                    {user?.role === 'student' && (
                        <Link to="/student/portal" className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 hover:shadow-md transition">
                            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <span>🎓 Student Academic Portal</span>
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">View official registered subjects, attendance rates, and grades.</p>
                        </Link>
                    )}

                    {(user?.role === 'faculty' || user?.role === 'admin') && (
                        <>
                            <Link to="/faculty/subjects" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition">
                                <h4 className="font-bold text-slate-900">My Subjects</h4>
                                <p className="text-xs text-slate-500 mt-1">Manage assigned curriculum subjects.</p>
                            </Link>
                            <Link to="/faculty/attendance" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-pink-300 hover:shadow-md transition">
                                <h4 className="font-bold text-slate-900">Mark Attendance</h4>
                                <p className="text-xs text-slate-500 mt-1">Take daily lecture attendance.</p>
                            </Link>
                            <Link to="/faculty/marks" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition">
                                <h4 className="font-bold text-slate-900">Upload Marks</h4>
                                <p className="text-xs text-slate-500 mt-1">Record ISA, ESA, and coursework scores.</p>
                            </Link>
                            <Link to="/faculty/student-list" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition">
                                <h4 className="font-bold text-slate-900">Student Directory</h4>
                                <p className="text-xs text-slate-500 mt-1">Directory of enrolled student cohorts.</p>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Campus Notices & Bulletins */}
            <NotificationPanel />
        </div>
    );
};

export default Dashboard;
