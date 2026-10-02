import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { UrlProvider } from './app/features/url/context/urlContext.jsx';
import {
    UrlForm,
    UrlResult,
    UrlStats,
    UrlList,
    QrModal,
} from './app/features/url/components/index.js';
import { Navbar, Toast, Footer } from './app/components/index.js';
import './App.scss';

function AppContent() {
    const [qrData, setQrData] = useState(null);

    const handleShowQr = (url, shortCode) => {
        setQrData({ url, shortCode });
    };

    const handleCloseQr = () => {
        setQrData(null);
    };

    return (
        <div className="app-container">
            <div className="app-bg-grid" aria-hidden="true" />
            <Navbar />

            <main className="main-content">
                <section className="hero-section">
                    <h1 className="hero-title">
                        A cleaner web with <span className="highlight">shorter links</span>.
                    </h1>
                    <p className="hero-description">
                        Instant 6-character links with collision-safe generation, real-time atomic visit
                        analytics, and custom aliases.
                    </p>
                </section>

                <UrlStats />

                <UrlForm />

                <UrlResult onShowQr={handleShowQr} />

                <UrlList onShowQr={handleShowQr} />
            </main>

            <Footer />

            <Toast />

            {qrData && (
                <QrModal
                    url={qrData.url}
                    shortCode={qrData.shortCode}
                    onClose={handleCloseQr}
                />
            )}
        </div>
    );
}

export function App() {
    return (
        <UrlProvider>
            <AppContent />
        </UrlProvider>
    );
}

export default App;
