import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Skeleton from '../components/Skeleton';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import StarRating from '../components/StarRating';

function DormCard({ dorm, onClick }) {
    return (
        <button
            onClick={onClick}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-soft transition hover:-translate-y-1 hover:border-ufOrange hover:shadow-card"
        >
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                    src={dorm.imageUrl}
                    alt={dorm.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Residence Hall</p>
                <h3 className="mt-1 text-lg font-bold text-ufBlue group-hover:text-ufBlueDark">{dorm.name}</h3>
                <div className="mt-2">
                    {dorm.reviewCount > 0 ? (
                        <StarRating value={dorm.avgRating} size="h-4 w-4" showValue reviewCount={dorm.reviewCount} />
                    ) : (
                        <Badge variant="slate">No reviews yet</Badge>
                    )}
                </div>
                <p className="mt-4 text-sm font-semibold text-ufOrange">View details →</p>
            </div>
        </button>
    );
}

function Home() {
    const [loading, setLoading] = useState(true);
    const [dorms, setDorms] = useState([]);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('name');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDorms = async () => {
            try {
                const response = await api.get('/dorms');
                setDorms(response.data);
            }
            catch (error) {
                setError(error.response?.data?.error || 'Something went wrong.');
            }
            finally {
                setLoading(false);
            }
        };

        fetchDorms();
    }, []);

    const visibleDorms = useMemo(() => {
        const filtered = dorms.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
        const sorted = [...filtered];
        if (sort === 'rating') {
            sorted.sort((a, b) => (b.avgRating ?? -1) - (a.avgRating ?? -1));
        } else if (sort === 'reviews') {
            sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        } else {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        return sorted;
    }, [dorms, query, sort]);

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl bg-ufBlueDark p-8 text-white shadow-xl ring-1 ring-white/10">
                <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    University of Florida Housing
                </p>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Find your next dorm with confidence.</h1>
                <p className="mt-3 max-w-2xl text-white/80">
                    Browse community reviews, compare options, and make an informed housing decision with real student feedback.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/12 px-3 py-1 text-sm">Verified student reviews</span>
                    <span className="rounded-full bg-white/12 px-3 py-1 text-sm">Fast search experience</span>
                    <span className="rounded-full bg-white/12 px-3 py-1 text-sm">UF-themed interface</span>
                </div>
            </section>

            <Card>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Select a Dorm</h2>
                        <p className="text-sm text-slate-500">{dorms.length} dorm options available</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search dorms..."
                            className="rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none transition focus:border-ufOrange focus:ring-4 focus:ring-orange-100 sm:w-56"
                        />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-700 outline-none transition focus:border-ufOrange focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="name">Sort: Name (A-Z)</option>
                            <option value="rating">Sort: Highest rated</option>
                            <option value="reviews">Sort: Most reviewed</option>
                        </select>
                    </div>
                </div>

                {error && <Alert className="mb-4">{error}</Alert>}

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="overflow-hidden rounded-2xl border border-slate-200">
                                <Skeleton className="h-40 w-full rounded-none" />
                                <div className="space-y-2 p-5">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : visibleDorms.length === 0 ? (
                    <EmptyState title="No dorms found" description="Try a different search term." />
                ) : (
                    <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleDorms.map((dorm) => (
                            <DormCard key={dorm.id} dorm={dorm} onClick={() => navigate(`/dorms/${dorm.id}`)} />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default Home;
