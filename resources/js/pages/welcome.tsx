import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, logout, register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartSheet } from '@/components/cart-sheet';
import { useCart } from '@/hooks/use-cart';
import { PizzaCustomizer } from '@/components/pizza-customizer';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    image_path: string | null;
    category: string;
    is_available: boolean;
}

export default function Welcome({
    canRegister = true,
    products = [],
}: {
    canRegister?: boolean;
    products?: Product[];
}) {
    const { auth } = usePage().props;
    const { addItem } = useCart();
    const [selectedPizza, setSelectedPizza] = useState<any>(null);
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

    // Featured pizzas calculated from database products or fallback to hero items
    const featuredPizzas = products.length > 0 ? products.map(p => ({
        id: p.id,
        title: p.name,
        description: p.description || "Freshly made with premium ingredients.",
        price: `$${p.price}`,
        image: p.image_path || "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
        badge: p.id % 2 === 0 ? "Bestseller" : "Chef's Choice"
    })) : [
        {
            id: 1,
            title: "Cheesy Pepperoni",
            description: "A fan favorite with double pepperoni and extra mozzarella.",
            price: "$14.99",
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2080&auto=format&fit=crop",
            badge: "Bestseller"
        },
    ];

    const handleAddToCartClick = (pizza: any) => {
        if (!auth.user) {
            window.location.href = login().url;
            return;
        }
        setSelectedPizza(pizza);
        setIsCustomizerOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
            <PizzaCustomizer
                pizza={selectedPizza}
                isOpen={isCustomizerOpen}
                onClose={() => setIsCustomizerOpen(false)}
            />
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
                                    <Link href="/">
                                        <Button variant="outline">Home</Button>
                                    </Link>
                                ) : (
                                    <Link href={dashboard()}>
                                        <Button variant="outline">Dashboard</Button>
                                    </Link>
                                )}
                                <Link href={logout().url} method="post" as="button">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-[#EE1922]">Logout</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href={login()}>
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                {canRegister && (
                                    <Link href={register()}>
                                        <Button className="bg-[#EE1922] hover:bg-[#D0161D]">Register</Button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-16">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero Pizza"
                        className="h-full w-full object-cover opacity-20 dark:opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/50 dark:to-[#0a0a0a]"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <Badge className="mb-4 bg-[#F8B803] text-black hover:bg-[#eab308]">FRESH & HOT</Badge>
                    <h1 className="mb-6 text-5xl font-black tracking-tight lg:text-7xl italic leading-tight">
                        THE MOST LOVED <span className="text-[#EE1922]">PIZZA</span> <br /> IN THE WORLD
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        Savor the flavor of hand-tossed crust, premium ingredients, and our signature sauce.
                        Your perfect pizza experience is just a few clicks away.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href={auth.user ? dashboard() : login()}>
                            <Button size="lg" className="h-14 px-10 text-lg bg-[#EE1922] hover:bg-[#D0161D]">
                                Order Now
                            </Button>
                        </Link>
                        <Link href="#menu">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-[#EE1922] text-[#EE1922] hover:bg-[#EE1922]/5">
                                View Menu
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Menu */}
            <section id="menu" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-black italic text-[#EE1922] md:text-4xl">FEATURED PIZZAS</h2>
                    <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A]">Our most popular choices picked just for you</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredPizzas.map((pizza, index) => (
                        <Card key={index} className="overflow-hidden border-none shadow-xl transition-all hover:-translate-y-2 dark:bg-[#161615]">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img src={pizza.image} alt={pizza.title} className="h-full w-full object-cover" />
                                <Badge className="absolute top-4 right-4 bg-[#F8B803] text-black">{pizza.badge}</Badge>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold">{pizza.title}</CardTitle>
                                    <span className="text-lg font-black text-[#EE1922]">{pizza.price}</span>
                                </div>
                                <CardDescription className="line-clamp-2">{pizza.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button
                                    className="w-full bg-[#EE1922] hover:bg-[#D0161D]"
                                    onClick={() => handleAddToCartClick(pizza)}
                                >
                                    Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
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

