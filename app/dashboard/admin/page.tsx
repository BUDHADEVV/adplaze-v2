import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Database, PlusCircle, Users, BarChart3, ArrowRight } from "lucide-react"
import { AgencyCreationForm } from "./AgencyCreationForm"
import { AdminGatekeeper } from "./AdminGatekeeper"
import { SpaceCreationForm } from "./SpaceCreationForm"
import { UserList } from "./UserList"
import { SpaceList } from "./SpaceList"
import { BookingList } from "./BookingList"
import { MapPin } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const bookings = await client.fetch(groq`*[_type == "booking"] | order(_createdAt desc){
        _id, status, startDate, endDate, totalPrice, _createdAt,
        contactDetails,
        space->{_id, title, address},
        advertiser->{name, email, phone}
    }`, {}, { cache: 'no-store' })
    // Fetch all users, sorted by newest first
    const users = await client.fetch(groq`*[_type == "user"] | order(_createdAt desc){
        _id, name, email, username, password, role, agencyProfile, _createdAt
    }`, {}, { cache: 'no-store' })

    // Fetch all spaces
    const spaces = await client.fetch(groq`*[_type == "adSpace"] | order(_createdAt desc){
        _id, title, price, type, address, _createdAt
    }`, {}, { cache: 'no-store' })

    const agencies = users.filter((u: any) => u.role === 'agency')

    return (
        <AdminGatekeeper>
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Actions & Stats (2/3 width) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <AdminCard
                                    title="Content"
                                    icon={<Database className="h-5 w-5 text-blue-600" />}
                                    href="/studio"
                                    actionText="CMS"
                                />
                                <AdminCard
                                    title="Bookings"
                                    icon={<BarChart3 className="h-5 w-5 text-green-600" />}
                                    href="/studio/structure/booking"
                                    actionText="View"
                                />
                                <AdminCard
                                    title="Users"
                                    icon={<Users className="h-5 w-5 text-purple-600" />}
                                    href="/studio/structure/user"
                                    actionText="Manage"
                                />
                            </div>

                            {/* Agency Creation Form */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <PlusCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Create Space Owner</h2>
                                        <p className="text-sm text-gray-500">Generate login credentials for new agencies.</p>
                                    </div>
                                </div>
                                <AgencyCreationForm />
                            </div>

                            {/* Space Creation Form */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">List New Ad Space</h2>
                                        <p className="text-sm text-gray-500">Create a listing and assign it to an agency.</p>
                                    </div>
                                </div>
                                <SpaceCreationForm agencies={agencies} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: User List (1/3 width) */}
                        <div className="lg:col-span-1 space-y-6">
                            <UserList users={users} />
                            <BookingList bookings={bookings} />
                            <SpaceList spaces={spaces} />
                        </div>

                    </div>
                </div>
            </div>
        </AdminGatekeeper>
    )
}

function AdminCard({ title, icon, href, actionText }: any) {
    return (
        <a href={href} target="_blank" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">{icon}</div>
                <span className="font-bold text-gray-700">{title}</span>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">{actionText}</span>
        </a>
    )
}
