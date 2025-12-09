'use client'

import { useState } from 'react'
import { MapPin, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'
import { CreateListingModal } from './CreateListingModal'

export function AgencySpaceList({ spaces, userEmail, userId }: { spaces: any[], userEmail: string, userId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // UserID logic: In a real app we'd pass the actual user ID from the session more cleanly.
    // For now, we will pass it from the server page if available, or try to infer.
    // Ideally the server page fetches the user doc to get the _id.

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" /> Your Ad Spaces
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Space
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {spaces.length > 0 ? spaces.map((space: any) => (
                    <div key={space._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-100 relative">
                            {space.imageUrl ? (
                                <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                            )}
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                {space.type?.replace('_', ' ')}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{space.title}</h3>
                            <div className="flex gap-2 mt-4">
                                <Link
                                    href={`/dashboard/agency/${space.slug.current}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
                                >
                                    <Calendar className="h-4 w-4" />
                                    Availability
                                </Link>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-2 text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">You haven't listed any spaces yet.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            List your first space now
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && userId && (
                <CreateListingModal ownerId={userId} onClose={() => setIsModalOpen(false)} />
            )}

            {/* Fallback if no user ID (shouldn't happen if logged in properly) */}
            {isModalOpen && !userId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-xl">
                        <p className="text-red-600">Error: Could not identify user ID. Please re-login.</p>
                        <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-gray-200 px-4 py-2 rounded">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}
