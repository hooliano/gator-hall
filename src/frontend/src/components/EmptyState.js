function EmptyState({ title, description, icon }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
            {icon && (
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
                    {icon}
                </div>
            )}
            <p className="font-semibold text-slate-700">{title}</p>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
    );
}

export default EmptyState;
