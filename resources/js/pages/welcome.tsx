import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, logout, register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CartSheet } from '@/components/cart-sheet';
import { useCart } from '@/hooks/use-cart';
import { PizzaCustomizer } from '@/components/pizza-customizer';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { LayoutGrid, LayoutList, Search, SlidersHorizontal, X } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string | null;
    ingredients: string | null;
    price: string;
    image_path: string | null;
    category: string;
    is_available: boolean;
}

const PIZZA_FALLBACK_IMG = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop";
const BEVERAGE_FALLBACK_IMG = "https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?q=80&w=1974&auto=format&fit=crop";

function mapProduct(p: Product, fallbackImg: string) {
    return {
        id: p.id,
        title: p.name,
        description: p.description || "Freshly made with premium ingredients.",
        ingredients: p.ingredients || "",
        price: `Rs. ${parseFloat(p.price).toFixed(2)}`,
        priceNum: parseFloat(p.price),
        image: p.image_path || fallbackImg,
        category: p.category,
    };
}

type MenuTab = 'Classic' | 'Signature' | 'Delight' | 'Beverages';
type ViewMode = 'grid' | 'list';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export default function Welcome({
    canRegister = true,
    products = [],
    signaturePizzas = [],
    delightPizzas = [],
    beverages = [],
    pizzaSizes = [],
    toppings = [],
}: {
    canRegister?: boolean;
    products?: Product[];
    signaturePizzas?: Product[];
    delightPizzas?: Product[];
    beverages?: Product[];
    pizzaSizes?: any[];
    toppings?: any[];
}) {
    const { auth } = usePage().props;
    const { addItem } = useCart();
    const [selectedPizza, setSelectedPizza] = useState<any>(null);
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<MenuTab>('Classic');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [maxPrice, setMaxPrice] = useState<number | ''>(10000);
    const [showFilters, setShowFilters] = useState(false);

    const menuTabs: { key: MenuTab; label: string; emoji: string }[] = [
        { key: 'Classic', label: 'Classic', emoji: '🍕' },
        { key: 'Signature', label: 'Signature', emoji: '⭐' },
        { key: 'Delight', label: 'Delight', emoji: '✨' },
        { key: 'Beverages', label: 'Beverages', emoji: '🥤' },
    ];

    const allItems = useMemo(() => ({
        Classic: products.map(p => mapProduct(p, PIZZA_FALLBACK_IMG)),
        Signature: signaturePizzas.map(p => mapProduct(p, PIZZA_FALLBACK_IMG)),
        Delight: delightPizzas.map(p => mapProduct(p, PIZZA_FALLBACK_IMG)),
        Beverages: beverages.map(p => mapProduct(p, BEVERAGE_FALLBACK_IMG)),
    }), [products, signaturePizzas, delightPizzas, beverages]);

    const activeItems = useMemo(() => {
        let items = allItems[activeTab];

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q) ||
                i.ingredients.toLowerCase().includes(q)
            );
        }

        // Price filter
        if (maxPrice !== '' && maxPrice > 0) {
            items = items.filter(i => i.priceNum <= maxPrice);
        }

        // Sort
        switch (sortBy) {
            case 'price-asc': return [...items].sort((a, b) => a.priceNum - b.priceNum);
            case 'price-desc': return [...items].sort((a, b) => b.priceNum - a.priceNum);
            case 'name-asc': return [...items].sort((a, b) => a.title.localeCompare(b.title));
            default: return items;
        }
    }, [allItems, activeTab, searchQuery, maxPrice, sortBy]);

    const isBeverageTab = activeTab === 'Beverages';

    const handleItemClick = (item: any) => {
        if (!auth.user) {
            window.location.href = login().url;
            return;
        }
        if (isBeverageTab) {
            addItem({
                id: item.id,
                name: item.title,
                price: item.price.replace('Rs. ', ''),
                image_path: item.image || undefined,
                size: undefined,
                toppings: [],
            });
        } else {
            setSelectedPizza(item);
            setIsCustomizerOpen(true);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSortBy('default');
        setMaxPrice(10000);
    };

    const hasActiveFilters = searchQuery !== '' || sortBy !== 'default' || maxPrice !== 10000;

    const tabDescriptions: Record<MenuTab, string> = {
        Classic: '🍕 Time-tested favourites — always delicious, always fresh',
        Signature: '⭐ Chef\'s exclusive creations — bold flavors you won\'t find anywhere else',
        Delight: '✨ Lighter options crafted for those who love great taste without compromise',
        Beverages: '🥤 Perfectly chilled drinks to complement every slice',
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
            {selectedPizza && (
                <PizzaCustomizer
                    isOpen={isCustomizerOpen}
                    onClose={() => setIsCustomizerOpen(false)}
                    pizza={selectedPizza}
                    availableSizes={pizzaSizes}
                    availableToppings={toppings}
                />
            )}
            <Head title="Welcome to PizzaHut">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* Navigation */}
            <header className="fixed top-0 z-50 w-full border-b border-[#1914001a] bg-white/80 backdrop-blur-md dark:border-[#ffffff1a] dark:bg-[#0a0a0a]/80">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-[#EE1922] text-white shadow-lg">
                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                                <path d="M2 30 C 5 20, 35 20, 38 30 L 32 30 C 30 25, 10 25, 8 30 Z" fill="white" />
                                <path d="M5 24 L 20 5 L 35 24 L 32 24 L 20 10 L 8 24 Z" fill="white" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tighter italic text-[#EE1922]">PIZZAHUT</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <CartSheet />
                        {auth.user ? (
                            <div className="flex gap-2 items-center">
                                {auth.user.role === 'Customer' ? (
                                    <Link href="/"><Button variant="outline">Home</Button></Link>
                                ) : (
                                    <Link href={dashboard()}><Button variant="outline">Dashboard</Button></Link>
                                )}
                                <Link href={logout().url} method="post" as="button">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-[#EE1922]">Logout</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href={login()}><Button variant="ghost">Log in</Button></Link>
                                {canRegister && (
                                    <Link href={register()}><Button className="bg-[#EE1922] hover:bg-[#D0161D]">Register</Button></Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-16">
                <div className="absolute inset-0 z-0">
                    <img src={PIZZA_FALLBACK_IMG} alt="Hero Pizza" className="h-full w-full object-cover opacity-20 dark:opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/50 dark:to-[#0a0a0a]"></div>
                </div>
                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <Badge className="mb-4 bg-[#F8B803] text-black hover:bg-[#eab308]">FRESH & HOT</Badge>
                    <h1 className="mb-6 text-5xl font-black tracking-tight lg:text-7xl italic leading-tight">
                        THE MOST LOVED <span className="text-[#EE1922]">PIZZA</span> <br /> IN THE WORLD
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        Savor the flavor of hand-tossed crust, premium ingredients, and our signature sauce.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="#menu">
                            <Button size="lg" className="h-14 px-10 text-lg bg-[#EE1922] hover:bg-[#D0161D]">Order Now</Button>
                        </Link>
                        <Link href="#menu">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-[#EE1922] text-[#EE1922] hover:bg-[#EE1922]/5">View Menu</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Full Menu */}
            <section id="menu" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-black italic text-[#EE1922] md:text-5xl">OUR FULL MENU</h2>
                    <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A]">From classic favourites to bold signatures — and refreshing drinks too</p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-muted/40 rounded-2xl border border-muted">
                        {menuTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => { setActiveTab(tab.key); clearFilters(); }}
                                className={cn(
                                    "px-6 py-3 rounded-xl font-black text-sm uppercase italic tracking-widest transition-all",
                                    activeTab === tab.key
                                        ? "bg-[#EE1922] text-white shadow-lg shadow-red-200 dark:shadow-red-900/30 scale-105"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <span className="mr-1.5">{tab.emoji}</span>
                                {tab.label}
                                {tab.key === 'Signature' && (
                                    <span className="ml-1.5 text-[9px] font-black bg-[#F8B803] text-black px-1.5 py-0.5 rounded-full">NEW</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search, Filter & View Toggle Bar */}
                <div className="mb-6 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder={`Search ${activeTab.toLowerCase()}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 font-bold italic uppercase tracking-tighter text-xs border-muted-foreground/20 bg-background"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="h-10 rounded-md border border-muted-foreground/20 bg-background px-3 text-xs font-bold uppercase italic tracking-tighter text-foreground focus:outline-none focus:ring-2 focus:ring-[#EE1922]/50 cursor-pointer"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="name-asc">Name: A → Z</option>
                        </select>

                        {/* Filter Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "h-10 px-4 font-black italic uppercase tracking-widest text-xs border-muted-foreground/20 transition-all",
                                showFilters && "border-[#EE1922] text-[#EE1922] bg-[#EE1922]/5"
                            )}
                        >
                            <SlidersHorizontal className="mr-2 size-3.5" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-1.5 size-2 rounded-full bg-[#EE1922] inline-block" />
                            )}
                        </Button>

                        {/* View Toggle */}
                        <div className="flex h-10 rounded-md border border-muted-foreground/20 overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "flex items-center justify-center w-10 transition-all",
                                    viewMode === 'grid' ? "bg-[#EE1922] text-white" : "text-muted-foreground hover:bg-muted"
                                )}
                                title="Grid View"
                            >
                                <LayoutGrid className="size-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "flex items-center justify-center w-10 transition-all",
                                    viewMode === 'list' ? "bg-[#EE1922] text-white" : "text-muted-foreground hover:bg-muted"
                                )}
                                title="List View"
                            >
                                <LayoutList className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Expanded Filter Panel */}
                    {showFilters && (
                        <div className="p-4 rounded-xl border border-muted bg-muted/20 flex flex-wrap gap-6 items-center">
                            <div className="flex flex-col gap-1.5 min-w-[200px]">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Max Price: <span className="text-[#EE1922]">Rs. {maxPrice}</span>
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={10000}
                                    step={1}
                                    value={maxPrice || 10000}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-[#EE1922] cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                                    <span>Rs. 1</span>
                                    <span>Rs. 10000</span>
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="h-8 px-3 text-xs font-black italic uppercase tracking-widest text-muted-foreground hover:text-[#EE1922]"
                                >
                                    <X className="mr-1.5 size-3" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Result count & description */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
                        {tabDescriptions[activeTab]}
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {activeItems.length} item{activeItems.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Items */}
                {activeItems.length > 0 ? (
                    viewMode === 'grid' ? (
                        // ── GRID VIEW ──
                        <div className={cn(
                            "grid gap-6",
                            isBeverageTab
                                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        )}>
                            {activeItems.map((item, index) => (
                                <Card
                                    key={item.id}
                                    className="overflow-hidden border-none shadow-xl transition-all hover:-translate-y-2 dark:bg-[#161615] group"
                                >
                                    <div className={cn("relative overflow-hidden", isBeverageTab ? "aspect-square" : "aspect-[4/3]")}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <Badge className={cn(
                                            "absolute top-3 left-3 font-black text-[9px] uppercase tracking-widest",
                                            activeTab === 'Signature' ? "bg-[#F8B803] text-black" :
                                                activeTab === 'Delight' ? "bg-purple-500 text-white" :
                                                    isBeverageTab ? "bg-blue-500 text-white" :
                                                        "bg-[#EE1922] text-white"
                                        )}>
                                            {isBeverageTab ? '🥤 Chilled' : activeTab === 'Signature' ? '⭐ Signature' : activeTab === 'Delight' ? '✨ Delight' : index % 2 === 0 ? 'Bestseller' : "Chef's Pick"}
                                        </Badge>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold group-hover:text-[#EE1922] transition-colors">{item.title}</CardTitle>
                                            <span className="text-xl font-black text-[#EE1922]">{item.price}</span>
                                        </div>
                                        <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button
                                            className={cn("w-full font-black italic uppercase tracking-tighter", isBeverageTab ? "bg-blue-600 hover:bg-blue-700" : "bg-[#EE1922] hover:bg-[#D0161D]")}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {isBeverageTab ? '+ Add Drink' : '+ Customize & Order'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        // ── LIST VIEW ──
                        <div className="flex flex-col gap-3">
                            {activeItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex items-center gap-5 p-4 rounded-2xl border border-muted bg-white dark:bg-[#161615] shadow-sm hover:shadow-xl hover:border-[#EE1922]/30 transition-all"
                                >
                                    {/* Image */}
                                    <div className="relative flex-shrink-0 h-24 w-24 rounded-xl overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3 className="text-base font-black italic uppercase tracking-tight group-hover:text-[#EE1922] transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <Badge className={cn(
                                                        "font-black text-[9px] uppercase tracking-widest px-2 py-0.5",
                                                        activeTab === 'Signature' ? "bg-[#F8B803] text-black" :
                                                            activeTab === 'Delight' ? "bg-purple-100 text-purple-700" :
                                                                isBeverageTab ? "bg-blue-100 text-blue-700" :
                                                                    "bg-[#EE1922]/10 text-[#EE1922]"
                                                    )}>
                                                        {activeTab}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                                {item.ingredients && (
                                                    <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest mt-1 line-clamp-1">
                                                        {item.ingredients}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <span className="text-2xl font-black text-[#EE1922] italic block">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex-shrink-0">
                                        <Button
                                            size="sm"
                                            className={cn(
                                                "font-black italic uppercase tracking-tighter text-xs px-5 h-10",
                                                isBeverageTab ? "bg-blue-600 hover:bg-blue-700" : "bg-[#EE1922] hover:bg-[#D0161D]"
                                            )}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {isBeverageTab ? '+ Add' : '+ Order'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="py-24 text-center border-2 border-dashed rounded-2xl border-[#EE1922]/20 bg-[#EE1922]/5">
                        <Search className="mx-auto size-12 text-[#EE1922]/30 mb-4" />
                        <p className="font-black italic uppercase text-[#EE1922] text-lg">No items match your filters</p>
                        <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filters</p>
                        <Button variant="ghost" onClick={clearFilters} className="mt-4 font-bold italic uppercase text-xs tracking-widest text-muted-foreground hover:text-[#EE1922]">
                            <X className="mr-2 size-3" /> Clear Filters
                        </Button>
                    </div>
                )}
            </section>

            {/* Why Choose Us */}
            <section className="bg-[#EE1922]/5 py-24 dark:bg-[#161615]">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EE1922] text-white">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-4 text-xl font-bold">Fast Delivery</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">Hot and fresh pizza delivered to your doorstep in 30 minutes or less.</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8B803] text-black">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="mb-4 text-xl font-bold">Fresh Ingredients</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">We only use the freshest vegetables and premium quality meats.</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EE1922] text-white">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-4 text-xl font-bold">Best Prices</h3>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">Get the best value for your money with our daily deals and combos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#1914001a] py-12 dark:border-[#ffffff1a]">
                <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="flex aspect-square size-8 items-center justify-center rounded bg-[#EE1922] text-white">
                            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                                <path d="M2 30 C 5 20, 35 20, 38 30 L 32 30 C 30 25, 10 25, 8 30 Z" fill="white" />
                                <path d="M5 24 L 20 5 L 35 24 L 32 24 L 20 10 L 8 24 Z" fill="white" />
                            </svg>
                        </div>
                        <span className="text-lg font-black tracking-tighter italic text-[#EE1922]">PIZZAHUT</span>
                    </div>
                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        © {new Date().getFullYear()} PizzaHut Software. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
