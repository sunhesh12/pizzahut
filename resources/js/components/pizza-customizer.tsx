import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Minus, Pizza } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface PizzaCustomizerProps {
    pizza: {
        id: number;
        title: string;
        price: string;
        image: string;
        description: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
}

const SIZES = [
    { label: 'Personal', value: 'personal', priceMod: 0 },
    { label: 'Medium', value: 'medium', priceMod: 4 },
    { label: 'Large', value: 'large', priceMod: 8 },
];

const TOPPINGS = [
    { label: 'Extra Cheese', value: 'cheese', price: 2 },
    { label: 'Mushrooms', value: 'mushrooms', price: 1.5 },
    { label: 'Onions', value: 'onions', price: 1 },
    { label: 'Green Peppers', value: 'peppers', price: 1 },
    { label: 'Black Olives', value: 'olives', price: 1.5 },
    { label: 'Pepperoni', value: 'pepperoni', price: 2.5 },
];

export function PizzaCustomizer({ pizza, isOpen, onClose }: PizzaCustomizerProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default Medium
    const [selectedToppings, setSelectedToppings] = useState<typeof TOPPINGS>([]);

    if (!pizza) return null;

    const basePrice = parseFloat(pizza.price.replace('$', ''));
    const totalPrice = basePrice + selectedSize.priceMod + selectedToppings.reduce((acc, t) => acc + t.price, 0);

    const toggleTopping = (topping: typeof TOPPINGS[0]) => {
        setSelectedToppings(prev =>
            prev.find(t => t.value === topping.value)
                ? prev.filter(t => t.value !== topping.value)
                : [...prev, topping]
        );
    };

    const handleAddToCart = () => {
        addItem({
            id: pizza.id,
            name: pizza.title,
            price: totalPrice.toFixed(2),
            image_path: pizza.image,
            size: selectedSize.label,
            toppings: selectedToppings.map(t => t.label),
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="relative h-48 w-full overflow-hidden">
                    <img src={pizza.image} alt={pizza.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                        <DialogTitle className="text-3xl font-black italic text-white uppercase tracking-tighter">
                            {pizza.title}
                        </DialogTitle>
                    </div>
                </div>

                <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* Size Selection */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#EE1922]">CHOOSE YOUR SIZE</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {SIZES.map((size) => (
                                <button
                                    key={size.value}
                                    onClick={() => setSelectedSize(size)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                                        selectedSize.value === size.value
                                            ? "border-[#EE1922] bg-[#EE1922]/5 shadow-inner"
                                            : "border-muted hover:border-[#EE1922]/20"
                                    )}
                                >
                                    <Pizza className={cn(
                                        "mb-2 transition-transform",
                                        size.value === 'personal' ? 'h-6 w-6' : size.value === 'medium' ? 'h-8 w-8' : 'h-10 w-10',
                                        selectedSize.value === size.value ? "text-[#EE1922] scale-110" : "text-muted-foreground"
                                    )} />
                                    <span className={cn("text-xs font-bold uppercase", selectedSize.value === size.value ? "text-[#EE1922]" : "text-muted-foreground")}>
                                        {size.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toppings Selection */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#EE1922]">ADD EXTRA FIRE (TOPPINGS)</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {TOPPINGS.map((topping) => {
                                const isSelected = !!selectedToppings.find(t => t.value === topping.value);
                                return (
                                    <button
                                        key={topping.value}
                                        onClick={() => toggleTopping(topping)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left",
                                            isSelected
                                                ? "border-[#F8B803] bg-[#F8B803]/5"
                                                : "border-muted hover:border-[#F8B803]/20"
                                        )}
                                    >
                                        <span className={cn("text-xs font-bold uppercase", isSelected ? "text-black" : "text-muted-foreground")}>
                                            {topping.label}
                                        </span>
                                        <div className={cn(
                                            "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                                            isSelected ? "bg-[#F8B803] border-[#F8B803]" : "border-muted-foreground/30"
                                        )}>
                                            {isSelected && <Check className="h-3 w-3 text-black stroke-[4]" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/50 border-t">
                    <div className="flex w-full items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Configuration</span>
                            <span className="text-2xl font-black italic text-[#EE1922]">${totalPrice.toFixed(2)}</span>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            className="h-14 px-8 bg-[#EE1922] hover:bg-[#D0161D] text-white font-black italic uppercase tracking-widest text-lg shadow-xl shadow-red-100"
                        >
                            ADD TO TRAY
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
