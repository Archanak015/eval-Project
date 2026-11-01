import { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';

const UniversalSearchPortal = () => {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await axiosClient.get(`/api/final/search/universal?q=${encodeURIComponent(query)}`);
            setResults(res.data.data?.results || {});
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Universal Enterprise Search' }]} />

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">🔍</span>
                        Federated Campus Search Engine
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Find students, faculty members, curriculum courses, subjects, and records across the entire university database instantly.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search USN, student name, faculty ID, course title, or subject code..."
                        className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20"
                    >
                        Search Campus
                    </button>
                </form>
            </div>

            {loading && <div className="p-12 text-center text-slate-500">Scanning indexed university entities...</div>}

            {results && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Students */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>🧑‍🎓</span> Students ({results.students?.length || 0})
                        </h2>
                        {results.students?.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {results.students.map(s => (
                                    <div key={s._id} className="py-2.5 flex justify-between items-center text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{s.name}</p>
                                            <span className="text-slate-400 font-mono">USN: {s.usn}</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">Sem {s.semester}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-xs text-slate-400">No student matches found.</p>}
                    </div>

                    {/* Faculty */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>👨‍🏫</span> Faculty Members ({results.faculty?.length || 0})
                        </h2>
                        {results.faculty?.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {results.faculty.map(f => (
                                    <div key={f._id} className="py-2.5 flex justify-between items-center text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{f.name}</p>
                                            <span className="text-slate-400">{f.designation} • {f.department}</span>
                                        </div>
                                        <span className="font-mono text-slate-500 font-bold">{f.facultyId}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-xs text-slate-400">No faculty matches found.</p>}
                    </div>

                    {/* Subjects */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>📚</span> Curriculum Subjects ({results.subjects?.length || 0})
                        </h2>
                        {results.subjects?.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {results.subjects.map(sub => (
                                    <div key={sub._id} className="py-2.5 flex justify-between items-center text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{sub.name}</p>
                                            <span className="text-slate-400">Credits: {sub.credits}</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">{sub.code}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-xs text-slate-400">No subject matches found.</p>}
                    </div>

                    {/* Courses */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>🏛️</span> Academic Programs ({results.courses?.length || 0})
                        </h2>
                        {results.courses?.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {results.courses.map(c => (
                                    <div key={c._id} className="py-2.5 flex justify-between items-center text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{c.name}</p>
                                            <span className="text-slate-400">{c.degreeType}</span>
                                        </div>
                                        <span className="font-mono text-slate-500 font-bold">{c.code}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-xs text-slate-400">No course matches found.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversalSearchPortal;
