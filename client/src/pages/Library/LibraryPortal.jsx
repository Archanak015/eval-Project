import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';
import { StatusChip } from '../../components/Badges';

const LibraryPortal = () => {
    const [books, setBooks] = useState([]);
    const [borrowed, setBorrowed] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search.trim()) params.append('search', search.trim());
            if (category) params.append('category', category);

            const [booksRes, myRes] = await Promise.all([
                axiosClient.get(`/api/enterprise/library/books?${params.toString()}`),
                axiosClient.get('/api/enterprise/library/my-borrowed').catch(() => ({ data: { data: [] } }))
            ]);

            setBooks(booksRes.data?.data || []);
            setBorrowed(myRes.data?.data || []);
        } catch (err) {
            console.error('Error fetching library catalog', err);
            toast.error('Failed to load library catalog');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchBooks, 300);
        return () => clearTimeout(timer);
    }, [search, category]);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-slate-800 font-medium">Library Resource Center</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        University Library & Learning Commons
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Search catalog books, view rack locations, and inspect active book loans.</p>
                </div>
            </div>

            {/* Active Book Loans Section */}
            {borrowed.length > 0 && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                        <span>📖 Your Active Book Loans ({borrowed.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {borrowed.map(item => (
                            <div key={item._id} className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-xs">
                                <p className="font-bold text-slate-900 text-sm">{item.book?.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">Author: {item.book?.author}</p>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 text-xs">
                                    <span className="text-slate-400 font-mono">ISBN: {item.book?.isbn}</span>
                                    <span className="text-amber-800 font-bold">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search books by title, author, or ISBN..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Information Systems">Information Systems</option>
                    <option value="Mathematics">Mathematics</option>
                </select>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                    <div key={book._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
                        <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                    {book.category}
                                </span>
                                <StatusChip status={book.status} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{book.title}</h3>
                            <p className="text-xs text-slate-500 mt-1">By <strong>{book.author}</strong></p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">ISBN: {book.isbn}</p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">📍 {book.rackLocation}</span>
                            <span className="font-bold text-slate-800">
                                {book.availableCopies} of {book.totalCopies} Available
                            </span>
                        </div>
                    </div>
                ))}
                {books.length === 0 && !loading && (
                    <div className="col-span-full">
                        <EmptyState title="No books matching query" description="Try another search term or filter category." />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryPortal;
