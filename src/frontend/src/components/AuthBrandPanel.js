function AuthBrandPanel({ eyebrow, title, description }) {
    return (
        <section className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-ufBlue to-ufBlueDark p-10 text-white shadow-xl lg:block">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ufOrange/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
                <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {eyebrow}
                </p>
                <h1 className="mt-5 text-4xl font-extrabold leading-tight">{title}</h1>
                <p className="mt-4 text-white/80">{description}</p>
            </div>
        </section>
    );
}

export default AuthBrandPanel;
