import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const ASSESSMENT_TYPES = [
    { label: 'ISA 1 (Internal Assessment 1)', value: 'ISA 1', defaultMax: 30 },
    { label: 'ISA 2 (Internal Assessment 2)', value: 'ISA 2', defaultMax: 30 },
    { label: 'ESA (End Semester Assessment)', value: 'ESA', defaultMax: 100 },
    { label: 'Summer ESA (Supplementary)', value: 'Summer ESA', defaultMax: 100 },
    { label: 'Assignment / Coursework', value: 'Assignment', defaultMax: 20 },
    { label: 'Quiz / Mid-Term Test', value: 'Quiz', defaultMax: 20 },
    { label: 'Lab Assessment & Practical', value: 'Lab Assessment', defaultMax: 50 },
];

const UploadMarks = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Quick creation state with academic assessment types
    const [showQuickExam, setShowQuickExam] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('ISA 1');
    const [quickExamData, setQuickExamData] = useState({
        name: 'Internal Assessment 1 (ISA 1)',
        examType: 'ISA 1',
        totalMarks: 30,
        date: new Date().toISOString().slice(0, 16)
    });

    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        const match = ASSESSMENT_TYPES.find(a => a.value === val);
        setQuickExamData(prev => ({
            ...prev,
            examType: val,
            name: `${val} Assessment`,
            totalMarks: match ? match.defaultMax : 50
        }));
    };

    const fetchExams = async () => {
        try {
            const res = await axiosClient.get('/api/exams/exams');
            const examList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
            setExams(examList);

            if (subjectId && examList.length > 0) {
                const match = examList.find(e => e.subject?._id === subjectId || e.subject === subjectId);
                if (match) setSelectedExam(match._id);
                else setSelectedExam(examList[0]._id);
            } else if (examList.length > 0 && !selectedExam) {
                setSelectedExam(examList[0]._id);
            }
        } catch (error) {
            console.error("Error fetching exams", error);
            toast.error('Failed to load examination list');
        }
    };

    useEffect(() => {
        fetchExams();
    }, [subjectId]);

    useEffect(() => {
        if (!selectedExam) {
            setStudents([]);
            setMarks({});
            return;
        }

        const fetchStudentsAndMarks = async () => {
            setLoading(true);
            try {
                const exam = exams.find(e => e._id === selectedExam);
                if (!exam) return;

                const subId = exam.subject?._id || exam.subject;
                const [studentsRes, resultsRes] = await Promise.all([
                    axiosClient.get(`/api/attendance/students/${subId}`),
                    axiosClient.get(`/api/exams/results/${selectedExam}`)
                ]);

                const studentList = Array.isArray(studentsRes.data?.data) ? studentsRes.data.data : (Array.isArray(studentsRes.data) ? studentsRes.data : []);
                setStudents(studentList);

                const existingResults = Array.isArray(resultsRes.data?.data) ? resultsRes.data.data : (Array.isArray(resultsRes.data) ? resultsRes.data : []);
                const existingMarks = {};
                existingResults.forEach(r => {
                    const sid = r.student?._id || r.student;
                    existingMarks[sid] = r.marksObtained;
                });
                setMarks(existingMarks);
            } catch (error) {
                console.error('Error fetching students or marks', error);
                toast.error('Failed to load student roster for this examination');
            } finally {
                setLoading(false);
            }
        };
        fetchStudentsAndMarks();
    }, [selectedExam, exams]);

    const handleQuickCreateExam = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/api/exams/exams', {
                ...quickExamData,
                subject: subjectId || (exams[0]?.subject?._id || exams[0]?.subject)
            });
            const created = res.data?.data || res.data;
            toast.success(`Created ${created.name} (${created.examType})!`);
            setExams(prev => [created, ...prev]);
            setSelectedExam(created._id);
            setShowQuickExam(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating exam assessment');
        }
    };

    const handleMarksChange = (studentId, val) => {
        setMarks(prev => ({ ...prev, [studentId]: Number(val) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (students.length === 0) {
            toast.warning('No student records to grade');
            return;
        }

        setSubmitting(true);
        try {
            const marksData = Object.keys(marks).map(sid => ({
                studentId: sid,
                marksObtained: Number(marks[sid])
            }));

            const payload = {
                examId: selectedExam,
                marks: marksData
            };

            await axiosClient.post('/api/exams/marks', payload);
            toast.success(`Successfully uploaded marks for ${marksData.length} students!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error uploading marks');
        } finally {
            setSubmitting(false);
        }
    };

    const currentExam = exams.find(e => e._id === selectedExam);
    const totalMarks = currentExam?.totalMarks || 100;
    const currentType = currentExam?.examType || 'Assessment';

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <Link to="/faculty/subjects" className="hover:text-blue-600 transition">Subjects</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Evaluation Marks</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Record & Upload Evaluation Marks
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Record assessment scores across <strong>ISA 1, ISA 2, ESA, Summer ESA, and Assignments</strong>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowQuickExam(!showQuickExam)}
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                        >
                            + New Assessment
                        </button>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                        >
                            ← Back to Hub
                        </Link>
                    </div>
                </div>

                {/* Quick Assessment Modal Form with ISA1, ISA2, ESA, Summer ESA, Assignment */}
                {showQuickExam && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Add New Evaluation Assessment</h3>
                                <p className="text-xs text-slate-500">Choose from institutional evaluation formats</p>
                            </div>
                            <button onClick={() => setShowQuickExam(false)} className="text-xs text-slate-400 hover:text-slate-600 font-semibold">✕ Close</button>
                        </div>

                        <form onSubmit={handleQuickCreateExam} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                    Assessment Type
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {ASSESSMENT_TYPES.map(type => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => handleCategoryChange(type.value)}
                                            className={`p-3 rounded-xl border text-left transition ${selectedCategory === type.value
                                                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            <p className="font-bold text-sm">{type.value}</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Max {type.defaultMax} Marks</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assessment Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                        value={quickExamData.name}
                                        onChange={e => setQuickExamData({ ...quickExamData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Maximum Marks</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="100"
                                        required
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                        value={quickExamData.totalMarks}
                                        onChange={e => setQuickExamData({ ...quickExamData, totalMarks: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition"
                                    >
                                        Schedule & Open Grading Table
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Exam Selection Dropdown */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Active Assessment to Grade ({exams.length} Available)
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-semibold text-slate-400">Supported Formats:</span>
                            {['ESA', 'ISA 1', 'ISA 2', 'Summer ESA', 'Assignment'].map(tag => (
                                <span key={tag} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <select
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={selectedExam}
                        onChange={e => setSelectedExam(e.target.value)}
                    >
                        <option value="">-- Choose Exam or Assessment --</option>
                        {exams.map(ex => (
                            <option key={ex._id} value={ex._id}>
                                [{ex.examType || 'Exam'}] {ex.name} — {ex.subject?.name || 'Subject'} ({ex.totalMarks} Max Marks)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Grading Table */}
                {!selectedExam ? (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                            📝
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Select an Assessment to Enter Grades</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Choose an exam from the dropdown above or click "+ New Assessment" to schedule ISA 1, ISA 2, ESA, Summer ESA, or Assignments.
                        </p>
                    </div>
                ) : loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-3 text-slate-500 text-xs font-medium">Loading eligible student roster...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                                        {currentType}
                                    </span>
                                    <h3 className="font-bold text-sm text-slate-900">{currentExam?.name}</h3>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{currentExam?.subject?.name} • Max Evaluation Marks: <strong>{totalMarks}</strong></p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {students.length} Enrolled Candidates
                            </span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left">Student</th>
                                            <th className="px-6 py-3.5 text-left">Enrollment No</th>
                                            <th className="px-6 py-3.5 text-left">Department</th>
                                            <th className="px-6 py-3.5 text-left">Semester</th>
                                            <th className="px-6 py-3.5 text-left w-48">Score (out of {totalMarks})</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white text-sm">
                                        {students.map(student => (
                                            <tr key={student._id} className="hover:bg-slate-50/60 transition">
                                                <td className="px-6 py-3.5">
                                                    <span className="font-semibold text-slate-900">{student.user?.name || 'Student'}</span>
                                                </td>
                                                <td className="px-6 py-3.5 font-mono text-xs font-medium text-slate-600">
                                                    {student.enrollmentNo}
                                                </td>
                                                <td className="px-6 py-3.5 text-slate-600">
                                                    {student.department || 'General'}
                                                </td>
                                                <td className="px-6 py-3.5 text-slate-600">
                                                    Sem {student.semester || 1}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={totalMarks}
                                                            className="w-28 px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                                                            value={marks[student._id] ?? ''}
                                                            onChange={e => handleMarksChange(student._id, e.target.value)}
                                                            placeholder="0"
                                                            required
                                                        />
                                                        <span className="text-xs text-slate-400 font-medium">/ {totalMarks}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {students.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-8">
                                                    <EmptyState title="No students found" description="No students found matching this subject cohort." />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-5 bg-slate-50/60 border-t border-slate-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting || students.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-sm transition disabled:opacity-50 text-sm"
                                >
                                    {submitting ? 'Saving Marks...' : 'Save & Publish Evaluation Marks'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadMarks;
