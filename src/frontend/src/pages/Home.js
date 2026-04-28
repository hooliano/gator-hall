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
                setError(error.response?.data?.error || 'Something went wrong.');
                setLoading(false);
            }
        };

        fetchDorms();
    }, []);

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div>
            <h1>GatorHall</h1>
            <h2>Select a Dorm</h2>
            {dorms.map(dorm => (
                <div key={dorm.id} onClick={() => navigate(`/dorms/${dorm.id}`)}>
                    <h3>{dorm.name}</h3>
                </div>
            ))}
        </div>
    );
}

export default Home;