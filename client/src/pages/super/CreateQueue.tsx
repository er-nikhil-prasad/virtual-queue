import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/ui/BackButton';
import { setupBusiness } from '../../services/queueService';

export const CreateQueue = () => {
    const navigate = useNavigate();

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
                // But wait - if SM is self-managing, they might want to use their SM credentials?
                // For now, let's keep the Manager Signup flow for the Owner so they have a dedicated Manager Record.
                // We'll pass the SM's details via state? No, setupBusiness handled the linking.
                // We just need to redirect them.

                // Alert the user
                if (confirm('Queue Created! You are set as the manager. Do you want to set your Manager PIN now?')) {
                    navigate('/manager/signup', {
                        state: {
                            phone: result.queue.assignedManagerPhone, // Should match SM phone
                            isOwner: true
                        }
                    });
                } else {
                    navigate('/super-admin/dashboard');
                }

            } else {
                alert(`Queue "${qName}" Created!\n\nAssistant ${asstName} can login.\nPhone: ${asstPhone}\nPIN: ${asstPin}`);
                navigate('/super-admin/dashboard');
            }

        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <BackButton />
            <h1 style={{ marginBottom: '0.5rem' }}>Create New Queue</h1>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>

                {/* 1. Queue Details */}
                <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>1. Queue Configuration</h3>
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

                {/* 2. Management Mode */}
                <section style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>2. Who will manage this queue?</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
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
                                <input required type="password" maxLength={4} inputMode="numeric" value={asstPin} onChange={e => setAsstPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="4-digit PIN" style={{ width: '100%', padding: '0.5rem' }} />
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
