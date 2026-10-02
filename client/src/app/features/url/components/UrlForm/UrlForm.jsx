import { Link as LinkIcon, Sparkles, ChevronDown, Clock, Tag, ArrowRight, Loader2, Clipboard, X } from 'lucide-react';
import { useShortenForm } from '../../hooks/index.js';
import './UrlForm.scss';

export const UrlForm = () => {
    const {
        formData,
        formErrors,
        showAdvanced,
        setShowAdvanced,
        submitting,
        handleChange,
        handlePaste,
        handleSubmit,
        resetForm,
    } = useShortenForm();

    return (
        <div className="url-form-container">
            <div className="url-form-header">
                <h2 className="form-title">
                    Shorten a new link
                </h2>
                <p className="form-subtitle">
                    Enter any long URL to create a collision-resistant, tracked short link.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="url-form" noValidate>
                <div className={`input-group-main ${formErrors.url ? 'has-error' : ''}`}>
                    <span className="input-icon">
                        <LinkIcon size={18} />
                    </span>

                    <input
                        type="url"
                        className="main-url-input"
                        placeholder="https://example.com/very-long-article-url..."
                        value={formData.url}
                        onChange={(e) => handleChange('url', e.target.value)}
                        autoComplete="off"
                        spellCheck="false"
                        disabled={submitting}
                    />

                    <div className="input-actions">
                        {formData.url ? (
                            <button
                                type="button"
                                className="clear-btn"
                                onClick={() => handleChange('url', '')}
                                title="Clear URL"
                                aria-label="Clear input"
                            >
                                <X size={14} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="paste-btn"
                                onClick={handlePaste}
                                title="Paste from clipboard"
                            >
                                <Clipboard size={13} />
                                <span>Paste</span>
                            </button>
                        )}
                    </div>
                </div>

                {formErrors.url && <div className="field-error">{formErrors.url}</div>}

                <div className="advanced-toggle-bar">
                    <button
                        type="button"
                        className={`advanced-toggle-btn ${showAdvanced ? 'is-active' : ''}`}
                        onClick={() => setShowAdvanced((prev) => !prev)}
                    >
                        <span>Custom alias & expiration</span>
                        <ChevronDown size={14} />
                    </button>
                </div>

                {showAdvanced && (
                    <div className="advanced-section">
                        <div className="advanced-field">
                            <label htmlFor="custom-alias-input">
                                <Tag size={13} /> Custom Alias (optional)
                            </label>
                            <div className="advanced-input-wrapper">
                                <span className="prefix-label">/</span>
                                <input
                                    id="custom-alias-input"
                                    type="text"
                                    placeholder="my-custom-slug"
                                    value={formData.alias}
                                    onChange={(e) => handleChange('alias', e.target.value)}
                                    maxLength={20}
                                    disabled={submitting}
                                />
                            </div>
                            {formErrors.alias && (
                                <div className="field-error">{formErrors.alias}</div>
                            )}
                        </div>

                        <div className="advanced-field">
                            <label htmlFor="expiry-input">
                                <Clock size={13} /> Expiration (optional)
                            </label>
                            <div className="advanced-input-wrapper">
                                <select
                                    id="expiry-input"
                                    value={formData.expiresIn}
                                    onChange={(e) => handleChange('expiresIn', e.target.value)}
                                    disabled={submitting}
                                >
                                    <option value="">Never expire (Permanent)</option>
                                    <option value="1">1 hour</option>
                                    <option value="24">24 hours (1 day)</option>
                                    <option value="168">7 days (1 week)</option>
                                    <option value="720">30 days (1 month)</option>
                                </select>
                            </div>
                            {formErrors.expiresIn && (
                                <div className="field-error">{formErrors.expiresIn}</div>
                            )}
                        </div>
                    </div>
                )}

                <button type="submit" className="submit-btn" disabled={submitting || !formData.url.trim()}>
                    {submitting ? (
                        <>
                            <Loader2 size={16} className="spinner" />
                            <span>Generating Short Link...</span>
                        </>
                    ) : (
                        <>
                            <span>Shorten Link</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default UrlForm;
