'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { toggleAvailability } from './actions'

interface Props {
    spaceId: string
    initialBlockedDates: string[]
    readOnly?: boolean
}

export function AvailabilityCalendar({ spaceId, initialBlockedDates, readOnly = false }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [blockedDates, setBlockedDates] = useState<string[]>(initialBlockedDates || [])
    const [loading, setLoading] = useState(false)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const handleDateClick = async (day: number) => {
        if (readOnly || loading) return // Prevent edits in read-only mode

        // Format YYYY-MM-DD
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        // Optimistic update
        const isBlocked = blockedDates.includes(dateStr)
        const newBlocked = isBlocked
            ? blockedDates.filter(d => d !== dateStr)
            : [...blockedDates, dateStr]

        setBlockedDates(newBlocked)
        setLoading(true)

        const result = await toggleAvailability(spaceId, dateStr, blockedDates)

        if (!result.success) {
            // Revert on failure
            setBlockedDates(blockedDates)
            alert("Failed to update: " + result.error)
        }
        setLoading(false)
    }

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">{monthNames[month]} {year}</h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="h-5 w-5" /></button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="h-5 w-5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-gray-400 font-medium">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const isBlocked = blockedDates.includes(dateStr)
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            disabled={loading || readOnly}
                            className={`
                                h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all
                                ${isBlocked
                                    ? 'bg-red-500 text-white hover:bg-red-600' // Explicit RED for blocked
                                    : 'bg-green-100 text-green-700 hover:bg-green-200' // Explicit GREEN for available
                                }
                                ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                                ${readOnly ? 'cursor-default' : 'cursor-pointer'}
                            `}
                        >
                            {loading && isBlocked ? <Loader2 className="h-3 w-3 animate-spin" /> : day}
                        </button>
                    )
                })}
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-gray-500 justify-center border-t pt-4">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
                    <span>Booked / Unavailable</span>
                </div>
            </div>
        </div>
    )
}
