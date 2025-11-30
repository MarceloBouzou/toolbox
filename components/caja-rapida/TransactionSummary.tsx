interface TransactionSummaryProps {
    total: number;
    itemCount: number;
    onCancel: () => void;
    onCheckout: () => void;
}

export function TransactionSummary({ total, itemCount, onCancel, onCheckout }: TransactionSummaryProps) {
    return (
        <div className="p-4 bg-muted/50 border-t border-border space-y-4">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-muted-foreground font-medium text-sm">Total ({itemCount} items)</span>
                </div>
                <span className="text-4xl font-bold text-primary tracking-tight">
                    ${total.toFixed(2)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onCancel}
                    disabled={itemCount === 0}
                    className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
                <button
                    onClick={onCheckout}
                    disabled={itemCount === 0}
                    className="bg-green-600 text-white hover:bg-green-700 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Cobrar
                </button>
            </div>
        </div>
    );
}
