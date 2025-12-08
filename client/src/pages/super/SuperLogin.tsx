import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BackButton } from '../../components/ui/BackButton';
import { loginSuperManager } from '../../services/queueService';

export const SuperLogin = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const sm = loginSuperManager(phone, pin);
        if (sm) {
            navigate('/super-admin/dashboard');
        } else {
            setError('Invalid Phone or PIN');
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '400px' }}>
            <BackButton />
            <div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Business Owner Login</h2>

                {error && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 100, 100, 0.1)', color: 'var(--color-warning)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label>
                        Phone Number
                        <input
                            type="tel"
                            placeholder="Owner Phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%' }}
                        />
                    </label>

                    <label>
                        PIN
                        <input
                            type="password"
                            placeholder="4-digit PIN"
                            value={pin}
                            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            required
                            maxLength={4}
                            inputMode="numeric"
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%' }}
                        />
                    </label>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>
                        Login
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    New Business? <Link to="/super-admin/signup" style={{ color: 'var(--color-primary)' }}>Register Here</Link>
                </div>
            </div>
        </div>
    );
};
