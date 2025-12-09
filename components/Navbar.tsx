'use client'

import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, Mic, Camera, MapPin, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import { getTrendingLocations } from '@/app/actions'

import { usePathname, useSearchParams } from 'next/navigation'

export function Navbar() {
    const { data: session } = useSession()
    const { totalItems } = useCart()
    const pathname = usePathname()
    const searchParams = useSearchParams() // Hook to read URL params
    const isDashboard = pathname?.startsWith('/dashboard')

    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [trendingLocations, setTrendingLocations] = useState<string[]>([])

    // Sync URL Location to Search Box
    useEffect(() => {
        const locationParam = searchParams?.get('location')
        if (locationParam) {
            setSearchQuery(locationParam)
        }
    }, [searchParams])

    // Sync URL Location to Search Box
    useEffect(() => {
        const locationParam = searchParams?.get('location')
        if (locationParam) {
            setSearchQuery(locationParam)
        }
    }, [searchParams])

    useEffect(() => {
        getTrendingLocations().then(locs => setTrendingLocations(locs))
    }, [])

    const filteredSuggestions = searchQuery
        ? trendingLocations.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
        : trendingLocations.slice(0, 5) // Show top 5

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-8">

                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg group-hover:scale-110 transition-transform">
                            A
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                            Adplaze<span className="text-blue-600">.</span>
                        </span>
                    </Link>

                    {/* CENTER SECTION - Search Bar */}
                    {!isDashboard && (
                        <div className="flex-1 max-w-2xl mx-auto px-4 md:px-0 relative">
                            {/* Mobile Search Trigger / Compact Bar */}
                            <div className="md:hidden w-full">
                                <Link href="/explore" className="flex items-center gap-2 bg-gray-100/50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-500 w-full active:scale-95 transition-transform">
                                    <Search className="h-4 w-4" />
                                    <span>Search locations in India...</span>
                                </Link>
                            </div>

                            {/* Desktop Full Search */}
                            <form action="/explore" className="hidden md:flex relative w-full group items-center bg-gray-50 border-2 border-transparent rounded-2xl p-1 focus-within:bg-white focus-within:border-blue-100 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-sm">
                                {/* Location Input */}
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Search by Location (e.g. Koramangala, Bangalore)"
                                        className="block w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm font-medium"
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoComplete="off"
                                        value={searchQuery}
                                        suppressHydrationWarning
                                    />
                                </div>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-md shadow-blue-200" suppressHydrationWarning>
                                    Search
                                </button>
                            </form>

                            {/* Search Suggestions Dropdown */}
                            {isSearchFocused && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 hidden md:block">
                                    <div className="p-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {searchQuery ? 'Suggestions' : 'Trending in India'}
                                    </div>
                                    {filteredSuggestions.map((city, i) => (
                                        <Link
                                            key={i}
                                            href={`/explore?location=${city.split(',')[0]}`}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm text-gray-700 font-medium"
                                        >
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            {city}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RIGHT SECTION - Actions */}
                    <div className="flex items-center gap-6">

                        {/* Desktop Nav Links (Hidden on Dashboard) */}
                        {!isDashboard && (
                            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                                <Link href="/explore" className="hover:text-blue-600 transition-colors">Explore</Link>
                                <Link href="/wizard" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Get Bundle</span>
                                </Link>
                            </div>
                        )}

                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                        {/* Cart & Auth */}
                        <div className="flex items-center gap-4">
                            {!isDashboard && (
                                <Link href="/cart" className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                    <ShoppingBag className="h-6 w-6" />
                                    {totalItems > 0 && (
                                        <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                                    )}
                                </Link>
                            )}

                            {session ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                                        className="flex items-center gap-3 focus:outline-none"
                                    >
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs font-bold text-gray-900">{session.user?.name}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                {/* @ts-ignore */}
                                                {isDashboard ? 'Dashboard Mode' : (session.user?.role === 'agency' ? 'Space Owner' : session.user?.role === 'admin' ? 'Admin' : 'Advertiser')}
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold cursor-pointer hover:bg-indigo-100 transition-colors">
                                            {session.user?.name?.[0]}
                                        </div>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                            <div className="px-4 py-2 border-b border-gray-50 md:hidden">
                                                <div className="font-bold text-gray-900">{session.user?.name}</div>
                                                <div className="text-xs text-gray-500">{session.user?.email}</div>
                                            </div>

                                            {/* @ts-ignore */}
                                            {session.user?.role !== 'agency' && session.user?.role !== 'admin' && (
                                                <Link href="/my-orders" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    My Orders
                                                </Link>
                                            )}

                                            {/* @ts-ignore */}
                                            {session.user?.role === 'agency' && (
                                                <Link href="/dashboard/agency" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                                    <MapPin className="h-4 w-4" />
                                                    Agency Dashboard
                                                </Link>
                                            )}

                                            {/* @ts-ignore */}
                                            {session.user?.role === 'admin' && (
                                                <Link href="/dashboard/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                                    <User className="h-4 w-4" />
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => {
                                                    console.log("Signing out...")
                                                    signOut({ callbackUrl: '/' })
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn('google')}
                                    className="hidden md:flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Log In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
