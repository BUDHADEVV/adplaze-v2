import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Navbar } from "@/components/Navbar"
import { format } from "date-fns"
import { Calendar, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function MyOrdersPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    // Await params if accessing properties directly, but searchParams is a Promise in Next 15 page props
    const params = await searchParams
    const showSuccess = params.success === 'true'

    if (!email) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <p>Please log in to view orders.</p>
                </div>
            </div>
        )
    }

    const bookings = await client.fetch(groq`
        *[_type == "booking" && advertiser->email == $email] | order(_createdAt desc) {
            _id, status, startDate, endDate, totalPrice, _createdAt,
            space->{title, address, "imageUrl": images[0].asset->url}
        }
    `, { email }, { cache: 'no-store' })

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {showSuccess && (
                    <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 animate-in slide-in-from-top-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                            <h3 className="font-bold">Booking Successful!</h3>
                            <p className="text-sm">Your ad spaces have been reserved. The space owner will confirm shortly.</p>
                        </div>
                    </div>
                )}

                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                <div className="space-y-6">
                    {bookings.length > 0 ? bookings.map((booking: any) => (
                        <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {booking.space?.imageUrl && (
                                    <img src={booking.space.imageUrl} alt={booking.space.title} className="w-full h-full object-cover" />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-gray-900">{booking.space?.title || 'Unknown Space'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                    <MapPin className="h-4 w-4" />
                                    {booking.space?.address}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-6 text-sm">
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold">Duration</div>
                                        <div className="flex items-center gap-2 mt-1 font-medium text-gray-700">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold">Total Price</div>
                                        <div className="mt-1 font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold">Order ID</div>
                                        <div className="mt-1 font-mono text-gray-500">#{booking._id.slice(-6)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">No recent orders.</p>
                            <Link href="/" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Start Booking</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
