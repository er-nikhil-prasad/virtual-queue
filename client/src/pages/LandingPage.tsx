import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>Virtual Queue</h1>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                No App Needed. Join queues and get notified instantly.
            </p>
            <div style={{ padding: '1rem', marginTop: '1rem', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', display: 'inline-block', color: 'var(--color-warning)' }}>
                ⚠️ Mock Mode: Data is saved to your browser's Local Storage.
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <Link to="/manager" className="btn btn-primary">Manager Login</Link>
                <Link to="/super-admin" className="btn" style={{ border: '1px solid var(--color-surface)' }}>
                    Business Owner
                </Link>
            </div>
        </div>
    );
};
