'use client'

import { useCart, CartItem } from "@/context/CartContext"
import { ShoppingCart, Check } from "lucide-react"
import { useSession, signIn } from "next-auth/react" // Import auth hooks
import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddToCartButton({ space }: { space: any }) {
    const { data: session } = useSession() // Hook to check session
    const { addToCart } = useCart()
    const [added, setAdded] = useState(false)
    const router = useRouter()

    const handleAdd = () => {
        if (!session) {
            signIn('google')
            return
        }

        addToCart({
            _id: space._id,
            title: space.title,
            price: space.price,
            imageUrl: space.imageUrls?.[0] || '',
            address: space.address
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const handleBookNow = () => {
        handleAdd()
        router.push('/cart')
    }

    return (
        <div className="flex gap-4">
            <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
                    ${added ? 'bg-green-600 text-white' : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'}
                `}
            >
                {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                {added ? 'Added' : 'Add to Cart'}
            </button>
            <button
                onClick={handleBookNow}
                className="flex-1 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
                Book Now
            </button>
        </div>
    )
}
