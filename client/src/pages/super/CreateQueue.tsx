import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setupBusiness } from '../../services/queueService';

export const CreateQueue = () => {
    const navigate = useNavigate();

    const [qName, setQName] = useState('');
    const [avgTime, setAvgTime] = useState(10);
    const [asstName, setAsstName] = useState('');
    const [asstPhone, setAsstPhone] = useState('');
    const [asstPin, setAsstPin] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setupBusiness(
                { name: qName, avgTime },
                {
                    mode: 'assistant',
                    name: asstName,
                    phone: asstPhone,
                    pin: asstPin
                }
            );

            alert(`Queue "${qName}" Created!\n\nManager: ${asstName}\nPhone: ${asstPhone}\nPIN: ${asstPin}`);
            navigate('/admin/dashboard');

        } catch (err: any) {
            alert(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Back Button */}
                <Link
                    to="/admin/dashboard"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    ← Back to Dashboard
                </Link>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create New Queue</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Set up a queue and assign a manager to handle it.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Queue Configuration */}
                    <div className="section">
                        <div className="section-title">Queue Details</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Queue Name</label>
                                <input
                                    required
                                    value={qName}
                                    onChange={e => setQName(e.target.value)}
                                    placeholder="e.g., Clinic Room 1, Counter A"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Average Service Time (minutes)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="180"
                                    value={avgTime}
                                    onChange={e => setAvgTime(Number(e.target.value))}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                                    Used to estimate wait times for customers
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Manager Assignment */}
                    <div className="section">
                        <div className="section-title">Assign Manager</div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            This person will manage the queue day-to-day.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Manager Name</label>
                                <input
                                    required
                                    value={asstName}
                                    onChange={e => setAsstName(e.target.value)}
                                    placeholder="Staff member's name"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Manager Phone</label>
                                <input
                                    required
                                    type="tel"
                                    value={asstPhone}
                                    onChange={e => setAsstPhone(e.target.value)}
                                    placeholder="Mobile number for login"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Create PIN</label>
                                <input
                                    required
                                    type="password"
                                    maxLength={6}
                                    inputMode="numeric"
                                    value={asstPin}
                                    onChange={e => setAsstPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="4-6 digit PIN"
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                                    They will use this to log into the Manager Dashboard
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ padding: '1rem', fontSize: '1rem' }}
                    >
                        {loading ? 'Creating...' : 'Create Queue →'}
                    </button>
                </form>
            </div>
        </div>
    );
};
