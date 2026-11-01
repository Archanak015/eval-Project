import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/StatCard';
import { AttendanceBadge } from '../../components/Badges';

const AIAcademicInsights = () => {
    const [riskStudents, setRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nlQuery, setNlQuery] = useState('');
    const [queryResult, setQueryResult] = useState(null);
    const [querying, setQuerying] = useState(false);

    const fetchRiskAnalysis = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/api/v2/ai/attendance-risk');
            setRiskStudents(res.data?.data || []);
        } catch (err) {
            console.error('Error fetching AI insights', err);
            toast.error('Failed to load AI risk predictions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiskAnalysis();
    }, []);

    const handleSmartQuery = async (e) => {
        e.preventDefault();
        if (!nlQuery.trim()) return;
        setQuerying(true);
        try {
            const res = await axiosClient.post('/api/v2/ai/query', { query: nlQuery });
            setQueryResult(res.data?.data);
        } catch (err) {
            toast.error('AI query processing failed');
        } finally {
            setQuerying(false);
        }
    };

    const criticalCount = riskStudents.filter(s => s.riskLevel.includes('Critical')).length;
    const moderateCount = riskStudents.filter(s => s.riskLevel.includes('Moderate')).length;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-medium">Artificial Intelligence Core</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Smart Campus AI & Academic Risk Forecasting
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Predictive attendance drop-off flags, SGPA grade projection models, and natural language dashboard queries.
                </p>
            </div>

            {/* Smart NLP Dashboard Query Bar */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                    <span>✨ AI Assistant & Natural Language Insights</span>
                </div>
                <form onSubmit={handleSmartQuery} className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Ask anything (e.g. 'Show students with low attendance' or 'Analyze faculty workload')..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={nlQuery}
                        onChange={e => setNlQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={querying}
                        className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-xs shadow-sm transition"
                    >
                        {querying ? 'Analyzing...' : 'Ask AI'}
                    </button>
                </form>

                {queryResult && (
                    <div className="p-4 bg-white/10 rounded-xl border border-white/15 text-sm space-y-2">
                        <p className="font-semibold text-blue-200">{queryResult.answer}</p>
                        {queryResult.suggestions && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {queryResult.suggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => { setNlQuery(s); }}
                                        className="text-xs px-3 py-1 bg-white/15 hover:bg-white/25 rounded-lg transition"
                                    >
                                        💡 {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Risk KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Critical Risk (<65%)" value={criticalCount} subtitle="Immediate Intervention" icon="⚠️" color="rose" />
                <StatCard title="Moderate Risk (<75%)" value={moderateCount} subtitle="Remedial Hours Required" icon="⏳" color="amber" />
                <StatCard title="Satisfactory Standing" value={riskStudents.length - criticalCount - moderateCount} subtitle="Exam Eligible" icon="✅" color="emerald" />
                <StatCard title="Average Projected SGPA" value="8.42" subtitle="Cohort Mean" icon="📈" color="blue" />
            </div>

            {/* Predictive Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Attendance Risk & Remedial Recommendations</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Students below 75% are highlighted for faculty advisor action.</p>
                    </div>
                    <button
                        onClick={fetchRiskAnalysis}
                        className="text-xs font-bold text-blue-600 hover:underline"
                    >
                        ↻ Refresh Predictions
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-3 text-left">Student</th>
                                <th className="px-6 py-3 text-left">Enrollment No</th>
                                <th className="px-6 py-3 text-left">Department</th>
                                <th className="px-6 py-3 text-left">Attendance</th>
                                <th className="px-6 py-3 text-left">AI Risk Status</th>
                                <th className="px-6 py-3 text-left">Recommended Action Plan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-xs">
                            {riskStudents.map((s, idx) => {
                                const isCritical = s.riskLevel.includes('Critical');
                                const isModerate = s.riskLevel.includes('Moderate');
                                return (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-bold text-slate-900">{s.name}</td>
                                        <td className="px-6 py-3 font-mono text-blue-600">{s.enrollmentNo}</td>
                                        <td className="px-6 py-3 text-slate-600">{s.department} (Sem {s.semester})</td>
                                        <td className="px-6 py-3">
                                            <AttendanceBadge percentage={s.attendanceRate} />
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                                                isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                isModerate ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {s.riskLevel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-600 max-w-xs">{s.recommendation}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AIAcademicInsights;
