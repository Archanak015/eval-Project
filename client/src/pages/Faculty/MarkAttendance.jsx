import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const MarkAttendance = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [manualEnrollment, setManualEnrollment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axiosClient.get('/api/academic/subjects');
                const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                // If admin, show all; if faculty, show their assigned subjects or all if none assigned
                const filtered = user?.role === 'admin' 
                    ? list 
                    : list.filter(sub => sub.faculty?._id === user?._id || sub.faculty === user?._id || !sub.faculty);
                setSubjects(filtered.length > 0 ? filtered : list);
            } catch (error) {
                console.error("Error fetching subjects", error);
                toast.error('Failed to load academic subjects');
            }
        };
        fetchSubjects();
    }, [user?._id, user?.role]);

    useEffect(() => {
        if (!selectedSubject) {
            setStudents([]);
            setAttendance({});
            return;
        }

        const fetchStudents = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get(`/api/attendance/students/${selectedSubject}`);
                const studentList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                setStudents(studentList);

                const initialAttendance = {};
                studentList.forEach(student => {
                    initialAttendance[student._id] = 'Present';
                });
                setAttendance(initialAttendance);
            } catch (error) {
                toast.error('Error fetching students for this subject');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [selectedSubject]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleMarkAll = (status) => {
        const updated = {};
        students.forEach(s => {
            updated[s._id] = status;
        });
        setAttendance(updated);
    };

    const handleAddManualStudent = async () => {
        if (!manualEnrollment.trim()) return;

        try {
            const res = await axiosClient.get(`/api/attendance/student/${manualEnrollment.trim()}`);
            const data = res.data?.data || res.data;

            if (students.find(s => s._id === data._id)) {
                toast.info('Student already in the session roster');
                return;
            }

            setStudents(prev => [...prev, data]);
            setAttendance(prev => ({ ...prev, [data._id]: 'Present' }));
            setManualEnrollment('');
            toast.success(`Enrolled ${data.user?.name || data.enrollmentNo}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Student enrollment number not found');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (students.length === 0) {
            toast.warning('No student records to submit');
            return;
        }

        setSubmitting(true);
        try {
            const records = Object.keys(attendance).map(studentId => ({
                student: studentId,
                status: attendance[studentId] || 'Present'
            }));

            const payload = {
                subjectId: selectedSubject,
                date,
                records
            };

            await axiosClient.post('/api/attendance/mark', payload);
            toast.success('Attendance recorded successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error recording attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const presentCount = Object.values(attendance).filter(v => v === 'Present').length;
    const absentCount = Object.values(attendance).filter(v => v === 'Absent').length;
    const lateCount = Object.values(attendance).filter(v => v === 'Late').length;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Attendance</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Lecture Attendance Register
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Record and verify daily lecture presence.</p>
                    </div>

                    <Link
                        to="/dashboard"
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    >
                        ← Back to Hub
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Lecture Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Select Subject
                                    </label>
                                    <select
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        value={selectedSubject}
                                        onChange={e => setSelectedSubject(e.target.value)}
                                    >
                                        <option value="">-- Choose Subject --</option>
                                        {subjects.map(sub => (
                                            <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Lecture Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {selectedSubject && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h3>
                                <p className="text-xs text-slate-500 mb-3">Bulk status updates for enrolled students:</p>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => handleMarkAll('Present')}
                                        className="py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                                    >
                                        Mark All Present
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMarkAll('Absent')}
                                        className="py-2 px-3 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                                    >
                                        Mark All Absent
                                    </button>
                                </div>

                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pt-2 border-t border-slate-100">Add Walk-In Student</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enrollment No"
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        value={manualEnrollment}
                                        onChange={(e) => setManualEnrollment(e.target.value)}
                                    />
                                    <button
                                        onClick={handleAddManualStudent}
                                        className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Student Register Table */}
                    <div className="lg:col-span-2">
                        {!selectedSubject ? (
                            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                                    📋
                                </div>
                                <h3 className="text-base font-bold text-slate-800">Select a Subject to Begin</h3>
                                <p className="text-xs text-slate-500 mt-1">Choose a subject from the side configuration panel to load the registered students.</p>
                            </div>
                        ) : loading ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-3 text-slate-500 text-xs font-medium">Loading student roster...</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">Enrolled Students ({students.length})</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                            Present: {presentCount}
                                        </span>
                                        <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                                            Absent: {absentCount}
                                        </span>
                                        {lateCount > 0 && (
                                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                                Late: {lateCount}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-100">
                                            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">Student</th>
                                                    <th className="px-6 py-3 text-left">Enrollment</th>
                                                    <th className="px-6 py-3 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white text-sm">
                                                {students.map(student => (
                                                    <tr key={student._id} className="hover:bg-slate-50/60 transition">
                                                        <td className="px-6 py-3.5">
                                                            <div className="font-semibold text-slate-900 text-sm">{student.user?.name || 'Student'}</div>
                                                            <div className="text-xs text-slate-400">{student.department} • Sem {student.semester}</div>
                                                        </td>
                                                        <td className="px-6 py-3.5 font-mono text-xs font-medium text-slate-600">
                                                            {student.enrollmentNo}
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <div className="flex justify-center gap-1.5">
                                                                {['Present', 'Absent', 'Late'].map(status => (
                                                                    <button
                                                                        key={status}
                                                                        type="button"
                                                                        onClick={() => handleStatusChange(student._id, status)}
                                                                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${attendance[student._id] === status
                                                                            ? status === 'Present' ? 'bg-emerald-600 text-white shadow-sm' :
                                                                                status === 'Absent' ? 'bg-rose-600 text-white shadow-sm' :
                                                                                    'bg-amber-500 text-white shadow-sm'
                                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                        }`}
                                                                    >
                                                                        {status}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {students.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="py-8">
                                                            <EmptyState title="No students found" description="No students found matching this subject's department & semester." />
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-5 bg-slate-50/60 border-t border-slate-100">
                                        <button
                                            type="submit"
                                            disabled={submitting || students.length === 0}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-sm transition disabled:opacity-50"
                                        >
                                            {submitting ? 'Recording Session...' : 'Submit Lecture Attendance'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;
