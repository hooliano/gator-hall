function Input({ label, className = '', ...props }) {
    return (
        <label className="block">
            {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
            <input
                className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-ufOrange focus:ring-4 focus:ring-orange-100 ${className}`}
                {...props}
            />
        </label>
    );
}

export default Input;
