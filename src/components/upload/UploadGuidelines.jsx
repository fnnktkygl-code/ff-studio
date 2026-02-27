export function UploadGuidelines() {
    return (
        <div className="mt-8 mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
                <SparklesIcon className="w-4 h-4 text-brand" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest theme-text-muted">
                    Photo Guidelines
                </h3>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">

                {/* Tip 1 */}
                <div className="shrink-0 w-36 p-3 rounded-2xl border theme-card theme-border shadow-sm flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <LayoutIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold theme-text">Lay it flat</p>
                    <p className="text-[10px] theme-text-sec leading-snug">
                        Use a clean, flat surface or a ghost mannequin for the best shape.
                    </p>
                </div>

                {/* Tip 2 */}
                <div className="shrink-0 w-36 p-3 rounded-2xl border theme-card theme-border shadow-sm flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <SunIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold theme-text">Good lighting</p>
                    <p className="text-[10px] theme-text-sec leading-snug">
                        Ensure bright, even lighting to capture true colors and details.
                    </p>
                </div>

                {/* Tip 3 */}
                <div className="shrink-0 w-36 p-3 rounded-2xl border theme-card theme-border shadow-sm flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold theme-text">Clear background</p>
                    <p className="text-[10px] theme-text-sec leading-snug">
                        Use a solid, contrasting background without any clutter.
                    </p>
                </div>

                {/* Tip 4 */}
                <div className="shrink-0 w-36 p-3 rounded-2xl border theme-card theme-border shadow-sm flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <DropletsIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold theme-text">Smooth wrinkles</p>
                    <p className="text-[10px] theme-text-sec leading-snug">
                        Iron or steam the garment for a flawless, professional finish.
                    </p>
                </div>

            </div>
        </div>
    )
}

function SparklesIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
    )
}

function LayoutIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
        </svg>
    )
}

function SunIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
        </svg>
    )
}

function CheckCircleIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}

function DropletsIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7 6.3 7 6.3s-2.29 2.76-3.29 3.76C2.57 11 2 12.1 2 13.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
        </svg>
    )
}
