import { useState, useCallback } from 'react';

/**
 * Custom hook to copy text to clipboard with timeout state feedback
 */
export function useClipboard(timeout = 2000) {
    const [copiedKey, setCopiedKey] = useState(null);

    const copyToClipboard = useCallback(
        async (text, key = 'default') => {
            if (!text) return false;
            try {
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    // Fallback for older browsers or restricted permissions
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
                setCopiedKey(key);
                setTimeout(() => {
                    setCopiedKey((curr) => (curr === key ? null : curr));
                }, timeout);
                return true;
            } catch (err) {
                console.error('Failed to copy to clipboard:', err);
                return false;
            }
        },
        [timeout],
    );

    const isCopied = useCallback((key = 'default') => copiedKey === key, [copiedKey]);

    return {
        copyToClipboard,
        copiedKey,
        isCopied,
    };
}

export default useClipboard;
