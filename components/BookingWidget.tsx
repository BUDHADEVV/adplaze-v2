'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, ShoppingCart, Loader2 } from 'lucide-react'
import { useCart } from "@/context/CartContext"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Props {
    space: any
}

export function BookingWidget({ space }: Props) {
    const { addToCart } = useCart()
    const { data: session } = useSession()
    const router = useRouter()

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selection, setSelection] = useState<{ start: string | null; end: string | null }>({ start: null, end: null })
    const [added, setAdded] = useState(false)

    const blockedDates: string[] = space.availability || []

    // Helper: Format YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    // Calendar Generation
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const handleDateClick = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        if (blockedDates.includes(dateStr)) return // Ignore blocked

        if (!selection.start || (selection.start && selection.end)) {
            // Start new selection
            setSelection({ start: dateStr, end: null })
        } else {
            // Complete selection
            // Ensure end is after start
            if (new Date(dateStr) < new Date(selection.start)) {
                setSelection({ start: dateStr, end: selection.start })
            } else {
                setSelection({ ...selection, end: dateStr })
            }
        }
    }

    // Checking if a day is within range
    const isInRange = (day: number) => {
        if (!selection.start || !selection.end) return false
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return dateStr >= selection.start && dateStr <= selection.end
    }

    const isSelected = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return selection.start === dateStr || selection.end === dateStr
    }

    // Calculate Costs
    const calculateDays = () => {
        if (!selection.start || !selection.end) return 0
        const start = new Date(selection.start)
        const end = new Date(selection.end)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    const totalDays = calculateDays()
    const totalPrice = totalDays * space.price

    // Form Actions
    const handleAddToCart = () => {
        if (!session) return signIn('google')
        if (!selection.start || !selection.end) return alert("Please select a date range")

        addToCart({
            _id: space._id,
            title: space.title,
            price: space.price,
            imageUrl: space.imageUrls?.[0] || '',
            address: space.address,
            startDate: selection.start,
            endDate: selection.end,
            days: totalDays
        })

        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Calendar UI */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 w-full">
                <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                    <span>{monthNames[month]} {year}</span>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="h-5 w-5" /></button>
                        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </h3>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {[...Array(firstDayOfMonth)].map((_, i) => <div key={`e-${i}`} />)}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        const isBlocked = blockedDates.includes(dateStr)
                        const selected = isSelected(day)
                        const inRange = isInRange(day)

                        return (
                            <button
                                key={day}
                                disabled={isBlocked}
                                onClick={() => handleDateClick(day)}
                                className={`
                                    h-10 w-full flex items-center justify-center rounded-md text-sm transition-all relative
                                    ${isBlocked ? 'bg-red-50 text-red-300 opacity-50 cursor-not-allowed decoration-red-300 line-through' : 'hover:bg-blue-50 font-medium text-gray-700'}
                                    ${selected ? '!bg-blue-600 !text-white z-10 shadow-md' : ''}
                                    ${inRange && !selected ? 'bg-blue-100 text-blue-800' : ''}
                                `}
                            >
                                {day}
                            </button>
                        )
                    })}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Selected</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-300"></div> Unavailable</div>
                </div>
            </div>

            {/* Price & Action Panel */}
            <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Booking Summary</h3>
                    <p className="text-gray-500 text-sm mb-6">Select dates to calculate total cost</p>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Daily Rate</span>
                            <span className="font-medium">₹{space.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Duration</span>
                            <span className="font-medium">{totalDays > 0 ? `${totalDays} Days` : '-'}</span>
                        </div>
                        {selection.start && (
                            <div className="flex justify-between text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                <span>{selection.start}</span>
                                <span>to</span>
                                <span>{selection.end || '?'}</span>
                            </div>
                        )}
                        <div className="border-t pt-4 mt-2 flex justify-between items-end">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="text-3xl font-extrabold text-blue-600">
                                ₹{(totalPrice || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={!selection.start || !selection.end}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all
                            ${added ? 'bg-green-600 text-white' : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                        {added ? 'Added' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={() => { handleAddToCart(); router.push('/cart') }}
                        disabled={!selection.start || !selection.end}
                        className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    )
}
