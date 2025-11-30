import { Trash2 } from 'lucide-react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartProps {
    items: CartItem[];
    onRemoveItem: (id: string) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
}

export function Cart({ items, onRemoveItem, onUpdateQuantity }: CartProps) {
    if (items.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                <span className="text-4xl mb-4">🛒</span>
                <p className="italic">El carrito está vacío</p>
                <p className="text-sm mt-2">Selecciona productos para comenzar</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50 group hover:border-primary/30 transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} x {item.quantity}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-background rounded-lg border border-border shadow-sm">
                            <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-lg"
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-mono font-bold text-sm">{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-lg"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                            <div className="font-bold font-mono">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>

                        <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
