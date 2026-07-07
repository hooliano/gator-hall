const VARIANTS = {
    error: 'bg-red-50 text-red-700 ring-1 ring-red-100',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    info: 'bg-blue-50 text-ufBlue ring-1 ring-blue-100',
};

function Alert({ variant = 'error', children, className = '' }) {
    if (!children) return null;
    return (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${VARIANTS[variant]} ${className}`}>
            {children}
        </div>
    );
}

export default Alert;
