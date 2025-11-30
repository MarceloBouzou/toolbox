import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    children?: React.ReactNode;
}

export function Header({ title = "La Caja de Herramientas", showBack = false, children }: HeaderProps) {
    return (
        <header className="border-b border-border bg-card shrink-0 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                            &larr; Volver
                        </Link>
                    )}
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {children}
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}
