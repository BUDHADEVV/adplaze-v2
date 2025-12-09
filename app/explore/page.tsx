import { Navbar } from '@/components/Navbar'
import ExploreClient from '@/components/ExploreClient'
import { client } from '@/sanity/lib/client'
import { ALL_SPACES_QUERY } from '@/sanity/lib/queries'

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
    // Fetch data from Sanity
    // Note: If no Env vars or no data, this returns empty array
    // We should handle error slightly gracefully or allow build to pass with empty
    let spaces = []
    try {
        spaces = await client.fetch(ALL_SPACES_QUERY)
    } catch (e) {
        console.error("Failed to fetch spaces:", e)
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ExploreClient initialSpaces={spaces} />
            </div>
        </main>
    )
}
