import { X, Copy, Check, Download } from 'lucide-react';
import { useClipboard } from '../../hooks/index.js';
import './QrModal.scss';

export const QrModal = ({ url, shortCode, onClose }) => {
    const { copyToClipboard, isCopied } = useClipboard();

    if (!url) return null;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        url,
    )}&format=svg&color=000000&bgcolor=ffffff`;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = `qr-${shortCode || 'shortly'}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="qr-modal-backdrop" onClick={onClose}>
            <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="modal-close-btn"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                <div className="qr-header">
                    <h3 className="qr-title">Scan QR Code</h3>
                    <p className="qr-subtitle">/{shortCode}</p>
                </div>

                <div className="qr-code-frame">
                    <img src={qrUrl} alt={`QR Code for ${url}`} />
                </div>

                <div className="qr-url-display" title={url}>
                    {url}
                </div>

                <div className="qr-actions">
                    <button
                        type="button"
                        className="qr-btn primary"
                        onClick={() => copyToClipboard(url, 'modal-copy')}
                    >
                        {isCopied('modal-copy') ? (
                            <>
                                <Check size={14} />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={14} />
                                <span>Copy Link</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="qr-btn secondary"
                        onClick={handleDownload}
                        title="Download SVG QR"
                    >
                        <Download size={14} />
                        <span>Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QrModal;
