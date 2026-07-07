import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const id = localStorage.getItem('userId');
    const loggedIn = Boolean(localStorage.getItem('token'));

    const links = loggedIn
        ? [{ to: '/', label: 'Home' }, { to: `/users/${id}`, label: 'Profile' }]
        : [{ to: '/', label: 'Home' }, { to: '/login', label: 'Login' }, { to: '/register', label: 'Register' }];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    };

    const linkClass = (to) => `rounded-full px-4 py-2 text-sm font-medium transition ${location.pathname === to
        ? 'bg-ufOrange text-white shadow-sm'
        : 'text-slate-700 hover:bg-blue-50 hover:text-ufBlue'
        }`;

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link to="/" className="text-2xl font-extrabold tracking-tight text-ufBlue">
                    Gator<span className="text-ufOrange">Hall</span>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    {links.map((l) => (
                        <Link key={l.to} to={l.to} className={linkClass(l.to)}>{l.label}</Link>
                    ))}
                    {loggedIn && (
                        <button
                            onClick={handleLogout}
                            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-ufBlue"
                        >
                            Logout
                        </button>
                    )}
                </nav>

                <button
                    className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                    </svg>
                </button>
            </div>

            {open && (
                <nav className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden">
                    {links.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            onClick={() => setOpen(false)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium ${location.pathname === l.to ? 'bg-ufOrange text-white' : 'text-slate-700 hover:bg-blue-50'
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    {loggedIn && (
                        <button
                            onClick={handleLogout}
                            className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            )}
        </header>
    );
}

export default Navbar;
