import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="btn"
            style={{
                padding: '0.5rem',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginBottom: '1rem',
                fontSize: '0.9rem'
            }}
        >
            <ChevronLeft size={20} />
            Back
        </button>
    );
};
