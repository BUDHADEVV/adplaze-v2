'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search, ArrowRight, X } from "lucide-react"
import { getTrendingLocations } from "@/app/actions"

export default function LocationPromptModal() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [trending, setTrending] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getTrendingLocations().then(setTrending)
    }, [])

    const handleSearch = (location: string) => {
        if (!location) return
        setIsLoading(true)
        // Redirect to explore with location
        router.push(`/explore?location=${encodeURIComponent(location.split(',')[0])}`)
    }

    const filtered = query
        ? trending.filter(t => t.toLowerCase().includes(query.toLowerCase()))
        : trending.slice(0, 5)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Select Location
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Where would you like to advertise?
                    </p>
                </div>

                {/* Search Input */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search city (e.g. Kochi, Bangalore)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                        />
                    </div>
                </div>

                {/* Suggestions List */}
                <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {query ? 'Matches' : 'Trending Now'}
                    </div>

                    {filtered.map((loc, i) => (
                        <button
                            key={i}
                            onClick={() => handleSearch(loc)}
                            className="w-full text-left px-6 py-3 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group transition-colors"
                        >
                            <span className="font-medium text-gray-700 group-hover:text-blue-700">{loc}</span>
                            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 -translate-x-2 group-hover:translate-x-0 transition-transform opacity-0 group-hover:opacity-100" />
                        </button>
                    ))}

                    {filtered.length === 0 && (
                        <div className="p-6 text-center text-gray-500 text-sm">
                            No locations found. Try a major city name.
                        </div>
                    )}
                </div>

                {/* Footer */}
                {/* <div className="p-4 bg-gray-50 text-center">
                    <button 
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                    >
                        Go Back
                    </button>
                </div> */}
            </div>
        </div>
    )
}
