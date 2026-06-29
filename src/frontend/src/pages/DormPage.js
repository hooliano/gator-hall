import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function DormPage() {
    const [rating, setRating] = useState('');
    const [body, setBody] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { id } = useParams();

    // Handles all review submissions
    const handleSubmit = async () => {
        try {
            const response = await api.post(`/dorms/${id}/reviews`, { review_body: body, rating: parseFloat(rating) });
            setReviews([response.data.review, ...reviews]);
            setBody('');
            setRating('');
        }
        catch (error) {
            setError(error.response?.data?.error || 'Something went wrong.');
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/dorms/${id}/reviews`);
                setReviews(response.data);
                setLoading(false);
            }
            catch (error) {
                setError(error.response?.data?.error || 'Something went wrong.');
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id]);



    if (loading) return <p className="rounded-2xl bg-white p-8 text-ufBlue shadow-sm">Loading dorm reviews...</p>;
    if (error) return <p className="rounded-2xl bg-red-50 p-8 text-red-600 shadow-sm">{error}</p>;

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <section className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-2xl font-bold text-slate-900">Dorm #{id}</h1>
                <h2 className="mt-1 text-sm font-medium text-ufOrange">Submit a Review</h2>
                <div className="mt-4 space-y-3">
                    <input
                        className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-ufOrange focus:ring-2 focus:ring-orange-100"
                        type="number"
                        placeholder="Rating (0-5)"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                    <input
                        className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-ufOrange focus:ring-2 focus:ring-orange-100"
                        type="text"
                        placeholder="Explain your rating."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">Ratings are from 0 to 5 and should reflect your overall living experience.</p>
                    <button
                        className="w-full rounded-lg bg-ufOrange px-4 py-2 font-semibold text-white transition hover:bg-ufOrangeDark"
                        onClick={handleSubmit}
                    >
                        Publish Review
                    </button>
                </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Recent Reviews</h2>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-ufBlue">{reviews.length} total</span>
                </div>
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-ufBlue">{review.user.displayName}</h3>
                                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-ufOrange">{review.rating}/5</span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-700">{review.body}</p>
                        </article>
                    ))}
                    {reviews.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                            No reviews yet. Be the first to share your dorm experience.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default DormPage;