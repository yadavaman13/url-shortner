import { Link2, MousePointerClick, TrendingUp } from 'lucide-react';
import { useUrls } from '../../hooks/index.js';
import './UrlStats.scss';

export const UrlStats = () => {
    const { stats, loading } = useUrls();

    return (
        <div className="url-stats-grid">
            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Total Links</span>
                    <span className="stat-icon">
                        <Link2 size={16} />
                    </span>
                </div>
                <div className="stat-value">{loading ? '-' : stats.totalUrls}</div>
                <div className="stat-subtext">Active shortened redirects</div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Total Clicks</span>
                    <span className="stat-icon">
                        <MousePointerClick size={16} />
                    </span>
                </div>
                <div className="stat-value">{loading ? '-' : stats.totalClicks}</div>
                <div className="stat-subtext">Atomic visit increments</div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Top Performer</span>
                    <span className="stat-icon">
                        <TrendingUp size={16} />
                    </span>
                </div>
                <div className="stat-value">
                    {stats.topUrl ? `${stats.topUrl.clicks || 0}` : '0'}
                </div>
                <div className="stat-subtext">
                    {stats.topUrl
                        ? `/${stats.topUrl.shortUrl} (${stats.topUrl.clicks || 0} clicks)`
                        : 'No activity yet'}
                </div>
            </div>
        </div>
    );
};

export default UrlStats;
