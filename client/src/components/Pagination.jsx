const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.pages <= 1) return null;

    const { page, pages, total } = pagination;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-slate-100 text-xs text-slate-600">
            <div>
                Showing page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{pages}</strong> ({total} total records)
            </div>
            <div className="flex items-center gap-1.5">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                    Previous
                </button>
                {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                    const p = i + 1;
                    return (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                                page === p ? 'bg-blue-600 text-white shadow-xs' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {p}
                        </button>
                    );
                })}
                <button
                    disabled={page >= pages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
