const LoadingSkeleton = ({ count = 5 }) => {
    return (
        <div className="space-y-3 p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded-lg w-1/4 mb-4"></div>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="flex gap-4 items-center">
                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
