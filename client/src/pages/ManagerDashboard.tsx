import { useState, useEffect } from 'react';
import { db } from '../mockDb';
import { getManagerQueue } from '../services/queueService';

export const ManagerDashboard = () => {
    const [manager, setManager] = useState<any>(null);
    const [queueData, setQueueData] = useState<any>(null); // { queue, users: [] }
    const [loading, setLoading] = useState(true);

    const [newUser, setNewUser] = useState({ name: '', phone: '' });

    // 1. Load Manager and Auto-Fetch Queue
    useEffect(() => {
        const m = db.getManager(); // In mockDb, this returns last logged in manager
        if (m) {
            setManager(m);
            const assignedQueue = getManagerQueue(m.phone);

            if (assignedQueue) {
                loadQueueDetails(assignedQueue.id);
            } else {
                setLoading(false);
            }
        } else {
            // Should redirect to login, handled by App protection generally, but here for safety
            window.location.href = '/manager/login';
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

        console.log(`[MOCK SMS]To: ${user.phone} -> Join Link: http://localhost:5173/q/${targetQueueId}?u=${user.id}`);
        alert(`User Added! \n\nMock SMS Link:\nhttp://localhost:5173/q/${targetQueueId}?u=${user.id}`);

        setNewUser({ name: '', phone: '' });
        loadQueueDetails(targetQueueId);
    };

    const updateStatus = (userId: string, status: string) => {
        if (!queueData) return;
        const targetQueueId = queueData.queue.id; // access current queue ID

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

    if (!manager) return <div>Loading...</div>;

    if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Loading Queue Data...</div>;

    if (!queueData) {
        return (
            <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <h1>Hello, {manager.name}</h1>
                <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-lg)', color: 'var(--color-warning)' }}>
                    <h3>No Active Queue Assigned</h3>
                    <p>This phone number ({manager.phone}) is not linked to any active queue.</p>
                    <p>Please contact the Business Owner / Super Manager.</p>
                </div>
                <button className="btn" style={{ marginTop: '1rem', border: '1px solid white' }} onClick={() => { db.setManager(null); window.location.reload(); }}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>{manager.name}</h1>
                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>{manager.phone}</div>
                </div>
                <div>
                    Queue: <strong>{queueData.queue.name}</strong>
                    <button className="btn" style={{ marginLeft: '1rem', fontSize: '0.8rem', border: '1px solid var(--color-text-muted)', color: 'var(--color-text)' }} onClick={() => { db.setManager(null); window.location.href = '/manager/login'; }}>Logout</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Add User */}
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
                    <h3>Add User to Queue</h3>
                    <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <input placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required style={{ padding: '0.5rem' }} />
                        <input placeholder="Phone" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} required style={{ padding: '0.5rem' }} />
                        <button type="submit" className="btn btn-primary">Add to Queue</button>
                    </form>
                </div>

                {/* Queue List */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Queue ({queueData?.users.length || 0})</h3>
                        <button className="btn" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', border: '1px solid var(--color-surface)' }} onClick={() => loadQueueDetails(queueData.queue.id)}>Refresh</button>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {queueData?.users.map((user: any) => (
                            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {user.position}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.phone}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn" style={{ backgroundColor: 'var(--color-warning)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => updateStatus(user.id, 'pushed_down')}>
                                        Push Down
                                    </button>
                                    <button className="btn" style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => updateStatus(user.id, 'served')}>
                                        Served
                                    </button>
                                </div>
                            </div>
                        ))}
                        {queueData?.users.length === 0 && <p className="text-muted">Queue is empty.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};
