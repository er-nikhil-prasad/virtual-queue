import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerDashboardData, getSuperManager, setSuperManagerSession } from '../../services/queueService';

export const SuperDashboard = () => {
    const navigate = useNavigate();
    const sm = getSuperManager();
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        refreshStats();
        const interval = setInterval(refreshStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const refreshStats = () => {
        const data = getOwnerDashboardData();
        setStats(data);
    };

    const handleLogout = () => {
        setSuperManagerSession(null);
        navigate('/super-admin/login');
    };

    if (!sm) return null;

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>{sm.name}</h1>
                    <div className="text-muted">Business Dashboard</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ border: '1px solid var(--color-surface)' }} onClick={handleLogout}>Logout</button>
                    <button className="btn btn-primary" onClick={() => navigate('/super-admin/create-queue')}>+ Create Queue</button>
                </div>
            </header>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Live Operations</h3>
                    <button onClick={refreshStats} className="btn" style={{ fontSize: '0.8rem', border: '1px solid var(--color-text-muted)', color: 'var(--color-text)' }}>Refresh</button>
                </div>

                {stats.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        <p>No queues found.</p>
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/super-admin/create-queue')}>Create your first Queue</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {stats.map(s => (
                            <div key={s.queueId} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{s.queueName}</div>
                                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                            Assigned to: {s.assistantName}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
    );
};
