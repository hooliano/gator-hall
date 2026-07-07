const VARIANTS = {
    primary: 'bg-ufOrange text-white hover:bg-ufOrangeDark shadow-sm hover:shadow-glow',
    secondary: 'bg-white text-ufBlue ring-1 ring-slate-200 hover:bg-blue-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50',
};

const SIZES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
};

function Button({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size]} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
