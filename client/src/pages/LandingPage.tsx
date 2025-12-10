import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
        }}>
            {/* Hero Section */}
            <div style={{ maxWidth: '600px', marginBottom: '3rem' }}>
                {/* Logo / Brand */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)'
                }}>
                    <span style={{ fontSize: '2rem' }}>⏳</span>
                </div>

                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Virtual Queue
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: '1.8',
                    marginBottom: '1.5rem'
                }}>
                    No app downloads. No waiting in line.<br />
                    <span style={{ color: 'var(--color-primary-hover)' }}>Join queues and get notified instantly.</span>
                </p>

                {/* Mock Mode Banner */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--color-warning)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    <span>⚠️</span>
                    Demo Mode: Data stored in browser
                </div>
            </div>

            {/* CTA Buttons */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'center',
                width: '100%',
                maxWidth: '400px'
            }}>
                {/* Primary Actions */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    width: '100%'
                }}>
                    <Link
                        to="/signup/individual"
                        className="btn btn-primary"
                        style={{
                            padding: '1.25rem 1.5rem',
                            fontSize: '1rem',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>👤</span>
                        <span>For Individuals</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400 }}>Solo practitioners</span>
                    </Link>

                    <Link
                        to="/signup/team"
                        className="btn btn-secondary"
                        style={{
                            padding: '1.25rem 1.5rem',
                            fontSize: '1rem',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>👥</span>
                        <span>For Teams</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400 }}>Businesses & clinics</span>
                    </Link>
                </div>

                {/* Divider */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'var(--color-text-subtle)'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3))' }} />
                    <span style={{ fontSize: '0.875rem' }}>Already have an account?</span>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(148, 163, 184, 0.3), transparent)' }} />
                </div>

                {/* Login Link */}
                <Link
                    to="/login"
                    className="btn btn-ghost"
                    style={{ width: '100%', maxWidth: '200px' }}
                >
                    Sign In →
                </Link>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '4rem',
                color: 'var(--color-text-subtle)',
                fontSize: '0.875rem'
            }}>
                Built with simplicity in mind ✨
            </div>
        </div>
    );
};
