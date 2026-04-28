import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Home() {
    const [loading, setLoading] = useState(true);
    const [dorms, setDorms] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDorms = async () => {
            try {
                const response = await api.get('/dorms');
                setDorms(response.data);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                setError(error.response?.data?.error || 'Something went wrong.');
                setLoading(false);
            }
        };

        fetchDorms();
    }, []);

    if (loading) return <p className="rounded-2xl bg-white p-8 text-ufBlue shadow-sm">Loading dorms...</p>;
    if (error) return <p className="rounded-2xl bg-red-50 p-8 text-red-600 shadow-sm">{error}</p>;

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-ufBlue to-ufBlueDark p-8 text-white shadow-xl">
                <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    University of Florida Housing
                </p>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Find your next dorm with confidence.</h1>
                <p className="mt-3 max-w-2xl text-blue-100">
                    Browse community reviews, compare options, and make an informed housing decision with real student feedback.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm">Verified student reviews</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm">Fast search experience</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm">UF-themed interface</span>
                </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Select a Dorm</h2>
                        <p className="text-sm text-slate-500">{dorms.length} dorm options available</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dorms.map((dorm) => (
                        <button
                            key={dorm.id}
                            onClick={() => navigate(`/dorms/${dorm.id}`)}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-ufOrange hover:shadow-lg"
                        >
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Residence Hall</p>
                            <h3 className="mt-2 text-xl font-bold text-ufBlue group-hover:text-ufBlueDark">{dorm.name}</h3>
                            <p className="mt-2 text-sm text-slate-600">View reviews, ratings, and student feedback.</p>
                            <p className="mt-4 text-sm font-semibold text-ufOrange">View details →</p>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;