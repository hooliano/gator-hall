import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import StarRating from '../components/StarRating';

function DormPage() {
    const [dorm, setDorm] = useState(null);
    const [rating, setRating] = useState(null);
    const [body, setBody] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { id } = useParams();

    // Handles all review submissions
    const handleSubmit = async () => {
        setSubmitError('');
        if (!rating) {
            setSubmitError('Please select a star rating.');
            return;
        }
        if (!body.trim()) {
            setSubmitError('Please write a short review.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post(`/dorms/${id}/reviews`, { review_body: body, rating });
            setReviews([response.data.review, ...reviews]);
            setDorm((prev) => prev && {
                ...prev,
                reviewCount: prev.reviewCount + 1,
                avgRating: ((prev.avgRating || 0) * prev.reviewCount + rating) / (prev.reviewCount + 1),
            });
            setBody('');
            setRating(null);
        }
        catch (error) {
            setSubmitError(error.response?.data?.error || 'Something went wrong.');
        }
        finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dormRes, reviewsRes] = await Promise.all([
                    api.get(`/dorms/${id}`),
                    api.get(`/dorms/${id}/reviews`),
                ]);
                setDorm(dormRes.data);
                setReviews(reviewsRes.data);
            }
            catch (error) {
                setError(error.response?.data?.error || 'Something went wrong.');
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-3xl" />
                <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                    <Skeleton className="h-72 rounded-3xl" />
                    <Skeleton className="h-72 rounded-3xl" />
                </div>
            </div>
        );
    }

    if (error) return <Alert>{error}</Alert>;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
                <img
                    src={dorm.imageUrl}
                    alt={dorm.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-50"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="relative p-8">
                    <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        Residence Hall
                    </p>
                    <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">{dorm.name}</h1>
                    <div className="mt-4">
                        {dorm.reviewCount > 0 ? (
                            <StarRating value={dorm.avgRating} showValue reviewCount={dorm.reviewCount} />
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                                No reviews yet
                            </span>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                <Card as="section" className="h-fit">
                    <h2 className="text-xl font-bold text-slate-900">Submit a Review</h2>
                    <p className="mt-1 text-sm font-medium text-ufOrange">Share your living experience</p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="mb-1.5 text-sm font-medium text-slate-700">Your rating</p>
                            <StarRating value={rating} onChange={setRating} size="h-7 w-7" />
                        </div>
                        <textarea
                            className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ufOrange focus:ring-4 focus:ring-orange-100"
                            rows={4}
                            placeholder="Explain your rating."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        {submitError && <Alert>{submitError}</Alert>}
                        <Button fullWidth onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Publishing…' : 'Publish Review'}
                        </Button>
                    </div>
                </Card>

                <Card as="section">
                    <div className="mb-4 flex items-end justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Recent Reviews</h2>
                        <Badge variant="blue">{reviews.length} total</Badge>
                    </div>
                    <div className="stagger-children space-y-4">
                        {reviews.map((review) => (
                            <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={review.user.displayName} size="h-9 w-9" />
                                        <p className="font-semibold text-slate-800">{review.user.displayName}</p>
                                    </div>
                                    <StarRating value={review.rating} size="h-4 w-4" showValue />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-slate-700">{review.body}</p>
                            </article>
                        ))}
                        {reviews.length === 0 && (
                            <EmptyState title="No reviews yet" description="Be the first to share your dorm experience." />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default DormPage;
