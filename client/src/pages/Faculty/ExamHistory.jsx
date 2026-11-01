import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../api/config';

const ExamHistory = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_BASE_URL}/api/exams/exams`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExams(data);
            } catch (error) {
                toast.error('Error fetching exam history');
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Exam History</h1>
                        <p className="text-gray-600 mt-2">View all scheduled and announced exams</p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading exams...</p>
                    </div>
                ) : exams.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No exams scheduled</h3>
                        <p className="mt-2 text-gray-600">Schedule your first exam to see it here.</p>
                        <Link
                            to="/faculty/create-exam"
                            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                            Schedule Exam
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {exams.map((exam) => (
                            <div
                                key={exam._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{exam.name}</h3>
                                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                                                {exam.subject?.code || 'N/A'}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 font-medium mb-2">
                                            {exam.subject?.name || 'Subject not found'}
                                        </p>
                                        {exam.description && (
                                            <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium">{formatDate(exam.date)}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium">Total Marks: {exam.totalMarks}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Link
                                            to={`/faculty/marks/${exam.subject?._id}`}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition text-center"
                                        >
                                            Upload Marks
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamHistory;
