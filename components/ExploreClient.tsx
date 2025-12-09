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

    // Filter Logic
    const filteredSpaces = spaces.filter(space => {
        // 1. Type Match
        const typeMatch = filterType === 'all' || space.type === filterType

        // 2. Price Match
        const priceMatch = space.price <= priceRange

        // 3. Location Match (Case insensitive check on Address or Title)
        const locationMatch = !locationSearch ||
            space.address?.toLowerCase().includes(locationSearch.toLowerCase()) ||
            space.title.toLowerCase().includes(locationSearch.toLowerCase())

        // 4. Availability Match
        // If a date is selected, the space must NOT include that date in 'unavailableDates'
        const dateMatch = !dateFilter ||
            !(space.unavailableDates || []).includes(dateFilter)

        return typeMatch && priceMatch && locationMatch && dateMatch
    })

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-gray-900">
                        <Filter className="h-5 w-5" />
                        <h2 className="font-bold text-lg">Filters</h2>
                    </div>

                    {/* Type Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Ad Type</h3>
                        <div className="space-y-2">
                            {['all', 'billboard', 'digital_screen', 'transit'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        checked={filterType === type}
                                        onChange={() => setFilterType(type)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
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
                </div>
            </aside>

            {/* Main Grid */}
            <div className="flex-1">
                <div className="mb-6 flex justify-between items-center">
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
