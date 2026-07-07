function Card({ as: Component = 'div', className = '', children, ...props }) {
    return (
        <Component className={`rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200/70 ${className}`} {...props}>
            {children}
        </Component>
    );
}

export default Card;
