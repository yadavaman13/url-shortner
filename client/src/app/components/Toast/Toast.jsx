import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useUrlContext } from '../../features/url/context/urlContext.jsx';
import './Toast.scss';

export const Toast = () => {
    const { toast } = useUrlContext();

    if (!toast) return null;

    const renderIcon = () => {
        if (toast.type === 'success') return <CheckCircle2 size={16} className="toast-icon" />;
        if (toast.type === 'error') return <AlertCircle size={16} className="toast-icon" />;
        return <Info size={16} className="toast-icon" />;
    };

    return (
        <div className="toast-container" aria-live="polite">
            <div className={`minimal-toast ${toast.type || 'info'}`}>
                {renderIcon()}
                <span className="toast-message">{toast.message}</span>
            </div>
        </div>
    );
};

export default Toast;
