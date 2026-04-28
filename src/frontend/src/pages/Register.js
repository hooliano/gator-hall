import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
    const [display_name, setDisplay_Name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await api.post('/auth/register', { display_name, email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        }
        catch (error) {
            setError(error.response?.data?.error || 'Something went wrong.');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Display Name"
                value={display_name}
                onChange={(e) => { setDisplay_Name(e.target.value) }}
            />
            <input
                type="email"
                placeholder="UFL Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
            />
            <button onClick={handleRegister}>Register</button>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
}

export default Register;