import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getOwnerDashboardData, getSuperManager, setSuperManagerSession } from '../../services/queueService';
import { useTheme } from '../../contexts/ThemeContext';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const sm = getSuperManager();
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refreshStats();
        const interval = setInterval(refreshStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const refreshStats = () => {
        const data = getOwnerDashboardData();
        setStats(data);
        setLoading(false);
    };

    const handleLogout = () => {
        setSuperManagerSession(null);
        navigate('/login');
    };

    if (!sm) {
        navigate('/login');
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                👥
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.125rem' }}>Admin Dashboard</h1>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    Welcome back, <strong style={{ color: 'var(--color-text)' }}>{sm.name}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button className="btn btn-ghost" onClick={handleLogout}>
                            Logout
                        </button>
                        <Link to="/admin/create-queue" className="btn btn-primary">
                            + Create Queue
                        </Link>
                    </div>
                </header>

                {/* Stats Summary */}
                {stats.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                {stats.length}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Active Queues</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-success)' }}>
                                {stats.reduce((acc, s) => acc + s.activeCount, 0)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Total Waiting</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                                {stats.reduce((acc, s) => acc + s.servedCount, 0)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Served Today</div>
                        </div>
                    </div>
                )}

                {/* Queues Section */}
                <div className="section">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Your Queues</h2>
                        <button onClick={refreshStats} className="btn btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            ↻ Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                            Loading...
                        </div>
                    ) : stats.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📋</div>
                            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>No Queues Yet</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                                Create your first queue and assign a manager to get started.
                            </p>
                            <Link to="/admin/create-queue" className="btn btn-primary">
                                Create First Queue
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                            {stats.map(s => (
                                <div key={s.queueId} className="card" style={{
                                    padding: '1.5rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Accent */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'var(--color-primary-gradient)'
                                    }} />

                                    <div style={{ marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.queueName}</h3>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                            Managed by <span style={{ color: 'var(--color-primary-hover)' }}>{s.assistantName}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            flex: 1,
                                            textAlign: 'center',
                                            padding: '0.75rem',
                                            background: 'var(--color-success-bg)',
                                            borderRadius: 'var(--radius-md)'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                                                {s.activeCount}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Waiting</div>
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            textAlign: 'center',
                                            padding: '0.75rem',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderRadius: 'var(--radius-md)'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#60a5fa' }}>
                                                {s.servedCount}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Served</div>
                                        </div>
                                    </div>

                                    <a
                                        href={`/q/${s.queueId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--color-text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}
                                    >
                                        Open Public Link ↗
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
