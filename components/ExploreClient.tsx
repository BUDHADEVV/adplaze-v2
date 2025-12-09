'use client'

import { useState } from 'react'
import { ListingCard } from '@/components/ListingCard'
import { Filter, ChevronDown } from 'lucide-react'

// Types for props
interface AdSpace {
    _id: string
    title: string
    slug: { current: string }
    price: number
    type: string
    address: string
    imageUrl: string
    unavailableDates?: string[] // Assuming Sanity returns this array of YYYY-MM-DD
}

export default function ExploreClient({
    initialSpaces,
    initialLocation = '',
    initialDate = ''
}: {
    initialSpaces: AdSpace[],
    initialLocation?: string,
    initialDate?: string
}) {
    const [spaces, setSpaces] = useState(initialSpaces)
    const [filterType, setFilterType] = useState<string | 'all'>('all')
    const [priceRange, setPriceRange] = useState(50000)
    const [locationSearch, setLocationSearch] = useState(initialLocation)
    const [dateFilter, setDateFilter] = useState(initialDate)

    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Filter Logic
    const filteredSpaces = spaces.filter(space => {
        // 1. Type Match
        const typeMatch = filterType === 'all' || space.type === filterType

        // 2. Price Match
        const priceMatch = space.price <= priceRange

        // 3. Location Match (Address, City, District, or Title)
        // Ensure to handle missing fields gracefully
        const locationMatch = !locationSearch ||
            space.address?.toLowerCase().includes(locationSearch.toLowerCase()) ||
            (space as any).city?.toLowerCase().includes(locationSearch.toLowerCase()) ||
            (space as any).district?.toLowerCase().includes(locationSearch.toLowerCase()) ||
            space.title.toLowerCase().includes(locationSearch.toLowerCase())

        // 4. Availability Match
        // If a date is selected, the space must NOT include that date in 'unavailableDates'
        const dateMatch = !dateFilter ||
            !(space.unavailableDates || []).includes(dateFilter)

        return typeMatch && priceMatch && locationMatch && dateMatch
    })

    return (
        <div className="flex flex-col md:flex-row gap-8 relative">
            {/* Mobile Filter Toggle Bar */}
            <div className="md:hidden sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 -mx-4 px-4 py-3 flex items-center justify-between mb-4 shadow-sm">
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${showMobileFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
                <span className="text-xs font-medium text-gray-500">{filteredSpaces.length} Results</span>
            </div>

            {/* Sidebar Filters (Responsive) */}
            <aside className={`
                fixed inset-x-0 bottom-0 top-[140px] z-40 bg-white p-6 overflow-y-auto border-t border-gray-200 transition-transform duration-300 md:translate-y-0
                md:relative md:inset-auto md:w-64 md:block md:border-none md:p-0 md:bg-transparent md:overflow-visible md:top-auto
                ${showMobileFilters ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
            `}>
                <div className="bg-white md:p-6 md:rounded-xl md:border md:border-gray-200 md:shadow-sm md:sticky md:top-24 h-full md:h-auto">
                    <div className="flex items-center justify-between gap-2 mb-6 text-gray-900 md:hidden">
                        <h2 className="font-bold text-lg">Filter Inventory</h2>
                        <button onClick={() => setShowMobileFilters(false)} className="text-blue-600 font-bold text-sm">Done</button>
                    </div>

                    <div className="hidden md:flex items-center gap-2 mb-6 text-gray-900">
                        <Filter className="h-5 w-5" />
                        <h2 className="font-bold text-lg">Filters</h2>
                    </div>

                    {/* Type Filter */}
                    <div className="mb-8 md:mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Ad Type</h3>
                        <div className="space-y-3 md:space-y-2">
                            {['all', 'billboard', 'digital_screen', 'transit'].map(type => (
                                <label key={type} className="flex items-center gap-3 md:gap-2 cursor-pointer p-2 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-lg">
                                    <input
                                        type="radio"
                                        name="type"
                                        checked={filterType === type}
                                        onChange={() => setFilterType(type)}
                                        className="h-5 w-5 md:h-4 md:w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-600 capitalize text-base md:text-sm">{type.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8 md:mb-0">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Max Price / Day</h3>
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>₹1k</span>
                            <span className="font-bold text-blue-600">₹{priceRange.toLocaleString()}</span>
                            <span>₹100k+</span>
                        </div>
                    </div>

                    {/* Mobile Apply Button */}
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-8 md:hidden"
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>

            {/* Main Grid */}
            <div className="flex-1">
                <div className="mb-6 hidden md:flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Explore Inventory ({filteredSpaces.length})</h1>
                    <button className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600">
                        Sort by <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                </div>

                {filteredSpaces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSpaces.map(space => (
                            <ListingCard
                                key={space._id}
                                title={space.title}
                                price={space.price}
                                type={space.type}
                                address={space.address}
                                imageUrl={space.imageUrl}
                                slug={space.slug.current}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No spaces match your filters.</p>
                        <button
                            onClick={() => { setFilterType('all'); setPriceRange(100000) }}
                            className="mt-4 text-blue-600 font-medium hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
