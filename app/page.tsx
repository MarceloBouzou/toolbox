"use client";

import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const tools = [
  {
    title: 'Consolidador de Excel',
    description: 'Deja de copiar y pegar. Une múltiples archivos y hojas en un solo Excel maestro en segundos.',
    href: '/consolidar-excel',
    icon: '📊',
    status: 'Listo',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
  },
  {
    title: 'Formateador y Conversor JSON/CSV',
    description: 'Formatea, valida JSON y convierte entre CSV y JSON en ambas direcciones.',
    href: '/json-formatter',
    icon: '💻',
    status: 'Listo',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  },
  {
    title: 'Generador de Passwords',
    description: 'Crea contraseñas imposibles de hackear y mantén tus cuentas seguras.',
    href: '/generador-contrasenas',
    icon: '🔐',
    status: 'Listo',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  },
  {
    title: 'Herramientas de Texto',
    description: 'Formatea, limpia y extrae datos de tus textos. Mayúsculas, emails, espacios y más.',
    href: '/texto',
    icon: '📝',
    status: 'Listo',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100'
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background transition-colors duration-300 relative overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-card via-card to-muted/30 border-b border-border transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

          {/* Theme Switcher */}
          <div className="flex justify-end mb-8 animate-fade-in">
            <ThemeSwitcher />
          </div>

          {/* Hero Content */}
          <div className="text-center pb-16 space-y-6">

            {/* Badges */}
            <div className="flex justify-center gap-3 mb-6 animate-fade-in-up delay-100">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                ✨ 100% Gratis
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                🔒 Sin Registro
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                🚫 Sin Publicidad
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in-up delay-200">
              <span className="block text-foreground">La Caja de Herramientas</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient-x">
                Digital
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Utilidades <span className="font-semibold text-foreground">simples</span> para problemas <span className="font-semibold text-foreground">complejos</span>.
              <br className="hidden sm:block" />
              Potencia tu productividad sin complicaciones.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-10 animate-fade-in-up delay-400">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{tools.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Herramientas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground mt-1">Usos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">0€</div>
                <div className="text-sm text-muted-foreground mt-1">Costo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Herramientas */}
      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {tools.map((tool, index) => (
            <Link
              href={tool.href}
              key={tool.title}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 100 + 500}ms` }}
            >
              <div className="relative h-full bg-gradient-to-br from-card to-card/50 rounded-3xl shadow-lg border border-border/50 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/50 backdrop-blur-sm overflow-hidden group-hover:scale-[1.02]">

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                {/* Content */}
                <div className="relative z-10">

                  {/* Icon & Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-7xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 drop-shadow-lg">
                      {tool.icon}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${tool.color} shadow-sm`}>
                      {tool.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>Explorar herramienta</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-border bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              Hecho con <span className="text-red-500 animate-pulse">❤️</span> por <span className="font-semibold text-foreground">Marcelo Bouzou</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Arquitecto de Soluciones y Procesos de Negocio
            </p>
            <p className="text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}