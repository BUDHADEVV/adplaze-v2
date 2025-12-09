import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { MapPin, ArrowRight } from 'lucide-react'

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
        <Link href={`/space/${slug}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-48 w-full bg-gray-200">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wide text-gray-700">
                    {type.replace('_', ' ')}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 truncate">{title}</h3>

                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{address || 'Location varies'}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">From</span>
                        <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">/day</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
