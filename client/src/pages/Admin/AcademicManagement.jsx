import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const AdminAcademicManagement = () => {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('assignments'); // assignments, departments, courses, subjects, students

    // Assignment form state
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [assignSemester, setAssignSemester] = useState('5');
    const [assignSection, setAssignSection] = useState('A');
    const [assignCourseCode, setAssignCourseCode] = useState('B.E');
    const [submitting, setSubmitting] = useState(false);

    // New Department form state
    const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '' });
    // New Course form state
    const [courseForm, setCourseForm] = useState({ name: '', code: '', duration: '4 Years', totalSemesters: 8 });

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/api/admin/academic/structure-overview');
            const data = res.data?.data || res.data;
            setOverview(data);
            if (data?.faculties?.length > 0 && !selectedFaculty) {
                setSelectedFaculty(data.faculties[0]._id);
            }
        } catch (error) {
            console.error('Error fetching academic master structure', error);
            toast.error('Failed to load academic master data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview();
    }, []);

    const handleAssignFaculty = async (e) => {
        e.preventDefault();
        if (!selectedFaculty || selectedSubjectIds.length === 0) {
            toast.warning('Please select a faculty member and at least one subject');
            return;
        }

        setSubmitting(true);
        try {
            await axiosClient.post('/api/admin/academic/assign-faculty', {
                facultyId: selectedFaculty,
                subjectIds: selectedSubjectIds,
                semester: Number(assignSemester),
                section: assignSection,
                courseCode: assignCourseCode
            });
            toast.success('Curriculum subjects successfully assigned to faculty!');
            setSelectedSubjectIds([]);
            fetchOverview();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error assigning faculty');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateDept = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/admin/academic/departments', deptForm);
            toast.success(`Department ${deptForm.code} created!`);
            setDeptForm({ name: '', code: '', description: '' });
            fetchOverview();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating department');
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/academic/courses', courseForm);
            toast.success(`Course ${courseForm.code} created!`);
            setCourseForm({ name: '', code: '', duration: '4 Years', totalSemesters: 8 });
            fetchOverview();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating course');
        }
    };

    const toggleSubjectSelection = (subId) => {
        setSelectedSubjectIds(prev => 
            prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
        );
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
                            <span className="text-slate-800 font-medium">Administration</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            University Academic Structure & Assignment ERP
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Administrator controls all department allocations, degree courses, faculty assignments, and subject rosters.
                        </p>
                    </div>

                    <Link
                        to="/dashboard"
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    >
                        ← Back to Hub
                    </Link>
                </div>

                {/* Navigation Pills */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
                    {[
                        { id: 'assignments', label: '👨‍🏫 Faculty Subject Assignment', count: overview?.faculties?.length },
                        { id: 'departments', label: '🏛️ Departments', count: overview?.departments?.length },
                        { id: 'courses', label: '🎓 Degree Courses', count: overview?.courses?.length },
                        { id: 'subjects', label: '📚 Curriculum Subjects', count: overview?.subjects?.length },
                        { id: 'students', label: '🧑‍🎓 Registered Students', count: overview?.students?.length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content: Faculty Subject Assignment */}
                {activeTab === 'assignments' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Assignment Action Form */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Assign Faculty to Curriculum Subject
                            </h3>
                            <form onSubmit={handleAssignFaculty} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Faculty Member</label>
                                    <select
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white"
                                        value={selectedFaculty}
                                        onChange={e => setSelectedFaculty(e.target.value)}
                                    >
                                        {overview?.faculties?.map(f => (
                                            <option key={f._id} value={f._id}>
                                                {f.user?.name} ({f.department || 'CS'} • {f.employeeId})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Code</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                                            value={assignCourseCode}
                                            onChange={e => setAssignCourseCode(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Semester</label>
                                        <select
                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                                            value={assignSemester}
                                            onChange={e => setAssignSemester(e.target.value)}
                                        >
                                            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Section</label>
                                        <select
                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                                            value={assignSection}
                                            onChange={e => setAssignSection(e.target.value)}
                                        >
                                            {['A', 'B', 'C'].map(sec => <option key={sec} value={sec}>Sec {sec}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                                        Select Subjects to Allocate ({selectedSubjectIds.length} Selected)
                                    </label>
                                    <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-200 p-2 rounded-xl">
                                        {overview?.subjects?.map(sub => (
                                            <label key={sub._id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjectIds.includes(sub._id)}
                                                    onChange={() => toggleSubjectSelection(sub._id)}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                                <span className="font-mono font-bold text-blue-600">{sub.code}</span>
                                                <span className="truncate flex-1">{sub.name} (Sem {sub.semester})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
                                >
                                    {submitting ? 'Allocating...' : 'Confirm Faculty Assignment'}
                                </button>
                            </form>
                        </div>

                        {/* Current Faculty Workload Register */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                                Institutional Faculty Assignment Register
                            </h3>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {overview?.faculties?.map(f => (
                                    <div key={f._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900">{f.user?.name}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">{f.department || 'CS'}</span>
                                                <span className="text-xs font-mono text-slate-400">ID: {f.employeeId}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">Designation: {f.designation || 'Assistant Professor'} • Semesters: {f.semesters?.join(', ') || '3, 5'} • Sections: {f.sections?.join(', ') || 'A, B'}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {f.assignedSubjects?.map(s => (
                                                    <span key={s._id} className="text-[11px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold">
                                                        {s.code}: {s.name}
                                                    </span>
                                                ))}
                                                {(!f.assignedSubjects || f.assignedSubjects.length === 0) && (
                                                    <span className="text-xs text-slate-400 italic">No subjects currently allocated</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Departments */}
                {activeTab === 'departments' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-slate-900">Add Academic Department</h3>
                            <form onSubmit={handleCreateDept} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mechanical Engineering"
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                                        value={deptForm.name}
                                        onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. MECH"
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl uppercase font-mono"
                                        value={deptForm.code}
                                        onChange={e => setDeptForm({ ...deptForm, code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
                                    <input
                                        type="text"
                                        placeholder="Department focus & labs"
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                                        value={deptForm.description}
                                        onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition"
                                >
                                    + Add Department
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4">University Departments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {overview?.departments?.map(d => (
                                    <div key={d._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-mono text-sm font-bold text-blue-600">{d.code}</span>
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{d.description || 'Undergraduate & Postgraduate Program'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Courses */}
                {activeTab === 'courses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-slate-900">Add Degree Program / Course</h3>
                            <form onSubmit={handleCreateCourse} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Master of Business Administration"
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                                        value={courseForm.name}
                                        onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Code</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. MBA"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono uppercase"
                                            value={courseForm.code}
                                            onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 2 Years"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                                            value={courseForm.duration}
                                            onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition"
                                >
                                    + Add Degree Course
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4">Accredited Degree Programs</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {overview?.courses?.map(c => (
                                    <div key={c._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-mono text-sm font-bold text-indigo-600">{c.code}</span>
                                            <span className="text-xs text-slate-500 font-medium">{c.duration || '4 Years'}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                                        <p className="text-xs text-slate-400 mt-1">Total Semesters: {c.totalSemesters || 8}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Subjects */}
                {activeTab === 'subjects' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900">Curriculum Subjects Master List</h3>
                            <Link to="/faculty/add-subject" className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl">
                                + Add New Subject
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-sm">
                                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Code</th>
                                        <th className="px-6 py-3 text-left">Subject Name</th>
                                        <th className="px-6 py-3 text-left">Course</th>
                                        <th className="px-6 py-3 text-left">Department</th>
                                        <th className="px-6 py-3 text-left">Semester</th>
                                        <th className="px-6 py-3 text-left">Credits</th>
                                        <th className="px-6 py-3 text-left">Marks (Int / Ext)</th>
                                        <th className="px-6 py-3 text-left">Assigned Faculty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {overview?.subjects?.map(s => (
                                        <tr key={s._id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 font-mono font-bold text-blue-600">{s.code}</td>
                                            <td className="px-6 py-3 font-semibold text-slate-900">{s.name}</td>
                                            <td className="px-6 py-3 text-slate-600">{s.course || 'B.E'}</td>
                                            <td className="px-6 py-3 text-slate-600">{s.department}</td>
                                            <td className="px-6 py-3 text-slate-600">Sem {s.semester}</td>
                                            <td className="px-6 py-3 text-slate-600">{s.credits} Credits</td>
                                            <td className="px-6 py-3 text-slate-600">{s.internalMarks || 40} / {s.externalMarks || 60}</td>
                                            <td className="px-6 py-3 font-medium text-slate-800">
                                                {s.faculty?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab Content: Registered Students */}
                {activeTab === 'students' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-900">Student Official Academic Registration</h3>
                            <p className="text-xs text-slate-400 mt-1">Official enrollments assigned by Administrator. Only officially registered subjects appear for faculty registers.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-sm">
                                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Student</th>
                                        <th className="px-6 py-3 text-left">Enrollment / USN</th>
                                        <th className="px-6 py-3 text-left">Department</th>
                                        <th className="px-6 py-3 text-left">Semester & Sec</th>
                                        <th className="px-6 py-3 text-left">Batch</th>
                                        <th className="px-6 py-3 text-left">Registered Subjects</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {overview?.students?.map(stu => (
                                        <tr key={stu._id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 font-semibold text-slate-900">{stu.user?.name}</td>
                                            <td className="px-6 py-3 font-mono text-slate-700">{stu.enrollmentNo}</td>
                                            <td className="px-6 py-3 text-slate-600">{stu.department}</td>
                                            <td className="px-6 py-3 text-slate-600">Sem {stu.semester} ({stu.section || 'A'})</td>
                                            <td className="px-6 py-3 text-slate-600">{stu.batch || '2024-2028'}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {stu.enrolledSubjects?.map(sub => (
                                                        <span key={sub._id} className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-mono font-semibold border border-blue-100">
                                                            {sub.code}
                                                        </span>
                                                    ))}
                                                    {(!stu.enrolledSubjects || stu.enrolledSubjects.length === 0) && (
                                                        <span className="text-xs text-slate-400 italic">None registered</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAcademicManagement;
