import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthBrandPanel from '../components/AuthBrandPanel';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

function Register() {
    const [display_name, setDisplay_Name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/register', { display_name, email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            navigate('/');
        }
        catch (error) {
            setError(error.response?.data?.error || 'Something went wrong.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <AuthBrandPanel
                eyebrow="Join GatorHall"
                title="Create your student profile."
                description="Add your voice to UF housing reviews and help future students discover the best fit."
            />
            <Card as="section" className="w-full animate-fadeUp">
                <h1 className="text-3xl font-bold text-slate-900">Register</h1>
                <p className="mt-1 text-sm text-slate-600">Get started in less than a minute.</p>
                {error && <Alert className="mt-4">{error}</Alert>}
                <div className="mt-5 space-y-3">
                    <Input
                        type="text"
                        placeholder="Display Name"
                        value={display_name}
                        onChange={(e) => setDisplay_Name(e.target.value)}
                    />
                    <Input type="email" placeholder="UFL Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button fullWidth className="mt-5" onClick={handleRegister} disabled={loading}>
                    {loading ? 'Creating account…' : 'Register'}
                </Button>
                <p className="mt-4 text-sm text-slate-700">
                    Already have an account? <Link className="font-semibold text-ufBlue hover:underline" to="/login">Login</Link>
                </p>
            </Card>
        </div>
    );
}

export default Register;
