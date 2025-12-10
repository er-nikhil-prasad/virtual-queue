import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setupTeam } from '../../services/queueService';

export const TeamSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        phone: '',
        pin: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            try {
                setupTeam(
                    formData.businessName,
                    formData.ownerName,
                    formData.phone,
                    formData.pin
                );
                navigate('/admin/dashboard');
            } catch (err: any) {
                setError(err.message || 'Signup failed');
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
            <div style={{ width: '100%', maxWidth: '800px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: 'var(--color-text)',
                        marginBottom: '1rem'
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
                    </Link>

                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>👥</span>
                        Team Setup
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Create your business account and manage your team
                    </p>
                </div>

                {/* Form Card - Two Column Layout */}
                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        {/* Left Column - Business Details */}
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--color-primary)',
                                marginBottom: '1.25rem'
                            }}>
                                Business Details
                            </div>

                            <div className="form-group">
                                <label>Business Name</label>
                                <input
                                    required
                                    placeholder="City Hospital, Salon XYZ..."
                                    value={formData.businessName}
                                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                />
                            </div>

                            {/* Info Box */}
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.8rem',
                                color: 'var(--color-text-muted)'
                            }}>
                                <strong style={{ color: 'var(--color-primary-hover)' }}>💡 What's next?</strong>
                                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                                    After signup, you'll create queues and assign managers.
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Owner Credentials */}
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--color-primary)',
                                marginBottom: '1.25rem'
                            }}>
                                Owner Credentials
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Your Name</label>
                                    <input
                                        required
                                        placeholder="Admin / Owner name"
                                        value={formData.ownerName}
                                        onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Your mobile number"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Create PIN</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="4-6 digit PIN"
                                        maxLength={6}
                                        value={formData.pin}
                                        onChange={e => setFormData({ ...formData, pin: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '0.875rem',
                            background: 'var(--color-danger-bg)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-danger)',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        {loading ? 'Creating account...' : 'Create Business Account →'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem'
                }}>
                    <p>Already have an account? <Link to="/login" style={{ fontWeight: 500 }}>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};
