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
    title: 'Formateador JSON',
    description: 'Limpia, valida y ordena tus objetos JSON para que sean legibles por humanos.',
    href: '/json-formatter',
    icon: 'wc',
    status: 'Listo',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
  },
  {
    title: 'Generador de Passwords',
    description: 'Crea contraseñas imposibles de hackear y mantén tus cuentas seguras.',
    href: '/generador-contrasenas',
    icon: 'wc',
    status: 'Listo',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  },
  {
    title: 'Caja Rápida',
    description: 'Punto de venta minimalista y offline para tu negocio. Controla ventas y caja diaria.',
    href: '/caja-rapida',
    icon: '🏪',
    status: 'Nuevo',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
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
    <main className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-card border-b border-border transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-8">
            <ThemeSwitcher />
          </div>
          <div className="text-center pb-12">
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl tracking-tight">
              La Caja de Herramientas <span className="text-primary">Digital</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Utilidades simples para problemas complejos. Sin registros, sin publicidad, 100% gratis.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Herramientas */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.title} className="group">
              <div className="relative h-full bg-card rounded-2xl shadow-sm border border-border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary">

                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tool.color}`}>
                    {tool.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>

                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {tool.description}
                </p>

                <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ir a la herramienta &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Simple */}
      <footer className="text-center py-8 text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Marcelo - Arquitecto de Soluciones
      </footer>
    </main>
  );
}