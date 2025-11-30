import { Delete, Check } from 'lucide-react';

interface KeypadProps {
    onKeyPress: (key: string) => void;
    onClear: () => void;
    onEnter: () => void;
    value: string;
}

export function Keypad({ onKeyPress, onClear, onEnter, value }: KeypadProps) {
    const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '.'];

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-right">
                <span className="text-3xl font-mono font-bold tracking-wider">
                    {value || '0.00'}
                </span>
            </div>

            <div className="grid grid-cols-4 gap-3 flex-1">
                {keys.map(key => (
                    <button
                        key={key}
                        onClick={() => onKeyPress(key)}
                        className="bg-card hover:bg-primary/5 border border-border hover:border-primary rounded-xl font-bold text-xl transition-all active:scale-95"
                    >
                        {key}
                    </button>
                ))}

                <button
                    onClick={onClear}
                    className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-center transition-all active:scale-95"
                >
                    <Delete size={24} />
                </button>

                <button
                    onClick={onEnter}
                    className="col-span-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-95 shadow-sm"
                >
                    <Check size={24} />
                    Agregar Manual
                </button>
            </div>
        </div>
    );
}
