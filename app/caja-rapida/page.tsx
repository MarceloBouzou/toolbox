"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { Cart, CartItem } from '@/components/caja-rapida/Cart';
import { ProductPad, Product } from '@/components/caja-rapida/ProductPad';
import { TransactionSummary } from '@/components/caja-rapida/TransactionSummary';
import { Keypad } from '@/components/caja-rapida/Keypad';

// Mock Data (will be replaced by localStorage later)
const INITIAL_PRODUCTS: Product[] = [
    { id: '1', name: 'Manzana', price: 150, category: 'Frutas', emoji: '🍎' },
    { id: '2', name: 'Banana', price: 120, category: 'Frutas', emoji: '🍌' },
    { id: '3', name: 'Naranja', price: 130, category: 'Frutas', emoji: '🍊' },
    { id: '4', name: 'Lechuga', price: 200, category: 'Verduras', emoji: '🥬' },
    { id: '5', name: 'Tomate', price: 250, category: 'Verduras', emoji: '🍅' },
    { id: '6', name: 'Coca Cola', price: 800, category: 'Bebidas', emoji: '🥤' },
    { id: '7', name: 'Agua', price: 500, category: 'Bebidas', emoji: '💧' },
    { id: '8', name: 'Pan', price: 400, category: 'Almacén', emoji: '🥖' },
];

const CATEGORIES = ['General', 'Frutas', 'Verduras', 'Bebidas', 'Almacén'];

export default function CajaRapidaPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState('General');
    const [keypadValue, setKeypadValue] = useState('');
    const [showKeypad, setShowKeypad] = useState(false);

    // Cart Logic
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Keypad Logic
    const handleKeyPress = (key: string) => {
        if (key === '.' && keypadValue.includes('.')) return;
        setKeypadValue(prev => prev + key);
    };

    const handleKeypadEnter = () => {
        const price = parseFloat(keypadValue);
        if (!price || isNaN(price)) return;

        const newItem: CartItem = {
            id: `manual-${Date.now()}`,
            name: 'Item Manual',
            price: price,
            quantity: 1
        };

        setCart(prev => [...prev, newItem]);
        setKeypadValue('');
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Caja Rápida" showBack>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded hidden sm:inline-block">
                    Turno: {new Date().toLocaleDateString()}
                </span>
                <div className="ml-2">
                    <ShareButton />
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="caja_rapida" />
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden h-[calc(100vh-4rem)]">

                {/* Left Column: Cart & Totals */}
                <div className="lg:col-span-1 bg-card rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden h-full">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Ticket Actual</h2>
                        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
                            #{Math.floor(Math.random() * 1000).toString().padStart(4, '0')}
                        </span>
                    </div>

                    <Cart
                        items={cart}
                        onRemoveItem={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                    />

                    <TransactionSummary
                        total={total}
                        itemCount={itemCount}
                        onCancel={clearCart}
                        onCheckout={() => alert('¡Venta registrada! (Simulación)')}
                    />
                </div>

                {/* Right Column: Product Pad */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">

                    <div className="flex-1 overflow-hidden flex flex-col">
                        <ProductPad
                            products={INITIAL_PRODUCTS}
                            categories={CATEGORIES}
                            activeCategory={activeCategory}
                            onSelectCategory={setActiveCategory}
                            onAddProduct={addToCart}
                        />
                    </div>

                    {/* Toggle Keypad Button (Mobile/Desktop) */}
                    <div className="shrink-0">
                        <button
                            onClick={() => setShowKeypad(!showKeypad)}
                            className="w-full py-2 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
                        >
                            {showKeypad ? 'Ocultar Teclado Manual' : 'Mostrar Teclado Manual'}
                        </button>

                        {showKeypad && (
                            <div className="h-64 mt-2 bg-card rounded-2xl shadow-sm border border-border p-4">
                                <Keypad
                                    value={keypadValue}
                                    onKeyPress={handleKeyPress}
                                    onClear={() => setKeypadValue('')}
                                    onEnter={handleKeypadEnter}
                                />
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
