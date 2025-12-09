import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { MapPin, ArrowRight, Camera } from 'lucide-react'

// Placeholder for Sanity Image Builder if urlFor is not ready/working
// In a real app we need the image builder configured. 
// For now I'll use a safe fallback or assume urlFor works if configured (I haven't written lib/image.ts yet! I should).

interface ListingCardProps {
    title: string
    price: number
    type: string
    address: string
    imageUrl?: string
    slug: string
}

export function ListingCard({ title, price, type, address, imageUrl, slug }: ListingCardProps) {
    return (
        <Link href={`/space/${slug}`} className="group block bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                        <Camera className="h-8 w-8 opacity-20" />
                    </div>
                )}

                {/* Floating Badge */}
                <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm border border-white/20">
                        {type.replace('_', ' ')}
                    </div>
                </div>

                {/* Price Tag Overlay on bottom right */}
                <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                    ₹{price.toLocaleString()}<span className="text-xs font-normal text-gray-300">/day</span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 truncate tracking-tight">{title}</h3>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate">{address || 'Location varies'}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        INSTANT BOOK
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium group-hover:translate-x-1 transition-transform">
                        View Details <ArrowRight className="h-3 w-3" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
