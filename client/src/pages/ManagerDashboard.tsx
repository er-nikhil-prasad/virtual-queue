import { useState, useEffect } from 'react';
import { db } from '../mockDb';
import { getManagerQueue } from '../services/queueService';
import { useTheme } from '../contexts/ThemeContext';

export const ManagerDashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const [manager, setManager] = useState<any>(null);
    const [queueData, setQueueData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ name: '', phone: '' });

    useEffect(() => {
        const m = db.getManager();
        if (m) {
            setManager(m);
            const assignedQueue = getManagerQueue(m.phone);
            if (assignedQueue) {
                loadQueueDetails(assignedQueue.id);
            } else {
                setLoading(false);
            }
        } else {
            window.location.href = '/login';
        }
    }, []);

    const loadQueueDetails = (qId: string) => {
        const allQueues = db.getQueues();
        const queue = allQueues.find((q: any) => q.id === qId);
        if (queue) {
            const allUsers = db.getUsers();
            const qUsers = allUsers
                .filter((u: any) => u.queueId === qId && u.status === 'waiting')
                .sort((a: any, b: any) => a.position - b.position);
            setQueueData({ queue, users: qUsers });
        }
        setLoading(false);
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!queueData) return;

        const targetQueueId = queueData.queue.id;
        const allUsers = db.getUsers();
        const qUsers = allUsers.filter((u: any) => u.queueId === targetQueueId && u.status === 'waiting');
        const lastPos = qUsers.length > 0 ? Math.max(...qUsers.map((u: any) => u.position)) : 0;

        const user = {
            id: 'u-' + Math.random().toString(36).substr(2, 9),
            name: newUser.name,
            phone: newUser.phone,
            queueId: targetQueueId,
            position: lastPos + 1,
            status: 'waiting',
            joinedAt: new Date().toISOString(),
            plan: 'none'
        };

        db.addUser(user);
        alert(`User Added!\n\nQueue Link:\n${window.location.origin}/q/${targetQueueId}?u=${user.id}`);
        setNewUser({ name: '', phone: '' });
        loadQueueDetails(targetQueueId);
    };

    const updateStatus = (userId: string, status: string) => {
        if (!queueData) return;
        const targetQueueId = queueData.queue.id;

        if (status === 'pushed_down') {
            const allUsers = db.getUsers();
            const qUsers = allUsers.filter((u: any) => u.queueId === targetQueueId && u.status === 'waiting');
            const maxPos = qUsers.length > 0 ? Math.max(...qUsers.map((u: any) => u.position)) : 0;
            db.updateUser(userId, { position: maxPos + 1 });
        } else {
            db.updateUser(userId, { status });
        }
        loadQueueDetails(targetQueueId);
    };

    const handleLogout = () => {
        db.setManager(null);
        window.location.href = '/login';
    };

    if (!manager) return null;

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    Loading...
                </div>
            </div>
        );
    }

    if (!queueData) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🚫</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>No Queue Assigned</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Your account ({manager.phone}) is not linked to any active queue. Please contact your admin.
                    </p>
                    <button className="btn btn-ghost" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            color: 'white'
                        }}>
                            📋
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.125rem' }}>{queueData.queue.name}</h1>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                Managed by <strong style={{ color: 'var(--color-text)' }}>{manager.name}</strong>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className="badge badge-success">
                            <span className="status-dot active" />
                            Live
                        </span>
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
                    </div>
                </header>

                {/* Main Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>

                    {/* Add User Card */}
                    <div className="section" style={{ height: 'fit-content' }}>
                        <div className="section-title">Add to Queue</div>

                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Customer Name</label>
                                <input
                                    placeholder="Enter name"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="For notifications"
                                    value={newUser.phone}
                                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                + Add Customer
                            </button>
                        </form>
                    </div>

                    {/* Queue List */}
                    <div className="section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div className="section-title" style={{ margin: 0 }}>
                                Queue ({queueData.users.length})
                            </div>
                            <button
                                className="btn btn-ghost"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                onClick={() => loadQueueDetails(queueData.queue.id)}
                            >
                                ↻ Refresh
                            </button>
                        </div>

                        {queueData.users.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎉</div>
                                <p>Queue is empty! Add customers to get started.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {queueData.users.map((user: any, index: number) => (
                                    <div
                                        key={user.id}
                                        className="card"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem 1.25rem',
                                            background: index === 0
                                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)'
                                                : 'var(--color-surface)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: 'var(--radius-full)',
                                                background: index === 0
                                                    ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                                                    : 'var(--color-primary-gradient)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '700',
                                                fontSize: '1.1rem'
                                            }}>
                                                {user.position}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', marginBottom: '0.125rem' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.phone}</div>
                                            </div>
                                            {index === 0 && (
                                                <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
                                                    Now Serving
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-warning"
                                                style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}
                                                onClick={() => updateStatus(user.id, 'pushed_down')}
                                            >
                                                ↓ Push
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}
                                                onClick={() => updateStatus(user.id, 'served')}
                                            >
                                                ✓ Served
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
