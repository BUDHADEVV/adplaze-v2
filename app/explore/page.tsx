import { Navbar } from '@/components/Navbar'
import ExploreClient from '@/components/ExploreClient'
import { client } from '@/sanity/lib/client'
import { ALL_SPACES_QUERY } from '@/sanity/lib/queries'
import LocationPromptModal from "./LocationPromptModal"
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function ExplorePage(props: { searchParams: Promise<{ location?: string, type?: string }> }) {
    const searchParams = await props.searchParams
    const { location } = searchParams

    // GATED VIEW: If no location selected, show the "Ask Place First" view
    if (!location) {
        return (
            <main className="min-h-screen bg-slate-50 relative">
                <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
                    <Navbar />
                </Suspense>

                {/* Blur Background content to simulate "behind modal" */}
                {/* We render a fake grid to make it look like the app is loaded but waiting */}
                <div className="max-w-7xl mx-auto px-4 py-8 blur-sm pointer-events-none opacity-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>

                {/* The Actual "Small Standard Pop Up" */}
                <LocationPromptModal />
            </main>
        )
    }

    // IF LOCATION IS PRESENT: Show Results
    let spaces = []
    try {
        // Optimization: We could filter by location in the QUERY itself for performance
        // For now, fetching all and filtering on client (as per V1 architecture)
        spaces = await client.fetch(ALL_SPACES_QUERY)
    } catch (e) {
        console.error("Failed to fetch spaces:", e)
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
                <Navbar />
            </Suspense>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 
                Pass searchParams to Client to initialize filtering state 
            */}
                <ExploreClient
                    initialSpaces={spaces}
                    initialLocation={location}
                />
            </div>
        </main>
    )
}
