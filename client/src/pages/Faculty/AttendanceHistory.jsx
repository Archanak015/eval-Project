import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AttendanceHistory = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`http://localhost:5000/api/attendance/history/${subjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAttendanceData(data);
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching attendance history");
                setLoading(false);
            }
        };
        fetchHistory();
    }, [subjectId]);

    const calculateStats = (records) => {
        const total = records.length;
        const present = records.filter(r => r.status === 'Present').length;
        return { total, present, percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0 };
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
                <button
                    onClick={() => navigate('/faculty/subjects')}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition"
                >
                    Back to Subjects
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading history...</div>
            ) : attendanceData.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                    No attendance records found for this subject.
                </div>
            ) : (
                <div className="space-y-6">
                    {attendanceData.map((record) => (
                        <div key={record._id} className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="bg-indigo-600 px-6 py-3 flex justify-between items-center text-white">
                                <span className="font-bold">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span className="text-sm bg-indigo-500 px-3 py-1 rounded-full">
                                    {calculateStats(record.records).present} / {calculateStats(record.records).total} Present
                                </span>
                            </div>
                            <div className="p-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student Enrollment</th>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {record.records.map((r, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                                                    {/* If student is populated we might have details, otherwise just ID */}
                                                    {r.student?.enrollmentNo || r.student}
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;
