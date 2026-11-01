import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/dashboard" className="hover:text-blue-600 transition flex items-center gap-1">
                <span>🏠</span>
                <span>Dashboard</span>
            </Link>
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-300">/</span>
                    {item.link ? (
                        <Link to={item.link} className="hover:text-blue-600 transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-800 font-bold">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
