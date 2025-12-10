import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../mockDb';

export const QueueView = () => {
    const { queueId } = useParams();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('u');

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        const allQueues = db.getQueues();
        const queue = allQueues.find((q: any) => q.id === queueId);

        if (!queue) {
            setData(null);
            setLoading(false);
            return;
        }

        const allUsers = db.getUsers();
        let userStatus = null;

        if (userId) {
            const user = allUsers.find((u: any) => u.id === userId);
            if (user) {
                const ahead = allUsers.filter((u: any) =>
                    u.queueId === queueId &&
                    u.status === 'waiting' &&
                    u.position < user.position
                ).length;

                userStatus = {
                    ...user,
                    peopleAhead: ahead,
                    estimatedWaitTime: ahead * queue.avgServiceTime
                };
            }
        }

        const totalWaiting = allUsers.filter((u: any) => u.queueId === queueId && u.status === 'waiting').length;

        setData({
            queue,
            user: userStatus,
            totalWaiting
        });
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [queueId, userId]);

    if (loading && !data) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    Loading...
                </div>
            </div>
        );
    }

    if (!data || !data.queue) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Queue Not Found</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        This queue doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        );
    }

    const { queue, user, totalWaiting } = data;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '450px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: '1.25rem',
                        marginBottom: '1rem',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
                    }}>
                        <span style={{ fontSize: '1.75rem' }}>📋</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{queue.name}</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Virtual Queue</p>
                </div>

                {user ? (
                    // User-specific view
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Position Card */}
                        <div className="card" style={{
                            textAlign: 'center',
                            padding: '2.5rem 2rem',
                            background: user.status === 'served'
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)'
                                : 'var(--color-surface)',
                            border: user.status === 'served'
                                ? '2px solid var(--color-success)'
                                : '2px solid var(--color-primary)'
                        }}>
                            {user.status === 'served' ? (
                                <>
                                    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>✅</div>
                                    <h2 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>You're Done!</h2>
                                    <p style={{ color: 'var(--color-text-muted)' }}>Thank you for visiting.</p>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Your Position
                                    </div>
                                    <div style={{
                                        fontSize: '5rem',
                                        fontWeight: '800',
                                        lineHeight: '1',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        {user.peopleAhead + 1}
                                    </div>
                                    <div style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                        {user.peopleAhead === 0 ? "You're next!" : `${user.peopleAhead} ${user.peopleAhead === 1 ? 'person' : 'people'} ahead`}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Wait Time */}
                        {user.status === 'waiting' && user.peopleAhead > 0 && (
                            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ fontSize: '1.5rem' }}>⏱️</div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Est. Wait</div>
                                        <div style={{ fontWeight: '600' }}>~{user.estimatedWaitTime} mins</div>
                                    </div>
                                </div>
                                <span className="badge badge-primary" style={{ animation: 'pulse 2s infinite' }}>
                                    <span className="status-dot active" />
                                    Live
                                </span>
                            </div>
                        )}

                        {/* Next Up Alert */}
                        {user.status === 'waiting' && user.peopleAhead === 0 && (
                            <div style={{
                                padding: '1.25rem',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                borderRadius: 'var(--radius-lg)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
                                <div style={{ fontWeight: '600', color: 'var(--color-success)' }}>Get Ready!</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>You're next in line</p>
                            </div>
                        )}

                        {/* Premium Upsell */}
                        {user.status === 'waiting' && user.peopleAhead > 2 && (
                            <div className="card" style={{
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
                                border: '1px dashed rgba(245, 158, 11, 0.5)'
                            }}>
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>📱</span>
                                </div>
                                <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.25rem' }}>Get SMS Alerts</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                    We'll notify you when it's almost your turn
                                </p>
                                <button
                                    className="btn"
                                    style={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        color: 'white',
                                        width: '100%'
                                    }}
                                    onClick={() => alert('Mock Payment: Success!')}
                                >
                                    Pay ₹10 for Alerts
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Public View
                    <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Currently Waiting
                        </div>
                        <div style={{
                            fontSize: '5rem',
                            fontWeight: '800',
                            lineHeight: '1',
                            marginBottom: '0.5rem',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {totalWaiting}
                        </div>
                        <div style={{ color: 'var(--color-text-muted)' }}>
                            {totalWaiting === 1 ? 'person' : 'people'} in queue
                        </div>

                        <div className="divider" />

                        <div style={{
                            padding: '1rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.9rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            💡 Visit the front desk to join this queue
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    color: 'var(--color-text-subtle)',
                    fontSize: '0.8rem'
                }}>
                    Powered by Virtual Queue
                </div>
            </div>
        </div>
    );
};
