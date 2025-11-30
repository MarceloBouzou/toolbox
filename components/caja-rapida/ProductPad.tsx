import { Plus } from 'lucide-react';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    emoji: string;
}

interface ProductPadProps {
    products: Product[];
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
    onAddProduct: (product: Product) => void;
}

export function ProductPad({
    products,
    categories,
    activeCategory,
    onSelectCategory,
    onAddProduct
}: ProductPadProps) {

    const filteredProducts = activeCategory === 'General'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`px-4 py-2 rounded-xl border whitespace-nowrap transition-all font-medium ${activeCategory === cat
                                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                : 'bg-card border-border hover:border-primary/50 hover:text-primary'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border p-4 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => onAddProduct(product)}
                            className="aspect-square bg-muted/30 hover:bg-primary/5 border border-transparent hover:border-primary rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group active:scale-95"
                        >
                            <div className="w-12 h-12 rounded-full bg-background shadow-sm group-hover:shadow-md flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {product.emoji}
                            </div>
                            <div className="text-center w-full px-2">
                                <span className="font-bold text-sm block truncate">{product.name}</span>
                                <span className="text-xs text-muted-foreground font-mono">${product.price.toFixed(2)}</span>
                            </div>
                        </button>
                    ))}

                    <button className="aspect-square border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all active:scale-95">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Plus size={24} />
                        </div>
                        <span className="text-xs font-medium">Nuevo</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
