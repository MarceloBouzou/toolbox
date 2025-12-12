import { ShieldCheck } from 'lucide-react';

export function PrivacyBadge({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center gap-2 bg-green-100/80 text-black border border-green-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-full text-xs font-medium ${className}`}>
            <ShieldCheck size={14} className="shrink-0" />
            <span>🔒 Privacidad Total: El procesamiento se realiza 100% en tu navegador. Tus archivos NO se suben a ningún servidor.</span>
        </div>
    );
}
