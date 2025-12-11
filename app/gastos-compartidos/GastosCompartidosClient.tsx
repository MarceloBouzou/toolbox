'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { Plus, Trash2, Calculator, Copy, Check, Users, DollarSign, ArrowRight } from 'lucide-react';

interface Participant {
    id: string;
    name: string;
    amount: string; // Keep as string for better input handling, convert to float for math
}

interface Transaction {
    from: string;
    to: string;
    amount: number;
}

interface Summary {
    total: number;
    average: number;
    transactions: Transaction[];
}

export default function GastosCompartidosClient() {
    const [participants, setParticipants] = useState<Participant[]>([
        { id: '1', name: '', amount: '' },
        { id: '2', name: '', amount: '' },
    ]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [copied, setCopied] = useState(false);

    // Add new participant row
    const addParticipant = () => {
        setParticipants([
            ...participants,
            { id: Math.random().toString(36).substr(2, 9), name: '', amount: '' }
        ]);
    };

    // Remove participant row
    const removeParticipant = (id: string) => {
        if (participants.length <= 2) {
            // Reset instead of delete if only 2 left, or just allow deleting down to 1?
            // Let's allow deleting down to 0, but maybe keep 1 minimun UI-wise? 
            // Logic says at least 2 needed to split, but for UI actions let's just filter.
        }
        setParticipants(participants.filter(p => p.id !== id));
    };

    // Update participant data
    const updateParticipant = (id: string, field: 'name' | 'amount', value: string) => {
        const newParticipants = participants.map(p => {
            if (p.id === id) {
                return { ...p, [field]: value };
            }
            return p;
        });
        setParticipants(newParticipants);
        // Reset summary if data changes to avoid confusion
        setSummary(null);
    };

    // --- CORE LOGIC: SETTLEMENT ALGORITHM ---
    const calculateExpenses = () => {
        // 1. Parse and Validation
        const validParticipants = participants.map(p => ({
            ...p,
            numAmount: parseFloat(p.amount) || 0,
            cleanName: p.name.trim() || `Persona ${p.id.substr(0, 3)}`
        })).filter(p => p.numAmount > 0 || p.cleanName !== '');
        // Filter out completely empty rows? Or just treat as 0? 
        // Better treat as 0 payment if name exists.

        if (validParticipants.length < 2) {
            alert("Necesitas al menos 2 personas para dividir gastos.");
            return;
        }

        const total = validParticipants.reduce((sum, p) => sum + p.numAmount, 0);
        const average = total / validParticipants.length;

        // 2. Calculate Balances
        let debtors: { name: string, balance: number }[] = [];
        let creditors: { name: string, balance: number }[] = [];

        validParticipants.forEach(p => {
            const balance = p.numAmount - average;
            // Use a small epsilon for float comparison
            if (balance < -0.01) debtors.push({ name: p.cleanName, balance: balance }); // Negative balance = owes money
            else if (balance > 0.01) creditors.push({ name: p.cleanName, balance: balance }); // Positive balance = is owed money
        });

        // 3. Settlement Loop (Greedy)
        // Sort to optimize number of transactions (optional, but matching big debts with big credits often helps)
        debtors.sort((a, b) => a.balance - b.balance); // Ascending (most negative first)
        creditors.sort((a, b) => b.balance - a.balance); // Descending (most positive first)

        const transactions: Transaction[] = [];
        let i = 0; // creditor index
        let j = 0; // debtor index

        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];

            // The amount to settle is the minimum of what debtor owes vs what creditor is owed
            const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

            if (amount > 0.01) {
                transactions.push({
                    from: debtor.name,
                    to: creditor.name,
                    amount: amount
                });
            }

            // Update balances
            creditor.balance -= amount;
            debtor.balance += amount;

            // Move indices if settled
            if (creditor.balance < 0.01) i++;
            if (Math.abs(debtor.balance) < 0.01) j++;
        }

        setSummary({
            total,
            average,
            transactions
        });

        // Scroll to result text
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // --- WHATSAPP FORMATTER ---
    const generateWhatsAppText = () => {
        if (!summary) return '';

        const peopleCount = participants.filter(p => p.name.trim() || parseFloat(p.amount) > 0).length;

        let text = `🥩 *Resumen de Gastos* 🥩\n`;
        text += `Total: $${formatCurrency(summary.total)}\n`;
        text += `Somos ${peopleCount} ($${formatCurrency(summary.average)} c/u)\n\n`;

        text += `💸 *A ponerla:*\n`;

        if (summary.transactions.length === 0) {
            text += `✅ ¡Nadie debe nada! Todo cuadrado.`;
        } else {
            summary.transactions.forEach(t => {
                text += `❌ ${t.from} le pasa $${formatCurrency(t.amount)} a ${t.to}\n`;
            });
        }

        text += `\n🔗 Calculado con: ${window.location.origin}/gastos-compartidos`;
        return text;
    };

    const copyToClipboard = () => {
        const text = generateWhatsAppText();
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Cuentas Claras" showBack>
                <div className="mr-4">
                    <ShareButton />
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="split_bills" />
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8">

                {/* Intro */}
                <div className="text-center space-y-2 animate-fade-in">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Users className="text-primary" /> Dividir Gastos
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Ingresa quiénes participaron y cuánto pagó cada uno. Nosotros calculamos quién le debe a quién para que las cuentas cierren.
                    </p>
                </div>

                {/* Input List */}
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
                    <div className="p-4 bg-muted/30 border-b border-border flex gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="flex-1">Nombre</div>
                        <div className="w-32 sm:w-40 text-right">Pagó ($)</div>
                        <div className="w-10"></div>
                    </div>

                    <div className="divide-y divide-border">
                        {participants.map((p, index) => (
                            <div key={p.id} className="flex gap-3 p-3 items-center hover:bg-muted/10 transition-colors">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder={`Persona ${index + 1}`}
                                        className="w-full bg-transparent border-none outline-none font-medium placeholder:text-muted-foreground/50"
                                        value={p.name}
                                        onChange={(e) => updateParticipant(p.id, 'name', e.target.value)}
                                        autoFocus={index === participants.length - 1 && participants.length > 2}
                                    />
                                </div>
                                <div className="w-32 sm:w-40">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-transparent border-none outline-none text-right font-mono"
                                        value={p.amount}
                                        onChange={(e) => updateParticipant(p.id, 'amount', e.target.value)}
                                    />
                                </div>
                                <div className="w-10 flex justify-center">
                                    <button
                                        onClick={() => removeParticipant(p.id)}
                                        className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
                        <button
                            onClick={addParticipant}
                            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-2 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                        >
                            <Plus size={16} /> Agregar Persona
                        </button>
                        <div className="text-xs text-muted-foreground">
                            {participants.length} participantes
                        </div>
                    </div>
                </div>

                {/* Main Action */}
                <div className="flex justify-center">
                    <button
                        onClick={calculateExpenses}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
                    >
                        <Calculator size={24} /> Calcular División
                    </button>
                </div>

                {/* Results Section */}
                {summary && (
                    <div id="results-section" className="scroll-mt-8 animate-fade-in-up">
                        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
                            {/* Header Summary */}
                            <div className="bg-primary/10 p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Total Gastado</p>
                                    <p className="text-3xl font-black text-primary">${formatCurrency(summary.total)}</p>
                                </div>
                                <div className="h-10 w-[1px] bg-border hidden sm:block"></div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Por Persona</p>
                                    <p className="text-3xl font-black text-foreground">${formatCurrency(summary.average)}</p>
                                </div>
                            </div>

                            {/* Transactions List */}
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <DollarSign className="text-green-500" /> Transferencias Necesarias
                                </h3>

                                {summary.transactions.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                                        <Check className="mx-auto mb-2 text-green-500" size={32} />
                                        <p>¡Todo cuadrado! Nadie le debe nada a nadie.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {summary.transactions.map((t, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-red-500 dark:text-red-400">{t.from}</span>
                                                    <span className="text-muted-foreground text-xs"><ArrowRight size={14} /></span>
                                                    <span className="font-bold text-green-600 dark:text-green-400">{t.to}</span>
                                                </div>
                                                <div className="font-mono font-bold text-lg">
                                                    ${formatCurrency(t.amount)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-muted/50 border-t border-border flex justify-center">
                                <button
                                    onClick={copyToClipboard}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-white shadow-md ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                    {copied ? '¡Copiado!' : 'Copiar para WhatsApp'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
