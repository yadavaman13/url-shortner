import { useMemo, useState } from 'react';
import { useUrlContext } from '../context/urlContext.jsx';

/**
 * Custom hook to interact with URL collection, computed statistics, and search filtering
 */
export function useUrls() {
    const {
        urls,
        loading,
        submitting,
        deletingId,
        error,
        clearError,
        fetchUrls,
        shortenUrl,
        removeUrl,
        currentUrl,
        clearCurrentUrl,
    } = useUrlContext();

    const [searchQuery, setSearchQuery] = useState('');

    // Computed statistics
    const stats = useMemo(() => {
        const totalUrls = urls.length;
        const totalClicks = urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
        const topUrl = urls.length
            ? [...urls].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
            : null;

        return {
            totalUrls,
            totalClicks,
            topUrl,
        };
    }, [urls]);

    // Filtered URLs based on search query
    const filteredUrls = useMemo(() => {
        if (!searchQuery.trim()) return urls;
        const query = searchQuery.toLowerCase().trim();
        return urls.filter(
            (u) =>
                u.shortUrl?.toLowerCase().includes(query) ||
                u.originalUrl?.toLowerCase().includes(query),
        );
    }, [urls, searchQuery]);

    return {
        urls: filteredUrls,
        allUrls: urls,
        stats,
        searchQuery,
        setSearchQuery,
        loading,
        submitting,
        deletingId,
        error,
        clearError,
        fetchUrls,
        shortenUrl,
        removeUrl,
        currentUrl,
        clearCurrentUrl,
    };
}

export default useUrls;
