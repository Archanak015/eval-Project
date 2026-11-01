const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
    const colorSchemes = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        purple: 'text-purple-600 bg-purple-50 border-purple-100',
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        rose: 'text-rose-600 bg-rose-50 border-rose-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100'
    };

    const scheme = colorSchemes[color] || colorSchemes.blue;

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                {icon && <span className={`text-base p-2 rounded-xl border ${scheme}`}>{icon}</span>}
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{value}</p>
            {subtitle && (
                <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
            )}
        </div>
    );
};

export default StatCard;
