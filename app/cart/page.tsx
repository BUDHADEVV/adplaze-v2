'use client'

import { useCart } from "@/context/CartContext"
import { Navbar } from "@/components/Navbar"
import { Trash2, Calendar, ShieldCheck, ArrowRight, Lock } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { createBooking } from "@/app/actions"
import { useRouter } from "next/navigation"

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart()
    const { data: session } = useSession()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    // Calculate Subtotal
    const subtotal = cart.reduce((acc, item) => {
        const itemTotal = item.price * (item.days || 1)
        return acc + itemTotal
    }, 0)

    const gst = subtotal * 0.18
    const total = subtotal + gst

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any ad spaces yet.</p>
                    <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Browse Inventory
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalize Your Booking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => {
                            const itemTotal = item.price * (item.days || 1)
                            return (
                                <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-6">
                                    <div className="h-24 w-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                                <p className="text-sm text-gray-500">{item.address}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-medium">
                                                <Calendar className="h-4 w-4" />
                                                <span>{item.startDate}</span>
                                                <ArrowRight className="h-3 w-3" />
                                                <span>{item.endDate}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600 px-3 py-1 bg-gray-100 rounded-lg">
                                                <span className="font-bold">{item.days} Days</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-end">
                                        <div className="text-xs text-gray-400">Total for period</div>
                                        <div className="text-xl font-bold text-gray-900">₹{itemTotal.toLocaleString()}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Order Summary & Checkout Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-6 text-xl">Order Summary</h3>

                            <div className="space-y-3 text-sm text-gray-600 mb-6 border-b pb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee & Taxes (18%)</span>
                                    <span className="font-medium text-gray-900">₹{gst.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {!isCheckingOut ? (
                                <button
                                    onClick={() => setIsCheckingOut(true)}
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <CheckoutForm total={total} cart={cart} clearCart={clearCart} />
                            )}

                            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 justify-center">
                                <Lock className="h-3 w-3" />
                                Secure Checkout powered by Adplaze
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function CheckoutForm({ total, cart, clearCart }: any) {
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        if (!session?.user?.email) {
            alert("Please login first")
            setLoading(false)
            return
        }

        const bookingData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('billingAddress'), // collected but currently just stored in booking possibly
            cartItems: cart,
            totalPrice: total,
            userEmail: session.user.email
        }

        const result = await createBooking(bookingData)

        if (result.success) {
            clearCart()
            router.push('/my-orders?success=true')
        } else {
            alert("Booking Failed: " + result.message)
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input name="name" type="text" placeholder="John Doe" required className="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <input name="phone" type="tel" placeholder="+91 98765 43210" required className="w-full border rounded-lg p-2 text-sm" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Billing Address</label>
                <textarea name="billingAddress" placeholder="Company Address..." required className="w-full border rounded-lg p-2 text-sm h-20"></textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 flex items-center justify-center gap-2 mt-4"
            >
                {loading ? 'Processing...' : 'Book Now'}
            </button>
        </form>
    )
}
