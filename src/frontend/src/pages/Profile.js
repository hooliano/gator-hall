import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api'


function Profile() {
    const [editingId, setEditingId] = useState(null);
    const [editBody, setEditBody] = useState('');
    const [editRating, setEditRating] = useState('');
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    const navigate = useNavigate();

    const loggedInUserId = parseInt(localStorage.getItem('userId'));

    const handleDelete = async (dormId, reviewId) => {
        try {
            await api.delete(`/dorms/${dormId}/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
        }
        catch (error) {
            setError(error.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleUpdate = async (dormId, reviewId) => {
        try {
            const response = await api.patch(`/dorms/${dormId}/reviews/${reviewId}`, { rating: editRating, review_body: editBody });
            setReviews(reviews.map(r => r.id === reviewId ? { ...response.data.review, dorm: r.dorm } : r));
            setEditingId(null);
        }
        catch (error) {
            setError(error.response?.data?.error || 'Something went wrong.');
        }
    };

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await api.get(`/users/${id}/reviews`);
                setUser(response.data.user)
                setReviews(response.data.reviews);
                setLoading(false);
            }
            catch (error) {
                setError(error.response?.data?.error || 'Something went wrong.');
                setLoading(false);
            }
        };

        fetchUserReviews();
    }, [id]);

    if (!localStorage.getItem('token')) navigate('/login');
    if (loading) return <p className="rounded-2xl bg-white p-8 text-ufBlue shadow-sm">Loading profile...</p>;
    if (error) return <p className="rounded-2xl bg-red-50 p-8 text-red-600 shadow-sm">{error}</p>;

    return (
        <div className="space-y-6">
            <section className="rounded-3xl bg-gradient-to-r from-ufBlue to-ufBlueDark p-8 text-white shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Student Profile</p>
                <h1 className="mt-2 text-4xl font-extrabold">{user.displayName}</h1>
                <p className="mt-2 text-blue-100">Review activity and housing feedback contributions.</p>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-ufBlue">{reviews.length} posted</span>
                </div>
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            {editingId !== review.id ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-ufBlue">{review.dorm.name}</p>
                                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-ufOrange">{review.rating}/5</span>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-700">{review.body}</p>
                                    {loggedInUserId === parseInt(id) && (
                                        <>
                                            <button
                                                className="mt-5 w-full rounded-lg bg-ufOrange px-4 py-2.5 font-semibold text-white transition hover:bg-ufOrangeDark"
                                                onClick={() => setEditingId(review.id)}
                                            >Update
                                            </button>
                                            <button
                                                className="mt-5 w-full rounded-lg bg-ufOrange px-4 py-2.5 font-semibold text-white transition hover:bg-ufOrangeDark"
                                                onClick={() => handleDelete(review.dormId, review.id)}
                                            >Delete
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="mt-4 space-y-3">
                                        <input
                                            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-ufOrange focus:ring-2 focus:ring-orange-100"
                                            type="number"
                                            placeholder="Rating (0-5)"
                                            value={editRating}
                                            onChange={(e) => setEditRating(e.target.value)}
                                        />
                                        <input
                                            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-ufOrange focus:ring-2 focus:ring-orange-100"
                                            type="text"
                                            placeholder="Explain your rating."
                                            value={editBody}
                                            onChange={(e) => setEditBody(e.target.value)}
                                        />
                                        <p className="text-xs text-slate-500">Ratings are from 0 to 5 and should reflect your overall living experience.</p>
                                        <button
                                            className="w-full rounded-lg bg-ufOrange px-4 py-2 font-semibold text-white transition hover:bg-ufOrangeDark"
                                            onClick={() => handleUpdate(review.dormId, review.id)}
                                        >
                                            Update Review
                                        </button>
                                    </div>
                                </>
                            )}
                        </article>
                    ))}
                    {reviews.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                            This user has not posted any reviews yet.
                        </div>
                    )}
                </div>
            </section >
        </div >
    );
}

export default Profile;