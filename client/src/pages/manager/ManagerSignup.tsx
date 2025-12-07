import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BackButton } from '../../components/ui/BackButton';
import { signupManager } from '../../services/queueService';
import { db } from '../../mockDb';

export const ManagerSignup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check for pre-filled state (from Super Manager)
    const { name: preName, phone: prePhone } = location.state || {};

    const [name, setName] = useState(preName || '');
    const [phone, setPhone] = useState(prePhone || '');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');

    const isPreFilled = !!prePhone;

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (pin !== confirmPin) {
            setError('PINs do not match');
            return;
        }

        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }

        // Note: For strict assignment, we might want to check if phone is already valid?
        // But for now, we treat this as "Create or Update credentials"

        // Create/Update Account
        const newManager = signupManager(name, phone, pin);

        // Auto Login
        db.setManager(newManager);

        alert('Account Active! Logging you in...');
        navigate('/manager/dashboard');
    };

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '400px' }}>
            <BackButton />
            <div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isPreFilled ? 'Activate Account' : 'Manager Signup'}
                </h2>

                {isPreFilled && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                        {isPreFilled ? (
                            <p style={{ margin: 0, color: 'var(--color-success)' }}>
                                Welcome <strong>{name}</strong>! Please set a PIN to activate your account.
                            </p>
                        ) : (
                            <p style={{ margin: 0 }}>Create your Manager Account</p>
                        )}
                    </div>
                )}

                {error && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 100, 100, 0.1)', color: 'var(--color-warning)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label>
                        Full Name
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            disabled={isPreFilled}
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%', opacity: isPreFilled ? 0.7 : 1 }}
                        />
                    </label>

                    <label>
                        Phone Number
                        <input
                            type="tel"
                            placeholder="Your Phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            disabled={isPreFilled}
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%', opacity: isPreFilled ? 0.7 : 1 }}
                        />
                    </label>

                    <label>
                        Create PIN
                        <input
                            type="password"
                            placeholder="Set 4-digit PIN"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            required
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%' }}
                        />
                    </label>

                    <label>
                        Confirm PIN
                        <input
                            type="password"
                            placeholder="Re-enter PIN"
                            value={confirmPin}
                            onChange={e => setConfirmPin(e.target.value)}
                            required
                            style={{ padding: '0.75rem', marginTop: '0.25rem', width: '100%' }}
                        />
                    </label>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>
                        {isPreFilled ? 'Activate & Login' : 'Create Account'}
                    </button>
                </form>

                {!isPreFilled && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/manager/login" style={{ color: 'var(--color-primary)' }}>Login here</Link>
                    </div>
                )}
            </div>
        </div>
    );
};
