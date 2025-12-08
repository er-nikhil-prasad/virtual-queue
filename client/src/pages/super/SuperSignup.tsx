import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BackButton } from '../../components/ui/BackButton';
import { signupSuperManager } from '../../services/queueService';

export const SuperSignup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (pin !== confirmPin) {
            setError('PINs do not match');
            return;
        }

        if (pin.length < 4) {
            setError('PIN must be 4 digits');
            return;
        }

        try {
            signupSuperManager(name, phone, pin);
            navigate('/super-admin/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '400px' }}>
            <BackButton />
            <div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register Business</h2>

                {error && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 100, 100, 0.1)', color: 'var(--color-warning)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label>
                        Business / Owner Name
                        <input
                            type="text"
                            placeholder="e.g. Dr. Smith"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%' }}
                        />
                    </label>

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
                        Create PIN
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

                    <label>
                        Confirm PIN
                        <input
                            type="password"
                            placeholder="Re-enter PIN"
                            value={confirmPin}
                            onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            required
                            maxLength={4}
                            inputMode="numeric"
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%' }}
                        />
                    </label>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>
                        Register & Login
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already registered? <Link to="/super-admin/login" style={{ color: 'var(--color-primary)' }}>Login Here</Link>
                </div>
            </div>
        </div>
    );
};
