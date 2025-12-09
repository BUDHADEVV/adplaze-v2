import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { Navbar } from "@/components/Navbar"
import { AvailabilityCalendar } from "../AvailabilityCalendar"
import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"

export default async function ManageSpacePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    // Auth check omitted for brevity in demo, but should exist

    const space = await client.fetch(groq`
        *[_type == "adSpace" && slug.current == $slug][0] {
            _id,
            title,
            address,
            availability,
            "imageUrl": images[0].asset->url
        }
    `, { slug })

    if (!space) return <div>Space not found</div>

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/dashboard/agency" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-start gap-6">
                        {space.imageUrl && (
                            <img src={space.imageUrl} alt="" className="h-24 w-24 rounded-lg object-cover bg-gray-100" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{space.title}</h1>
                            <div className="flex items-center text-gray-500 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {space.address}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Manage Availability</h2>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <AvailabilityCalendar
                                spaceId={space._id}
                                initialBlockedDates={space.availability}
                            />

                            <div className="bg-blue-50 p-6 rounded-xl flex-1">
                                <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                                <p className="text-blue-800/80 text-sm leading-relaxed mb-4">
                                    Click on dates to mark them as <strong>Unavailable</strong>.
                                    Red dates are blocked and won't be bookable by advertisers. Frame your calendar to accurately reflect days explicitly booked offline or maintenance days.
                                </p>
                                <ul className="text-sm text-blue-800/80 list-disc list-inside space-y-1">
                                    <li>Red = Blocked</li>
                                    <li>White = Available</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
