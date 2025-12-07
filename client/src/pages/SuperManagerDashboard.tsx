import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/ui/BackButton';
import { setupBusiness, getOwnerDashboardData } from '../services/queueService';

export const SuperManagerDashboard = () => {
    const navigate = useNavigate();

    // Form State
    const [ownerName, setOwnerName] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');

    const [qName, setQName] = useState('');
    const [avgTime, setAvgTime] = useState(10);

    const [manageMode, setManageMode] = useState<'self' | 'assistant'>('self');
    const [asstName, setAsstName] = useState('');
    const [asstPhone, setAsstPhone] = useState('');
    const [asstPin, setAsstPin] = useState('');

    // Analytics State
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        // Initial Fetch
        refreshStats();

        // Polling every 5 sec
        const interval = setInterval(refreshStats, 5000);
        return () => clearInterval(interval);
    }, [ownerPhone]); // specific trigger? mostly just mount.

    const refreshStats = () => {
        // In a real app we'd pass the actual logged-in owner's phone.
        // For this mock, the service implementation returns ALL queues, which works for the single-tenant mock.
        const data = getOwnerDashboardData();
        setStats(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = setupBusiness(
                { name: ownerName, phone: ownerPhone },
                { name: qName, avgTime },
                {
                    mode: manageMode,
                    name: asstName,
                    phone: asstPhone,
                    pin: asstPin
                }
            );

            refreshStats(); // Update list immediately

            if (result.isOwner) {
                // Determine if we need to set PIN (Signup) or just Login
                // For simplicity, we send to Signup which handles "Activate/Update"
                navigate('/manager/signup', {
                    state: {
                        name: ownerName,
                        phone: ownerPhone,
                        isOwner: true
                    }
                });
            } else {
                alert(`Queue "${qName}" Created!\n\nAssistant ${asstName} can login.\nPhone: ${asstPhone}\nPIN: ${asstPin}`);
                // Clear Assistant fields for next entry
                setAsstName('');
                setAsstPhone('');
                setAsstPin('');
                setQName('');
            }

        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
            <BackButton />
            <h1 style={{ marginBottom: '0.5rem' }}>Setup your Virtual Queue</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Get your business queue up and running in seconds.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* LEFT: Combined Setup Form */}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', height: 'fit-content' }}>

                    {/* 1. Business Owner */}
                    <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>1. Business Details</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Owner Name</label>
                                <input
                                    required
                                    value={ownerName}
                                    onChange={e => setOwnerName(e.target.value)}
                                    placeholder="e.g. Dr. John Doe"
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Owner Phone</label>
                                <input
                                    required
                                    value={ownerPhone}
                                    onChange={e => setOwnerPhone(e.target.value)}
                                    placeholder="Your mobile number"
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 2. Queue Details */}
                    <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>2. Queue Configuration</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Queue Name</label>
                                <input
                                    required
                                    value={qName}
                                    onChange={e => setQName(e.target.value)}
                                    placeholder="e.g. Clinic Room 1"
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Average Service Time (mins)</label>
                                <input
                                    type="number"
                                    required
                                    value={avgTime}
                                    onChange={e => setAvgTime(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 3. Management Mode */}
                    <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>3. Who will manage this?</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={manageMode === 'self'}
                                    onChange={() => setManageMode('self')}
                                />
                                I will manage it (Owner)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={manageMode === 'assistant'}
                                    onChange={() => setManageMode('assistant')}
                                />
                                Assign an Assistant
                            </label>
                        </div>

                        {manageMode === 'assistant' && (
                            <div style={{ display: 'grid', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input required value={asstName} onChange={e => setAsstName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input required value={asstPhone} onChange={e => setAsstPhone(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div className="form-group">
                                    <label>PIN (4 digits)</label>
                                    <input required type="password" maxLength={4} inputMode="numeric" value={asstPin} onChange={e => setAsstPin(e.target.value.replace(/\D/g, '').slice(0, 4))} style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                            </div>
                        )}
                    </section>

                    <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                        Create Queue
                    </button>
                </form>

                {/* RIGHT: Live Operations Table */}
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Live Operations</h3>
                        <button onClick={refreshStats} className="btn" style={{ fontSize: '0.8rem', border: '1px solid var(--color-text-muted)' }}>Refresh</button>
                    </div>

                    {stats.length === 0 ? (
                        <p className="text-muted">No queues active.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {stats.map(s => (
                                <div key={s.queueId} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-primary)' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{s.queueName}</div>
                                    <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        Assigned to: {s.assistantName}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                            color: '#34d399',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}>
                                            ● {s.activeCount} Waiting
                                        </span>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                            color: '#60a5fa',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}>
                                            ✓ {s.servedCount} Served
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <a href={`/q/${s.queueId}`} target="_blank" style={{ fontSize: '0.8rem', textDecoration: 'underline', color: 'var(--color-text-muted)' }}>Open Public View ↗</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
