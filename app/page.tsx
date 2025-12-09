import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { HowItWorks } from "@/components/HowItWorks"
import { ListingCard } from "@/components/ListingCard"
import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { ArrowRight, Monitor, MapPin, Bus, Layout, Sparkles, User, ShoppingBag, Zap, Star } from "lucide-react"

// Queries
const FEATURED_QUERY = groq`*[_type == "adSpace" && type == "billboard"][0...4]{
  _id, title, price, type, address, "imageUrl": images[0].asset->url, "slug": slug.current
}`

const PREMIUM_QUERY = groq`*[_type == "adSpace" && type == "digital_screen"][0...4]{
  _id, title, price, type, address, "imageUrl": images[0].asset->url, "slug": slug.current
}`

export default async function Home() {
  const featuredSpaces = await client.fetch(FEATURED_QUERY)
  const premiumSpaces = await client.fetch(PREMIUM_QUERY)

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 overflow-x-hidden">
      <Navbar />


      <div className="max-w-[1440px] mx-auto relative">

        {/* 2. Hero Carousel / Banner Area */}
        <div className="relative px-0 md:px-4 py-0 md:py-4">
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 md:rounded-3xl overflow-hidden shadow-2xl relative min-h-[450px] md:min-h-[550px] flex items-center pb-20 md:pb-0">

            {/* Abstract Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            <div className="relative z-10 px-6 md:px-16 w-full max-w-4xl pt-10 md:pt-0">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-[10px] md:text-xs font-bold tracking-wider mb-6 backdrop-blur-md">
                🚀 AI-POWERED OOH OS
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-xl tracking-tight">
                Dominate the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Real World.</span>
              </h1>
              <p className="text-gray-300 text-base md:text-xl font-medium mb-8 max-w-xl leading-relaxed">
                Book premium billboards, digital screens, and transit media in clicks.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/explore" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 w-full sm:w-auto active:scale-95">
                  Start Booking <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/wizard" className="px-8 py-4 rounded-xl font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto active:scale-95">
                  <Sparkles className="h-5 w-5 text-yellow-400" /> AI Plan
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Floating Category Grid (Super App Style) */}
        <div className="px-4 -mt-16 md:-mt-20 relative z-20 mb-12">
          <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Billboards', icon: Layout, color: 'bg-blue-500', href: '/explore?type=billboard' },
              { label: 'Screens', icon: Monitor, color: 'bg-purple-500', href: '/explore?type=digital_screen' },
              { label: 'Transit', icon: Bus, color: 'bg-green-500', href: '/explore?type=transit' },
              { label: 'All Spaces', icon: MapPin, color: 'bg-indigo-500', href: '/explore' },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href} className="group flex flex-col items-center gap-2">
                <div className={`h-14 w-14 md:h-20 md:w-20 ${cat.color} rounded-2xl md:rounded-3xl shadow-lg shadow-black/20 flex items-center justify-center text-white transform transition-transform group-hover:scale-110 group-active:scale-95 border-4 border-white`}>
                  <cat.icon className="h-6 w-6 md:h-9 md:w-9" />
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-16">

          {/* 4. "Deal of the Day" Style - Featured Spaces */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending Now</h2>
                <p className="text-gray-500 mt-1">Most viewed spaces in Bangalore today</p>
              </div>
              <Link href="/explore" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSpaces.map((space: any) => (
                <ListingCard key={space._id} {...space} />
              ))}
            </div>
          </section>

          {/* 5. Large Banner / Call to Action */}
          <div className="rounded-2xl overflow-hidden bg-black text-white grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
            <div className="p-12 flex flex-col justify-center">
              <div className="inline-block bg-yellow-500 text-black font-bold px-3 py-1 rounded text-xs mb-6 w-fit">
                PREMIUM COLLECTION
              </div>
              <h3 className="text-4xl font-bold mb-4">Digital Screens at <br />Tech Parks</h3>
              <p className="text-gray-400 text-lg mb-8">
                Target high-intent tech professionals in Bangalore, Hyderabad & Pune.
                Programmatic slots available from ₹500/hour.
              </p>
              <Link href="/explore?type=digital_screen" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors w-fit">
                Browse Locations
              </Link>
            </div>
            <div className="bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center h-64 md:h-auto opacity-80"></div>
          </div>

          {/* 6. "Prime" Collection - Premium Spaces */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-amber-200 to-yellow-500 text-yellow-900 font-black px-2 py-0.5 rounded text-xs tracking-wider">
                ADPLAZE GOLD
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Premium Inventory</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumSpaces.length > 0 ? premiumSpaces.map((space: any) => (
                <ListingCard key={space._id} {...space} />
              )) : (
                <div className="col-span-4 py-12 text-center bg-gray-50 rounded-xl border-dashed border-2 border-gray-200 text-gray-400">
                  More premium inventory launching next week.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 7. Footer & Mobile Nav */}
      <div className="mt-20">
        <HowItWorks />
        <Footer />
      </div>
    </div>
  )
}
