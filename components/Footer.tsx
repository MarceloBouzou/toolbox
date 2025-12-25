import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="py-12 px-4 border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
            <div className="max-w-5xl mx-auto text-center space-y-6">

                {/* La Cita */}
                <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground/80 italic font-serif">
                        “First, solve the problem. Then, write the code.”
                    </p>
                    <p className="text-xs text-muted-foreground">— John Johnson</p>
                </div>

                {/* Créditos y Contacto */}
                <div className="flex flex-col items-center gap-1">
                    {/* Nombre -> WhatsApp */}
                    <a
                        href="https://wa.me/5491132465634?text=Hola%20Marcelo,%20vi%20tu%20Toolbox%20Digital..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-foreground hover:text-green-500 transition-colors flex items-center gap-2"
                        title="Envíame un WhatsApp"
                    >
                        Marcelo Bouzou
                        {/* Icono sutil de WhatsApp opcional */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </a>

                    {/* Título Profesional */}
                    <p className="text-sm text-muted-foreground font-medium">
                        Arquitecto de Soluciones y Procesos de Negocio
                    </p>

                    {/* Link a LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/marcelobouzou/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 flex items-center gap-1"
                    >
                        Ver perfil de LinkedIn
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </a>
                </div>

                {/* Botones de Acción (Feedback y Café) */}
                <div className="flex justify-center gap-4 pt-2">
                    <a
                        href="https://forms.gle/WXsaX6qooRTtnm7V6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-xs font-medium transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        ¿Ideas?
                    </a>

                    {/* Opcional: Botón de Cafecito si decides ponerlo */}
                    {/* 
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs font-medium transition-colors dark:bg-yellow-900/30 dark:text-yellow-200">
            ☕ Invítame un café
          </button> 
          */}
                </div>

                <p className="text-[10px] text-muted-foreground/40 pt-4">
                    &copy; {new Date().getFullYear()} ToolBox Digital. 100% Client-Side & Secure.
                </p>
            </div>
        </footer>
    );
};
