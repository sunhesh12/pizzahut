import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, Pizza, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";

export function CartSheet() {
    const { items, removeItem, updateQuantity, total } = useCart();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <ShoppingCart className="h-6 w-6 text-[#EE1922] transition-transform group-hover:scale-110" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f8b803] text-[10px] font-black text-black ring-2 ring-white">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-md border-l-4 border-l-[#EE1922]">
                <SheetHeader className="pb-6">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-black italic text-[#EE1922]">
                        <ShoppingBag className="h-6 w-6" />
                        DELIVERY ORDER
                    </SheetTitle>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kitchen Intake Pending</p>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    {items.length > 0 ? (
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.cartKey || item.id} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-black/40 border border-[#EE1922]/5 hover:border-[#EE1922]/20 transition-all shadow-sm group">
                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                                            {item.image_path ? (
                                                <img src={item.image_path} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-[#EE1922]/5">
                                                    <Pizza className="h-10 w-10 text-[#EE1922]/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-black italic text-[#EE1922] uppercase tracking-tight">{item.name}</h4>
                                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                                        {item.size && (
                                                            <Badge variant="outline" className="text-[9px] h-4 py-0 px-1 border-[#EE1922]/20 text-[#EE1922] font-black uppercase italic">
                                                                {item.size}
                                                            </Badge>
                                                        )}
                                                        {item.toppings?.map((topping, i) => (
                                                            <Badge key={i} variant="outline" className="text-[9px] h-4 py-0 px-1 border-[#F8B803]/30 text-[#F8B803] font-black uppercase italic">
                                                                +{topping}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground/30 hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => removeItem(item.cartKey || String(item.id))}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center overflow-hidden rounded-lg border border-[#EE1922]/10 bg-[#EE1922]/5 p-0.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none hover:bg-[#EE1922]/5"
                                                        onClick={() => updateQuantity(String(item.cartKey || item.id), item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-10 text-center text-xs font-black italic">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none hover:bg-[#EE1922]/5"
                                                        onClick={() => updateQuantity(String(item.cartKey || item.id), item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <span className="font-black text-[#EE1922] italic">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                            <div className="relative">
                                <Pizza className="h-20 w-20 text-[#EE1922]/10 animate-spin-slow" />
                                <ShoppingBag className="absolute bottom-0 right-0 h-10 w-10 text-[#F8B803]/20" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black italic text-[#EE1922]">EMPTY OVEN</h4>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add some fire to your tray</p>
                            </div>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="pt-6 space-y-4 border-t border-muted-foreground/10">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#EE1922]">
                                <span>Est. Delivery</span>
                                <span>$0.00</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center text-lg font-black italic text-[#EE1922]">
                                <span>TOTAL DOX</span>
                                <span className="text-3xl tracking-tighter">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <SheetFooter className="sm:flex-col gap-3">
                            <Link href="/checkout" className="w-full">
                                <Button className="w-full h-14 bg-[#EE1922] hover:bg-[#D0161D] text-white font-black italic uppercase tracking-widest text-lg shadow-xl shadow-red-100">
                                    DEPLOY ORDER
                                </Button>
                            </Link>
                            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase opacity-50">
                                Secured Payment • Hotline Fulfillment
                            </p>
                        </SheetFooter>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}


