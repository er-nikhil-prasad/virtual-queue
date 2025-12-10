import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setupIndividual } from '../../services/queueService';

export const IndividualSignup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pin: '',
        queueName: '',
        avgTime: '15'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            try {
                setupIndividual(
                    formData.name,
                    formData.phone,
                    formData.pin,
                    formData.queueName,
                    Number(formData.avgTime)
                );
                navigate('/manager/dashboard');
            } catch (err: any) {
                setError(err.message || 'Signup failed');
                setLoading(false);
            }
        }, 500);
    };

    const nextStep = () => {
        if (step === 1 && formData.name && formData.phone && formData.pin) {
            setStep(2);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
                    </Link>

                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>👤</span>
                        Individual Setup
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Perfect for solo practitioners & freelancers
                    </p>
                </div>

                {/* Progress Steps */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    justifyContent: 'center'
                }}>
                    {[1, 2].map(s => (
                        <div key={s} style={{
                            width: s === step ? '2rem' : '0.5rem',
                            height: '0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: s <= step ? 'var(--color-primary)' : 'rgba(148, 163, 184, 0.3)',
                            transition: 'all 0.3s ease'
                        }} />
                    ))}
                </div>

                {/* Form Card */}
                <div className="card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'var(--color-primary)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Step 1: Your Details
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Your Name</label>
                                    <input
                                        required
                                        placeholder="Dr. John Smith"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
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

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                >
                                    Continue →
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'var(--color-primary)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Step 2: Queue Setup
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Queue Name</label>
                                    <input
                                        required
                                        placeholder="e.g., Dr. Smith's Clinic"
                                        value={formData.queueName}
                                        onChange={e => setFormData({ ...formData, queueName: e.target.value })}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                                        This is what customers will see when joining
                                    </span>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Average Service Time (minutes)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="180"
                                        value={formData.avgTime}
                                        onChange={e => setFormData({ ...formData, avgTime: e.target.value })}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                                        Helps estimate wait times for customers
                                    </span>
                                </div>

                                {error && (
                                    <div style={{
                                        padding: '0.875rem',
                                        background: 'var(--color-danger-bg)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--color-danger)',
                                        fontSize: '0.875rem'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => setStep(1)}
                                        style={{ flex: 1 }}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                        style={{ flex: 2 }}
                                    >
                                        {loading ? 'Setting up...' : 'Start Managing ✨'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem'
                }}>
                    <p>Already have an account? <Link to="/login" style={{ fontWeight: 500 }}>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};
