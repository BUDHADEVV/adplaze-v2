'use client'

import { Star, User } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

export function ReviewsModule() {
    const { data: session } = useSession()
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    // Dummy reviews for now since we just created schema
    const reviews = [
        { id: 1, user: 'Rahul K.', rating: 5, date: '2 days ago', text: 'Excellent location, high visibility during peak hours.' },
        { id: 2, user: 'Priya M.', rating: 4, date: '1 week ago', text: 'Good response from the agency owner. Easy booking process.' },
    ]

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                Reviews
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{reviews.length}</span>
            </h2>

            {/* List */}
            <div className="space-y-8 mb-10">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {review.user[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{review.user}</div>
                                    <div className="text-xs text-gray-500">{review.date}</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{review.text}</p>
                    </div>
                ))}
            </div>

            {/* Write Review */}
            <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                {session ? (
                    <div className="space-y-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-6 w-6 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            rows={3}
                            placeholder="Share your experience with this ad space..."
                        ></textarea>
                        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                            Submit Review
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">Please log in to leave a review.</p>
                )}
            </div>
        </div>
    )
}
