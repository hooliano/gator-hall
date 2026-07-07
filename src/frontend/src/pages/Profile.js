import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api'
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import StarRating from '../components/StarRating';


function Profile() {
    const [editingId, setEditingId] = useState(null);
    const [editBody, setEditBody] = useState('');
    const [editRating, setEditRating] = useState(null);
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const { id } = useParams();

    const navigate = useNavigate();

    const loggedInUserId = parseInt(localStorage.getItem('userId'));

    const startEditing = (review) => {
        setActionError('');
        setEditingId(review.id);
        setEditBody(review.body);
        setEditRating(review.rating);
    };

    const handleDelete = async (dormId, reviewId) => {
        setActionError('');
        try {
            await api.delete(`/dorms/${dormId}/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
        }
        catch (error) {
            setActionError(error.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleUpdate = async (dormId, reviewId) => {
        setActionError('');
        try {
            const response = await api.patch(`/dorms/${dormId}/reviews/${reviewId}`, { rating: editRating, review_body: editBody });
            setReviews(reviews.map(r => r.id === reviewId ? { ...response.data.review, dorm: r.dorm } : r));
            setEditingId(null);
        }
        catch (error) {
            setActionError(error.response?.data?.error || 'Something went wrong.');
        }
    };

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await api.get(`/users/${id}/reviews`);
                setUser(response.data.user)
                setReviews(response.data.reviews);
            }
            catch (error) {
                setError(error.response?.data?.error || 'Something went wrong.');
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserReviews();
    }, [id]);

    if (!localStorage.getItem('token')) navigate('/login');

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-40 w-full rounded-3xl" />
                <Skeleton className="h-72 w-full rounded-3xl" />
            </div>
        );
    }
    if (error) return <Alert>{error}</Alert>;

    const isOwnProfile = loggedInUserId === parseInt(id);
    const avgGiven = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    return (
        <div className="space-y-6">
            <section className="rounded-3xl bg-ufBlueDark p-8 text-white shadow-xl ring-1 ring-white/10">
                <div className="flex items-center gap-4">
                    <Avatar name={user.displayName} size="h-16 w-16" className="text-xl ring-4 ring-white/20" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Student Profile</p>
                        <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{user.displayName}</h1>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/12 px-3 py-1 text-sm">
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''} posted
                    </span>
                    {avgGiven !== null && (
                        <span className="rounded-full bg-white/12 px-3 py-1 text-sm">Avg rating given: {avgGiven.toFixed(1)}/5</span>
                    )}
                </div>
            </section>

            <Card>
                <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
                    <Badge variant="blue">{reviews.length} posted</Badge>
                </div>
                {actionError && <Alert className="mb-4">{actionError}</Alert>}
                <div className="stagger-children space-y-4">
                    {reviews.map((review) => (
                        <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                            {editingId !== review.id ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-ufBlue">{review.dorm.name}</p>
                                        <StarRating value={review.rating} size="h-4 w-4" showValue />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-700">{review.body}</p>
                                    {isOwnProfile && (
                                        <div className="mt-4 flex gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => startEditing(review)}>Update</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(review.dormId, review.id)}>Delete</Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <p className="font-semibold text-ufBlue">{review.dorm.name}</p>
                                    <StarRating value={editRating} onChange={setEditRating} size="h-6 w-6" />
                                    <textarea
                                        className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-ufOrange focus:ring-4 focus:ring-orange-100"
                                        rows={3}
                                        placeholder="Explain your rating."
                                        value={editBody}
                                        onChange={(e) => setEditBody(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleUpdate(review.dormId, review.id)}>Save Changes</Button>
                                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                    {reviews.length === 0 && (
                        <EmptyState title="No reviews yet" description="This user has not posted any reviews yet." />
                    )}
                </div>
            </Card>
        </div>
    );
}

export default Profile;
