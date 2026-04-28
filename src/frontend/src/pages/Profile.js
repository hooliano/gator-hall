import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'


function Profile() {
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { id } = useParams();

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

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div>
            <h1>{user.displayName}</h1>
            <h2>Reviews</h2>
            {reviews.map(review => (
                <div key={review.id}>
                    <p>Dormitory: {review.dorm.name}</p>
                    <p>Rating: {review.rating}/5</p>
                    <p>Description: {review.body}</p>
                </div>
            ))}
        </div>
    );
}

export default Profile;