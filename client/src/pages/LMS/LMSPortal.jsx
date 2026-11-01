import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';

const LMSPortal = () => {
    const { user } = useAuth();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'assignments' | 'quizzes'
    const [selectedModule, setSelectedModule] = useState(null);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizScore, setQuizScore] = useState(null);

    const fetchLMS = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/api/advanced/lms/modules');
            setModules(res.data.data || []);
            if (res.data.data && res.data.data.length > 0) {
                setSelectedModule(res.data.data[0]);
            }
        } catch (err) {
            console.error('Error fetching LMS modules:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLMS();
    }, []);

    const handleAnswerSelect = (qIdx, optIdx) => {
        setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    };

    const submitQuiz = (quiz) => {
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctOptionIndex) {
                score += q.marks || 1;
            }
        });
        setQuizScore({ score, total: quiz.totalMarks || quiz.questions.length });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Learning Management System (LMS)' }]} />

            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">🎓</span>
                        Interactive LMS & Curriculum Hub
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Video lectures, digital courseware notes, automated online quizzes, and digital assignment evaluations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200">
                        Semester 5 • Computer Science
                    </span>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Active Course Modules" value={modules.length} icon="📚" color="blue" />
                <StatCard title="Recorded Lectures" value="28 Hrs" icon="📹" color="green" subtitle="HD Stream & Transcripts" />
                <StatCard title="Pending Assignments" value="1" icon="📝" color="yellow" subtitle="Due in 14 days" />
                <StatCard title="Course Completion" value="84%" icon="📊" color="purple" subtitle="On track for Finals" />
            </div>

            {/* Main LMS Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Module Selector Sidebar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                    <h2 className="text-xs uppercase font-extrabold text-slate-400 px-3 py-1">Course Curriculum</h2>
                    {modules.map((mod) => (
                        <button
                            key={mod._id}
                            onClick={() => { setSelectedModule(mod); setQuizScore(null); setQuizAnswers({}); }}
                            className={`w-full text-left p-3 rounded-xl text-sm font-semibold transition-all ${
                                selectedModule?._id === mod._id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <div className="font-bold">{mod.title}</div>
                            <div className="text-xs opacity-80 mt-1">{mod.materials?.length || 0} Assets • {mod.quizzes?.length || 0} Quizzes</div>
                        </button>
                    ))}
                </div>

                {/* Module Content Details */}
                <div className="lg:col-span-3 space-y-4">
                    {selectedModule ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedModule.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedModule.description}</p>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6">
                                <button
                                    onClick={() => setActiveTab('materials')}
                                    className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                                        activeTab === 'materials'
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    📖 Lectures & PDFs ({selectedModule.materials?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('assignments')}
                                    className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                                        activeTab === 'assignments'
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    📝 Assignments ({selectedModule.assignments?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('quizzes')}
                                    className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                                        activeTab === 'quizzes'
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    🎯 Self-Assessment Quizzes ({selectedModule.quizzes?.length || 0})
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'materials' && (
                                <div className="space-y-3">
                                    {selectedModule.materials?.map((mat, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{mat.type === 'video' ? '📹' : '📄'}</span>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{mat.title}</h3>
                                                    <span className="text-xs text-slate-400 uppercase font-semibold">{mat.type} {mat.durationMinutes ? `• ${mat.durationMinutes} mins` : ''}</span>
                                                </div>
                                            </div>
                                            <a
                                                href={mat.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                                            >
                                                Open Resource ↗
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'assignments' && (
                                <div className="space-y-3">
                                    {selectedModule.assignments?.map((asn, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{asn.title}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{asn.description}</p>
                                                </div>
                                                <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-bold text-xs">
                                                    Max: {asn.maxMarks} Marks
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                                <span>Deadline: <strong>{new Date(asn.dueDate).toLocaleDateString()}</strong></span>
                                                <button
                                                    onClick={() => alert('Online Submission Gateway: Attach ZIP / PDF archive or GitHub repository.')}
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                                                >
                                                    Submit Solution
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'quizzes' && (
                                <div className="space-y-4">
                                    {selectedModule.quizzes?.map((quiz, qzIdx) => (
                                        <div key={qzIdx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">{quiz.title}</h3>
                                                <span className="text-xs font-semibold text-slate-500">⏱️ {quiz.timeLimitMinutes} Mins • Total Marks: {quiz.totalMarks}</span>
                                            </div>

                                            {quiz.questions?.map((q, qIdx) => (
                                                <div key={qIdx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Q{qIdx + 1}. {q.questionText}</p>
                                                    <div className="space-y-2">
                                                        {q.options.map((opt, oIdx) => (
                                                            <label
                                                                key={oIdx}
                                                                className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                                                                    quizAnswers[qIdx] === oIdx
                                                                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300'
                                                                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`question_${qIdx}`}
                                                                    checked={quizAnswers[qIdx] === oIdx}
                                                                    onChange={() => handleAnswerSelect(qIdx, oIdx)}
                                                                    className="text-blue-600"
                                                                />
                                                                <span>{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex items-center justify-between pt-2">
                                                <button
                                                    onClick={() => submitQuiz(quiz)}
                                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                                                >
                                                    Validate Quiz Answers
                                                </button>
                                                {quizScore && (
                                                    <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                                                        Score: {quizScore.score} / {quizScore.total} Marks
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200">
                            Select a course module to start studying.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LMSPortal;
