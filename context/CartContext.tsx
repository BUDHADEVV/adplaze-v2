'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
    _id: string
    title: string
    price: number
    imageUrl: string
    address: string
    days?: number
    startDate?: string
    endDate?: string
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: string) => void
    clearCart: () => void
    totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('adplaze_cart')
        if (saved) {
            try {
                setCart(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('adplaze_cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            if (prev.find(i => i._id === item._id)) return prev // No duplicates
            return [...prev, item]
        })
    }

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i._id !== itemId))
    }

    const clearCart = () => setCart([])

    const totalItems = cart.length

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within CartProvider")
    return context
}
