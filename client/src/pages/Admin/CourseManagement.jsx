import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '', duration: '' });
    const [newSubject, setNewSubject] = useState({ name: '', code: '', department: 'CS', credits: 3, semester: 1, course: '', faculty: '' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesRes, subjectsRes, facultyRes] = await Promise.all([
                axiosClient.get('/api/academic/courses'),
                axiosClient.get('/api/academic/subjects'),
                axiosClient.get('/api/auth/users?role=faculty')
            ]);

            setCourses(Array.isArray(coursesRes.data?.data) ? coursesRes.data.data : (Array.isArray(coursesRes.data) ? coursesRes.data : []));
            setSubjects(Array.isArray(subjectsRes.data?.data) ? subjectsRes.data.data : (Array.isArray(subjectsRes.data) ? subjectsRes.data : []));
            setFacultyList(Array.isArray(facultyRes.data?.data) ? facultyRes.data.data : (Array.isArray(facultyRes.data) ? facultyRes.data : []));
        } catch (error) {
            console.error('Error fetching academic data', error);
            toast.error('Failed to load courses and subjects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/academic/courses', newCourse);
            toast.success('Course program created successfully');
            setNewCourse({ name: '', code: '', description: '', duration: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating course');
        }
    };

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/academic/subjects', newSubject);
            toast.success('Subject registered successfully');
            setNewSubject({ name: '', code: '', department: 'CS', credits: 3, semester: 1, course: '', faculty: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating subject');
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
                            <span className="text-slate-800 font-medium">Academics</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Course & Curriculum Management
                        </h1>
                    </div>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    >
                        ← Back to Hub
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Courses Column */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Add Academic Course</h2>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">Degree</span>
                        </div>

                        <form onSubmit={handleCreateCourse} className="space-y-4 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Course Name (e.g. B.Tech Computer Science)"
                                    className="col-span-2 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newCourse.name}
                                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Course Code (e.g. BTCS)"
                                    className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newCourse.code}
                                    onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Duration (e.g. 4 Years)"
                                    className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newCourse.duration}
                                    onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Description..."
                                    className="col-span-2 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newCourse.description}
                                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                            >
                                Register Course
                            </button>
                        </form>

                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Active Courses ({courses.length})</h3>
                        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                            {courses.map(course => (
                                <div key={course._id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{course.name}</p>
                                        <p className="text-xs text-slate-500">{course.code} • {course.duration || 'Standard Duration'}</p>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                                </div>
                            ))}
                            {courses.length === 0 && !loading && (
                                <EmptyState title="No courses created" description="Get started by adding your first degree course above." />
                            )}
                        </div>
                    </div>

                    {/* Subjects Column */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Add Curriculum Subject</h2>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">Syllabus</span>
                        </div>

                        <form onSubmit={handleCreateSubject} className="space-y-4 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Subject Name (e.g. Data Structures)"
                                    className="col-span-2 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newSubject.name}
                                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Subject Code (e.g. CS201)"
                                    className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newSubject.code}
                                    onChange={e => setNewSubject({ ...newSubject, code: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Department (e.g. CS)"
                                    className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newSubject.department}
                                    onChange={e => setNewSubject({ ...newSubject, department: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    placeholder="Credits"
                                    className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newSubject.credits}
                                    onChange={e => setNewSubject({ ...newSubject, credits: Number(e.target.value) })}
                                    required
                                />
                                <input
                                    type="number"
                                    min="1"
                                    max="8"
                                    placeholder="Semester"
                                    className="px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={newSubject.semester}
                                    onChange={e => setNewSubject({ ...newSubject, semester: Number(e.target.value) })}
                                    required
                                />
                                <select
                                    className="col-span-2 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                                    value={newSubject.course}
                                    onChange={e => setNewSubject({ ...newSubject, course: e.target.value })}
                                    required
                                >
                                    <option value="">Select Associated Course</option>
                                    {courses.map(c => <option key={c._id} value={c.name}>{c.name} ({c.code})</option>)}
                                </select>
                                <select
                                    className="col-span-2 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                                    value={newSubject.faculty}
                                    onChange={e => setNewSubject({ ...newSubject, faculty: e.target.value })}
                                >
                                    <option value="">Assign Faculty In-Charge (Optional)</option>
                                    {facultyList.map(f => <option key={f._id} value={f._id}>{f.name} ({f.email})</option>)}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition"
                            >
                                Register Subject
                            </button>
                        </form>

                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Enrolled Subjects ({subjects.length})</h3>
                        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                            {subjects.map(subject => (
                                <div key={subject._id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm text-slate-800">{subject.name}</p>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">Sem {subject.semester}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 flex justify-between">
                                        <span>Code: {subject.code} • {subject.credits} Credits</span>
                                        <span>Faculty: {subject.faculty?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                            ))}
                            {subjects.length === 0 && !loading && (
                                <EmptyState title="No subjects added" description="Define your first subject above." />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseManagement;
