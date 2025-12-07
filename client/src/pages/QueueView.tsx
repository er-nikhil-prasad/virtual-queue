import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../mockDb';

export const QueueView = () => {
    const { queueId } = useParams();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('u');

    const [data, setData] = useState<any>(null); // { queue, user, totalWaiting }
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
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
                // Count people ahead
                const ahead = allUsers.filter((u: any) =>
                    u.queueId === queueId &&
                    u.status === 'waiting' &&
                    u.position < user.position // Very simple logic
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
        const interval = setInterval(fetchData, 2000); // Polling more frequent for local mock
        return () => clearInterval(interval);
    }, [queueId, userId]);

    if (loading && !data) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
    if (!data || !data.queue) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Queue not found.</div>;

    const { queue, user, totalWaiting } = data;

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>{queue.name}</h1>
                <p className="text-muted">Queue ID: {queue.id}</p>
            </div>

            {user ? (
                // User specific view
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '2px solid var(--color-primary)' }}>
                        <div style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>You are number</div>
                        <div style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.2' }}>{user.status === 'served' ? 'DONE' : user.peopleAhead + 1}</div>
                        <div style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>in line</div>
                        {user.status === 'served' && <div style={{ color: 'var(--color-success)', fontWeight: 'bold', marginTop: '1rem' }}>You have been served!</div>}
                        {user.status === 'pushed_down' && <div style={{ color: 'var(--color-warning)', fontWeight: 'bold', marginTop: '1rem' }}>You were pushed down.</div>}
                    </div>

                    {user.status === 'waiting' && (
                        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Estimated Wait Time</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>~{user.estimatedWaitTime} mins</div>
                        </div>
                    )}

                    {/* Premium Upsell */}
                    {user.status === 'waiting' && (
                        <div style={{ padding: '1.5rem', border: '1px dashed var(--color-warning)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--color-warning)' }}>Don't wait in the dark!</h3>
                            <button className="btn" style={{ backgroundColor: 'var(--color-warning)', color: 'black', width: '100%', marginTop: '1rem' }} onClick={() => alert('Mock Payment: Success!')}>
                                Pay ₹10 for SMS Alerts
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                // Public View
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                    <h2>Current Queue Status</h2>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '2rem 0' }}>{totalWaiting}</div>
                    <p className="text-muted">People waiting in line</p>
                    <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                        Please visit the front desk to get added to the queue.
                    </div>
                </div>
            )}
        </div>
    );
};
