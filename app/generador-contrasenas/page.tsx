"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('medium');

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let chars = '';
    if (options.uppercase) chars += charset.uppercase;
    if (options.lowercase) chars += charset.lowercase;
    if (options.numbers) chars += charset.numbers;
    if (options.symbols) chars += charset.symbols;

    if (chars === '') {
      setPassword('');
      return;
    }

    let generatedPassword = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generatedPassword += chars.charAt(array[i] % chars.length);
    }

    setPassword(generatedPassword);
    calculateStrength(length, options);
  }, [length, options]);

  // Initial generation
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const calculateStrength = (len: number, opts: typeof options) => {
    let score = 0;
    if (opts.uppercase) score++;
    if (opts.lowercase) score++;
    if (opts.numbers) score++;
    if (opts.symbols) score++;

    if (len < 10) {
      setStrength('weak');
    } else if (len < 14 || score < 3) {
      setStrength('medium');
    } else {
      setStrength('strong');
    }
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof typeof options) => {
    // Prevent unchecking the last option
    const activeCount = Object.values(options).filter(Boolean).length;
    if (activeCount === 1 && options[key]) return;

    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              &larr; Volver
            </Link>
            <h1 className="text-xl font-bold">Generador de Contraseñas</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">

          {/* Display Area */}
          <div className="relative mb-8">
            <div className="bg-muted/50 rounded-xl p-6 text-center break-all">
              <span className="text-3xl sm:text-4xl font-mono font-bold tracking-wider text-foreground">
                {password}
              </span>
            </div>
            <div className={`h-1.5 w-full mt-2 rounded-full transition-colors duration-300 ${strength === 'weak' ? 'bg-red-500' :
                strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
            <p className="text-center text-sm mt-2 text-muted-foreground font-medium">
              Seguridad: {strength === 'weak' ? 'Débil' : strength === 'medium' ? 'Media' : 'Fuerte'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={generatePassword}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-xl font-bold text-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
              Generar Nueva
            </button>
            <button
              onClick={handleCopy}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 border-2 ${copied
                  ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-card border-border hover:border-primary hover:text-primary'
                }`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ¡Copiada!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                  Copiar
                </>
              )}
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-muted-foreground">Longitud</label>
                <span className="font-mono font-bold text-lg">{length}</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() => toggleOption('uppercase')}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="font-medium">ABC Mayúsculas</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() => toggleOption('lowercase')}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="font-medium">abc Minúsculas</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() => toggleOption('numbers')}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="font-medium">123 Números</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() => toggleOption('symbols')}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="font-medium">!@# Símbolos</span>
              </label>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}