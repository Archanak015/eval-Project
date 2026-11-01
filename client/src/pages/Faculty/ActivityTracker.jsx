import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../api/config';

const ActivityTracker = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newActivity, setNewActivity] = useState({
        title: '',
        description: '',
        progress: 0
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/academic/subjects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(data);
        } catch (error) {
            toast.error('Error fetching subjects');
        }
    };

    const fetchActivities = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/tracker/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(data);
            if (data.length > 0) setNewActivity(prev => ({ ...prev, progress: data[0].progress }));
            else setNewActivity(prev => ({ ...prev, progress: 0 }));
        } catch (error) {
            toast.error('Error fetching activities');
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectChange = (e) => {
        const id = e.target.value;
        setSelectedSubject(id);
        if (id) fetchActivities(id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...newActivity, subject: selectedSubject };
        console.log('Logging Activity:', payload);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/tracker`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Activity logged');
            setNewActivity({ ...newActivity, title: '', description: '' });
            fetchActivities(selectedSubject);
        } catch (error) {
            console.error('Tracker Submit Error:', error);
            toast.error('Error logging activity');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Academic Activity Tracker</h1>
                    <p className="text-gray-500 mt-2">Track syllabus progress and log subject milestones.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Subject</label>
                    <select
                        className="w-full md:w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Choose a subject...</option>
                        {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>)}
                    </select>
                </div>

                {selectedSubject && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        {/* Status Update */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                                <h3 className="font-bold text-gray-800 mb-4">Log Update</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Activity/Milestone</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                            placeholder="e.g. Unit 2 Completed"
                                            required
                                            value={newActivity.title}
                                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Details (Optional)</label>
                                        <textarea
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none h-24"
                                            placeholder="Notes about the activity..."
                                            value={newActivity.description}
                                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                            <label className="text-gray-400">Overall Progress</label>
                                            <span className="text-indigo-600">{newActivity.progress}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            min="0"
                                            max="100"
                                            value={newActivity.progress}
                                            onChange={(e) => setNewActivity({ ...newActivity, progress: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
                                    >
                                        Update Log
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-bold text-gray-800">History</h3>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                                    No activities logged yet.
                                </div>
                            ) : (
                                activities.map((act) => (
                                    <div key={act._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
                                        <div className="mt-1">
                                            <div className={`w-3 h-3 rounded-full ${act.progress === 100 ? 'bg-green-500' : 'bg-indigo-400'}`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900">{act.title}</h4>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(act.date).toLocaleDateString()}</span>
                                            </div>
                                            {act.description && <p className="text-sm text-gray-500 mt-1">{act.description}</p>}
                                            <div className="mt-3 flex items-center space-x-3">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${act.progress}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-600 w-8">{act.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityTracker;
