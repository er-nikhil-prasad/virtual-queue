import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { unifiedLogin } from '../services/queueService';

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ phone: '', pin: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const result = unifiedLogin(formData.phone, formData.pin);

            if (result) {
                if (result.type === 'super') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/manager/dashboard');
                }
            } else {
                setError('Invalid phone number or PIN');
                setLoading(false);
            }
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: 'var(--color-text)',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span>⏳</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>Virtual Queue</span>
                    </Link>

                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Sign in to continue to your dashboard</p>
                </div>

                {/* Form Card */}
                <div className="card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>PIN</label>
                            <input
                                type="password"
                                required
                                placeholder="Enter your PIN"
                                maxLength={6}
                                value={formData.pin}
                                onChange={e => setFormData({ ...formData, pin: e.target.value })}
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.875rem',
                                background: 'var(--color-danger-bg)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-danger)',
                                fontSize: '0.875rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginTop: '0.5rem' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem'
                }}>
                    <p>Don't have an account?</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                        <Link to="/signup/individual" style={{ fontWeight: 500 }}>Individual Signup</Link>
                        <span style={{ color: 'var(--color-text-subtle)' }}>•</span>
                        <Link to="/signup/team" style={{ fontWeight: 500 }}>Team Signup</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
