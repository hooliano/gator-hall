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



    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div>
            <h1>Dorm Page</h1>
            <h2>Submit a Review</h2>
            <input
                type="number"
                placeholder="Rating (0-5)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <input
                type="text"
                placeholder="Explain your rating."
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <button onClick={handleSubmit}>Post</button>
            <h2>Reviews</h2>
            {reviews.map(review => (
                <div key={review.id}>
                    <h3>{review.user.displayName}</h3>
                    <h4>{review.rating}/5</h4>
                    <p>{review.body}</p>
                </div>
            ))}
        </div>
    );
}

export default DormPage;