import { client } from "@/sanity/lib/client"
import { SPACE_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { Navbar } from "@/components/Navbar"
import { BookingWidget } from "@/components/BookingWidget"
import { SpaceActions } from "@/components/SpaceActions"
import { ReviewsModule } from "@/components/ReviewsModule"
import { MapPin, Target, Info, Share2, Heart, Star } from "lucide-react"

export default async function SpaceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const space = await client.fetch(SPACE_BY_SLUG_QUERY, { slug }, { cache: 'no-store' })

    if (!space) return <div className="p-20 text-center">Space Not Found</div>

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Info */}
                <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {space.type}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-4 mb-2 tracking-tight">{space.title}</h1>
                        <div className="flex items-center text-gray-500 text-lg">
                            <MapPin className="h-5 w-5 mr-1 text-gray-400" /> {space.address}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <SpaceActions
                            spaceId={space._id}
                            title={space.title}
                            url={`https://adplaze.com/space/${space.slug.current || space.slug}`} // Mock domain for now
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* LEFT COLUMN: Gallery & Info (2/3) */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                {space.imageUrls?.[0] && (
                                    <img src={space.imageUrls[0]} alt={space.title} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {space.imageUrls?.slice(1).map((img: string, i: number) => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-lg">
                                    <Info className="h-5 w-5 text-blue-500" /> Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    {space.description || "No description provided for this ad space."}
                                </p>
                            </div>

                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-lg">
                                    <Target className="h-5 w-5 text-purple-500" /> Target Audience
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {space.demographics?.map((d: string) => (
                                        <span key={d} className="px-4 py-2 bg-purple-50 text-purple-700 text-sm rounded-full font-bold capitalize border border-purple-100">
                                            {d.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* REVIEWS SECTION */}
                        <ReviewsModule />
                    </div>

                    {/* RIGHT COLUMN: Booking Widget (1/3) sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-6">
                                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Price per Day</p>
                                        <p className="text-3xl font-extrabold text-gray-900">₹{space.price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Managed By</p>
                                        <p className="font-medium text-gray-700">{space.owner?.agencyProfile?.companyName || 'Verified Partner'}</p>
                                    </div>
                                </div>

                                {/* The Booking Interaction */}
                                <BookingWidget space={space} />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                                <strong>Buyer Protection</strong>: Payments are held in escrow until your campaign is live.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-20"></div> {/* Spacer */}
            </div>
        </div>
    )
}
