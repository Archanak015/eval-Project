import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { exportToCsv } from '../../utils/exportToCsv';
import EmptyState from '../../components/EmptyState';

const AllStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortBy, setSortBy] = useState('-createdAt');

    // Auxiliary dropdown options
    const [courses, setCourses] = useState([]);

    const fetchStudents = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            if (filterDept) params.append('department', filterDept);
            if (filterSemester) params.append('semester', filterSemester);
            if (filterCourse) params.append('course', filterCourse);
            if (filterStatus) params.append('status', filterStatus);
            if (sortBy) params.append('sort', sortBy);
            params.append('page', page);
            params.append('limit', 15);

            const res = await axiosClient.get(`/api/faculty/students?${params.toString()}`);
            const data = Array.isArray(res.data?.data) ? res.data.data : [];
            setStudents(data);
            if (res.data?.pagination) {
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching students', error);
            toast.error('Failed to load students directory');
        } finally {
            setLoading(false);
        }
    };

    // Load available degree courses once for filter dropdown
    useEffect(() => {
        const loadCourses = async () => {
            try {
                const res = await axiosClient.get('/api/academic/courses');
                const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                setCourses(list);
            } catch (e) {
                console.warn('Courses dropdown note', e.message);
            }
        };
        loadCourses();
    }, []);

    // Debounced search trigger (350ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents(1);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchTerm, filterDept, filterSemester, filterCourse, filterStatus, sortBy]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterDept('');
        setFilterSemester('');
        setFilterCourse('');
        setFilterStatus('');
        setSortBy('-createdAt');
    };

    const handleExport = () => {
        const rows = students.map(s => ({
            Name: s.user?.name || '',
            EnrollmentNo: s.enrollmentNo || '',
            Department: s.department || '',
            Semester: s.semester || '',
            Course: s.course?.name || s.department || '',
            Section: s.section || 'A',
            AttendanceRate: `${s.attendancePercentage || 100}%`,
            Status: s.status || 'Active',
            Email: s.user?.email || ''
        }));
        exportToCsv('UniConnect_Faculty_Student_Directory', rows);
    };

    // Distinct departments extracted from current results
    const departments = useMemo(() => {
        return [...new Set(students.map(s => s.department).filter(Boolean))];
    }, [students]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Faculty Center</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Faculty Student Directory
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Search and inspect students within your authorized department cohorts and subjects.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            disabled={students.length === 0}
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50"
                        >
                            📥 Export CSV
                        </button>
                        <Link
                            to="/faculty/add-student"
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                        >
                            + Register Student
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* Filter and Search Bar Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 mb-6 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Global flexible search input */}
                        <div className="relative md:col-span-2">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder="Search by name, enrollment no (e.g. 321456), section, department..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Course Filter */}
                        <select
                            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                        >
                            <option value="">All Degree Courses</option>
                            {courses.map(c => (
                                <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                            ))}
                        </select>

                        {/* Department Filter */}
                        <select
                            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
                        {/* Semester Filter */}
                        <select
                            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                        >
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                <option key={s} value={s}>Semester {s}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">Status: All</option>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Alumni">Alumni</option>
                        </select>

                        {/* Sort Order */}
                        <select
                            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="name">Sort by Student Name</option>
                            <option value="enrollmentNo">Sort by Enrollment No</option>
                            <option value="semester">Sort by Semester</option>
                        </select>

                        {/* Clear Filters Button */}
                        <div className="col-span-2 md:col-span-2 flex justify-end items-center">
                            {(searchTerm || filterDept || filterSemester || filterCourse || filterStatus) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
                                >
                                    ✕ Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table View */}
                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-3 text-slate-500 text-sm">Searching authorized student records...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left">Student Profile</th>
                                        <th className="px-6 py-3.5 text-left">Enrollment No</th>
                                        <th className="px-6 py-3.5 text-left">Department</th>
                                        <th className="px-6 py-3.5 text-left">Semester & Division</th>
                                        <th className="px-6 py-3.5 text-left">Attendance</th>
                                        <th className="px-6 py-3.5 text-left">Status</th>
                                        <th className="px-6 py-3.5 text-right">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white text-sm">
                                    {students.map(student => {
                                        const rate = student.attendancePercentage ?? 100;
                                        return (
                                            <tr key={student._id} className="hover:bg-slate-50/60 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 text-sm">
                                                            {student.user?.name?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm">{student.user?.name || 'Student'}</p>
                                                            <p className="text-[11px] text-slate-400">{student.course?.name || student.department}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono font-medium text-blue-600 text-xs">
                                                    {student.enrollmentNo}
                                                </td>
                                                <td className="px-6 py-4 text-slate-700 text-xs font-medium">
                                                    {student.department}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                                        Semester {student.semester} • Division {student.section || 'A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        rate >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}>
                                                        {rate}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                                                        {student.status || 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-xs text-right font-mono">
                                                    {student.user?.email || 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="py-8">
                                                <EmptyState
                                                    title="No students found"
                                                    description="No students matching your access permissions and search criteria."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination footer */}
                        <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
                            <span>Showing {students.length} of {pagination.total || students.length} registered students</span>
                            {pagination.pages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={pagination.page <= 1}
                                        onClick={() => fetchStudents(pagination.page - 1)}
                                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
                                    >
                                        Previous
                                    </button>
                                    <span>Page {pagination.page} of {pagination.pages}</span>
                                    <button
                                        disabled={pagination.page >= pagination.pages}
                                        onClick={() => fetchStudents(pagination.page + 1)}
                                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllStudents;
