import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        }
        catch (error) {
            setError(error.response?.data?.error || 'Something went wrong.');
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <section className="hidden rounded-3xl bg-gradient-to-br from-ufBlue to-ufBlueDark p-10 text-white shadow-xl lg:block">
                <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    GatorHall Access
                </p>
                <h1 className="mt-5 text-4xl font-extrabold leading-tight">Welcome back, Gator.</h1>
                <p className="mt-4 text-blue-100">
                    Sign in to post reviews, track your favorite dorms, and explore student housing insights across campus.
                </p>
            </section>
            <section className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-3xl font-bold text-slate-900">Login</h1>
                <p className="mt-1 text-sm text-slate-600">Use your UFL email to continue.</p>
                {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <div className="mt-5 space-y-3">
                    <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-ufOrange focus:ring-2 focus:ring-orange-100"
                        type="email"
                        placeholder="UFL Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-ufOrange focus:ring-2 focus:ring-orange-100"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    className="mt-5 w-full rounded-lg bg-ufOrange px-4 py-2.5 font-semibold text-white transition hover:bg-ufOrangeDark"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <p className="mt-4 text-sm text-slate-700">
                    Don't have an account? <a className="font-semibold text-ufBlue hover:underline" href="/register">Register</a>
                </p>
            </section>
        </div>
    );
}

export default Login;