import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/ui/BackButton';
import { setupBusiness } from '../services/queueService';

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
                // Reset or Redirect? Maybe redirect to Landing for now or clear form
                window.location.href = '/';
            }

        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <BackButton />
            <h1 style={{ marginBottom: '0.5rem' }}>Setup your Virtual Queue</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Get your business queue up and running in seconds.</p>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>

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
                                style={{ width: '100%', padding: '0.75rem' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Owner Phone</label>
                            <input
                                required
                                value={ownerPhone}
                                onChange={e => setOwnerPhone(e.target.value)}
                                placeholder="Your mobile number"
                                style={{ width: '100%', padding: '0.75rem' }}
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
                                style={{ width: '100%', padding: '0.75rem' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Average Service Time (mins)</label>
                            <input
                                type="number"
                                required
                                value={avgTime}
                                onChange={e => setAvgTime(Number(e.target.value))}
                                style={{ width: '100%', padding: '0.75rem' }}
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Management Mode */}
                <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>3. Who will manage this queue?</h3>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
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
                                <label>Assistant Name</label>
                                <input required value={asstName} onChange={e => setAsstName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                            </div>
                            <div className="form-group">
                                <label>Assistant Phone</label>
                                <input required value={asstPhone} onChange={e => setAsstPhone(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                            </div>
                            <div className="form-group">
                                <label>Create PIN</label>
                                <input required type="password" maxLength={4} value={asstPin} onChange={e => setAsstPin(e.target.value)} placeholder="4-digit PIN" style={{ width: '100%', padding: '0.5rem' }} />
                            </div>
                        </div>
                    )}
                </section>

                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                    Create Queue & Start
                </button>
            </form>
        </div>
    );
};
