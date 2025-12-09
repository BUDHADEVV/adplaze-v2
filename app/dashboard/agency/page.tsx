import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Plus, Calendar, Settings, MapPin, Users } from "lucide-react"
import { BookingList } from "../admin/BookingList"

export default async function AgencyDashboard() {
    const session = await getServerSession(authOptions)

    // @ts-ignore
    if (!session || session.user?.role !== 'agency') {
        // redirect('/') // or show unauthorized
        // For demo, allowing if role is missing but usually strict
    }

    const email = session?.user?.email

    // Fetch spaces owned by this agency
    const spaces = email ? await client.fetch(groq`
    *[_type == "adSpace" && owner->email == $email] {
        _id,
        title,
        slug,
        type,
        images,
        "imageUrl": images[0].asset->url,
        availability
    }
  `, { email }) : []

    // Fetch bookings for spaces owned by this agency
    const bookings = email ? await client.fetch(groq`
        *[_type == "booking" && space->owner->email == $email] | order(_createdAt desc) {
            _id, status, startDate, endDate, totalPrice, _createdAt,
            contactDetails,
            space->{_id, title, address},
            advertiser->{name, email, phone}
        }
    `, { email }, { cache: 'no-store' }) : []

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Agency Dashboard</h1>
                        <p className="text-gray-500">Manage your inventory and availability.</p>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content: Spaces (2/3) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-gray-500" /> Your Ad Spaces
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {spaces.length > 0 ? spaces.map((space: any) => (
                                <div key={space._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="h-48 bg-gray-100 relative">
                                        {space.imageUrl && (
                                            <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {space.type?.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{space.title}</h3>
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
                                    <p className="text-sm text-gray-400">Contact Admin to get listed.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Bookings (1/3) */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-500" /> Incoming Bookings
                        </h2>
                        <BookingList bookings={bookings} />
                    </div>
                </div>
            </div>
        </div>
    )
}
