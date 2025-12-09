import { ShieldCheck } from 'lucide-react';

export function PrivacyBadge({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center gap-2 bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 rounded-full border border-green-200/50 dark:border-green-800/50 text-xs font-medium ${className}`}>
            <ShieldCheck size={14} className="shrink-0" />
            <span>🔒 Privacidad Total: El procesamiento se realiza 100% en tu navegador. Tus archivos NO se suben a ningún servidor.</span>
        </div>
    );
}
