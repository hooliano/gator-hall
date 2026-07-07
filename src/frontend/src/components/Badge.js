const VARIANTS = {
    blue: 'bg-blue-50 text-ufBlue',
    orange: 'bg-orange-50 text-ufOrange',
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-50 text-emerald-600',
};

function Badge({ variant = 'slate', className = '', children }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${VARIANTS[variant]} ${className}`}>
            {children}
        </span>
    );
}

export default Badge;
