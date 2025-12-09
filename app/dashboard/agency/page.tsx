import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { Navbar } from "@/components/Navbar"
import { Users } from "lucide-react"
import { BookingList } from "../admin/BookingList"
import { AgencySpaceList } from "./AgencySpaceList" // Client Component for Space List + Add Button

export const dynamic = 'force-dynamic'

export default async function AgencyDashboard() {
    const session = await getServerSession(authOptions)

    // @ts-ignore
    if (!session || session.user?.role !== 'agency') {
        // redirect('/') // or show unauthorized
        // For demo, allowing if role is missing but usually strict
    }

    const email = session?.user?.email

    // Fetch the User ID for this agency
    const userDoc = email ? await client.fetch(groq`*[_type == "user" && email == $email][0]{_id}`, { email }) : null

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
                        {/* We need the User's SANITY ID to link the new space to them. 
                            The session only has email. We need to fetch the _id. 
                        */}
                        <AgencySpaceList spaces={spaces} userEmail={email || ''} userId={userDoc?._id || ''} />
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
