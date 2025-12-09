"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { VisitCounter } from '@/components/VisitCounter';
import { ShareButton } from '@/components/ShareButton';
import { FileSpreadsheet, FileCode, Lock, Type, Image as ImageIcon, FileText, Search, Grid, Tag } from 'lucide-react';

const tools = [
  {
    title: 'Unificador de Excel',
    description: '¿Cansado de copiar y pegar? Fusiona múltiples archivos o pestañas en una sola hoja maestra en segundos.',
    href: '/consolidar-excel',
    icon: <FileSpreadsheet size={48} className="stroke-1" />,
    category: 'Datos',
    color: 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  },
  {
    title: 'Conversor de Datos',
    description: 'El puente entre Excel y la Web. Convierte tablas a código (JSON/CSV) o limpia estructuras desordenadas.',
    href: '/json-formatter',
    icon: <FileCode size={48} className="stroke-1" />,
    category: 'Datos',
    color: 'bg-orange-100/50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
  },
  {
    title: 'Herramientas PDF',
    description: 'Une múltiples archivos PDF en uno solo o divide un documento en páginas sueltas. Privado y seguro.',
    href: '/pdf-tools',
    icon: <FileText size={48} className="stroke-1" />,
    category: 'Documentos',
    color: 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  },
  {
    title: 'Generador Password',
    description: 'Crea contraseñas robustas e imposibles de hackear para mantener tus cuentas siempre protegidas.',
    href: '/generador-contrasenas',
    icon: <Lock size={48} className="stroke-1" />,
    category: 'Seguridad',
    color: 'bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  },
  {
    title: 'Herramientas de Texto',
    description: 'Limpieza instantánea: mayúsculas, espacios, extracción de emails y mucho más.',
    href: '/texto',
    icon: <Type size={48} className="stroke-1" />,
    category: 'Texto',
    color: 'bg-pink-100/50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
  },
  {
    title: 'Conversor de Imágenes',
    description: 'Transforma imágenes a JPG, PNG o WEBP. Conversión local y rápida sin subir archivos.',
    href: '/conversor-imagenes',
    icon: <ImageIcon size={48} className="stroke-1" />,
    category: 'Imágenes',
    color: 'bg-cyan-100/50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
  },
];

const CATEGORIES = ['Todos', 'Datos', 'Documentos', 'Imágenes', 'Texto', 'Seguridad'];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background transition-colors duration-300 relative overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-card via-card to-muted/30 border-b border-border transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

          {/* Top Bar */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-2">
              {/* Logo placeholder or small text if wanted */}
            </div>
            <div className="flex items-center gap-3">
              <ShareButton />
              <ThemeSwitcher />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in-up">
              <span className="block text-foreground">La Caja de Herramientas</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient-x">
                Digital
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed animate-fade-in-up delay-100">
              Utilidades simples para problemas complejos.<br className="hidden sm:block" />
              Sin registros, sin publicidad, 100% gratis.
            </p>

            {/* Search & Filter Bar */}
            <div className="mt-12 animate-fade-in-up delay-200">

              {/* Search Input */}
              <div className="relative max-w-lg mx-auto mb-6 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="¿Qué necesitas hacer hoy?"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm group-hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categories Chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Grid de Herramientas */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

        {filteredTools.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg">No encontramos herramientas con ese nombre.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
              className="mt-4 text-primary hover:underline"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool, index) => (
              <Link
                href={tool.href}
                key={tool.title}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-full bg-card hover:bg-muted/30 rounded-3xl p-6 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 flex flex-col">

                  {/* Category Tag */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {tool.category}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${tool.color}`}>
                    {tool.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="mt-6 pt-4 border-t border-border/30 flex justify-end">
                    <div className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
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
            <VisitCounter />
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient-x { 0%, 100% { background-position: left center; } 50% { background-position: right center; } }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; background-size: 200% 200%; }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </main>
  );
}