import React from 'react';

/**
 * A reusable, theme-aware toggle switch.
 * 
 * Props:
 * - checked: boolean state
 * - onChange: function to call on toggle
 * - label: optional label for accessibility
 */
export function Switch({ checked, onChange, label }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            aria-checked={checked}
            role="switch"
            aria-label={label}
            className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${checked
                    ? 'bg-gradient-to-r from-brand-dark to-brand'
                    : 'theme-input-bg border theme-border'
                }`}
            style={{
                // Fallback for non-tailwind theme vars if needed, but classes should handle mostly
                transitionDuration: '250ms'
            }}
        >
            <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}
