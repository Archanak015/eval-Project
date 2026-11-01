import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';

const NotificationPanel = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: '', message: '', targetRole: 'all' });
    const [showForm, setShowForm] = useState(false);

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle both { data: [...] } and direct array [...]
            const noticeList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setNotices(noticeList);
        } catch (error) {
            console.error("Error fetching notices", error);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleSendNotice = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/notifications`, newNotice, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Notice sent successfully');
            setNewNotice({ title: '', message: '', targetRole: 'all' });
            setShowForm(false);
            fetchNotices();
        } catch (error) {
            toast.error('Error sending notice');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    Campus Notice Board
                </h2>
                {user?.role === 'admin' && (
                    <button onClick={() => setShowForm(!showForm)} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-semibold transition">
                        {showForm ? 'Close Form' : '+ Post Notice'}
                    </button>
                )}
            </div>

            {showForm && user?.role === 'admin' && (
                <form onSubmit={handleSendNotice} className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <input className="w-full mb-2 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Title" value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} required />
                    <textarea className="w-full mb-2 p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Message content..." value={newNotice.message} onChange={e => setNewNotice({ ...newNotice, message: e.target.value })} required rows="3"></textarea>
                    <div className="flex gap-3 items-center">
                        <select className="p-2 text-sm border border-gray-300 rounded-lg" value={newNotice.targetRole} onChange={e => setNewNotice({ ...newNotice, targetRole: e.target.value })}>
                            <option value="all">All Users</option>
                            <option value="student">Students Only</option>
                            <option value="faculty">Faculty Only</option>
                        </select>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 font-medium transition">Publish Notice</button>
                    </div>
                </form>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {Array.isArray(notices) && notices.map(notice => (
                    <div key={notice._id} className="border-l-4 border-blue-500 bg-gray-50/70 p-4 rounded-xl relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{notice.title}</h3>
                                <p className="text-gray-600 text-xs mt-1 leading-relaxed">{notice.message}</p>
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium">
                                {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                        </div>
                    </div>
                ))}
                {(!notices || notices.length === 0) && (
                    <p className="text-gray-400 text-xs text-center py-4">No announcements posted yet.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
