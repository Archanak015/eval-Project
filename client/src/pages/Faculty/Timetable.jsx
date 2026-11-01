import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const Timetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [workload, setWorkload] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newSlot, setNewSlot] = useState({
        subject: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Lab 101'
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ttRes, subRes] = await Promise.all([
                axiosClient.get('/api/timetable'),
                axiosClient.get('/api/academic/subjects')
            ]);

            const ttData = ttRes.data?.data || ttRes.data || {};
            setTimetable(Array.isArray(ttData.timetable) ? ttData.timetable : []);
            setWorkload(ttData.workloadHours || 0);

            const subList = Array.isArray(subRes.data?.data) ? subRes.data.data : (Array.isArray(subRes.data) ? subRes.data : []);
            setSubjects(subList);
            if (subList.length > 0 && !newSlot.subject) {
                setNewSlot(prev => ({ ...prev, subject: subList[0]._id }));
            }
        } catch (error) {
            console.error('Error fetching timetable data', error);
            toast.error('Failed to load timetable schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post('/api/timetable', newSlot);
            toast.success('Lecture slot scheduled successfully');
            setShowAdd(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error scheduling slot');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lecture slot?')) return;
        try {
            await axiosClient.delete(`/api/timetable/${id}`);
            toast.info('Lecture slot removed');
            fetchData();
        } catch (error) {
            toast.error('Error deleting lecture slot');
        }
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
                            <span className="text-slate-800 font-medium">Schedule</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Weekly Lecture Timetable
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage weekly faculty lecture workloads and room allotments.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAdd(!showAdd)}
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                        >
                            {showAdd ? 'Close Form' : '+ Add Lecture Slot'}
                        </button>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                        >
                            ← Back to Hub
                        </Link>
                    </div>
                </div>

                {/* Workload Indicator Banner */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Total Teaching Workload</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Calculated based on scheduled lecture minutes per week.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <span className="text-3xl font-extrabold text-blue-600">{workload}</span>
                            <span className="text-sm font-semibold text-slate-500 ml-1">hrs / week</span>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                            {timetable.length} Active Slots
                        </span>
                    </div>
                </div>

                {/* Add Slot Form Modal/Card */}
                {showAdd && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 mb-8">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Schedule a Lecture Slot</h3>
                        <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Subject
                                </label>
                                <select
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={newSlot.subject}
                                    onChange={e => setNewSlot({ ...newSlot, subject: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose Subject --</option>
                                    {subjects.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Day of Week
                                </label>
                                <select
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={newSlot.day}
                                    onChange={e => setNewSlot({ ...newSlot, day: e.target.value })}
                                >
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Room / Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Room 302 / CS Lab 2"
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={newSlot.room}
                                    onChange={e => setNewSlot({ ...newSlot, room: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={newSlot.startTime}
                                    onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={newSlot.endTime}
                                    onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Confirm Schedule Slot'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Day-by-Day Timetable Grid */}
                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/80">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-3 text-slate-500 text-sm">Loading weekly schedule...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {days.map(day => {
                            const daySlots = timetable.filter(slot => slot.day === day);
                            return (
                                <div key={day} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{day}</h3>
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {daySlots.length} Slots
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {daySlots.map(slot => (
                                            <div key={slot._id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 relative group">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm">
                                                            {slot.subject?.name || 'Curriculum Subject'}
                                                        </h4>
                                                        <p className="text-xs text-blue-600 font-mono font-semibold">
                                                            {slot.subject?.code}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteSlot(slot._id)}
                                                        className="text-slate-300 hover:text-rose-500 text-xs opacity-0 group-hover:opacity-100 transition"
                                                        title="Delete slot"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                                    <span className="font-semibold text-slate-700">
                                                        ⏰ {slot.startTime} - {slot.endTime}
                                                    </span>
                                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                                                        {slot.room || 'Room 101'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {daySlots.length === 0 && (
                                            <p className="text-slate-400 text-xs text-center py-6 italic">No classes scheduled</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timetable;
