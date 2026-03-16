export function Switch({ checked, onChange, label }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            aria-checked={checked}
            role="switch"
            aria-label={label}
            className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-brand' : ''}`}
            style={!checked ? { background: 'var(--input-bg)', border: '1px solid var(--border)' } : undefined}
        >
            <div
                className={`w-5 h-5 rounded-full absolute top-1 transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`}
                style={{ background: checked ? '#fff' : 'var(--text-muted)' }}
            />
        </button>
    );
}
