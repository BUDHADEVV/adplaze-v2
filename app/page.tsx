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
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navbar />

      {/* 1. Category Navigation (Amazon Style) */}
      <div className="bg-white border-b shadow-sm sticky top-20 z-40 hidden md:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex gap-8">
              {[
                { name: 'All', icon: Layout },
                { name: 'Billboard', icon: Layout },
                { name: 'Digital Screens', icon: Monitor },
                { name: 'Transit Media', icon: Bus },
                { name: 'Street Furniture', icon: MapPin },
                { name: 'Airport Ads', icon: MapPin },
              ].map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors whitespace-nowrap">
                  {cat.name}
                </div>
              ))}
            </div>
            <div className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
              View All Categories
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto">

        {/* 2. Hero Carousel / Banner Area */}
        <div className="relative px-0 md:px-4 py-4">
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 md:rounded-xl overflow-hidden shadow-2xl relative min-h-[400px] md:min-h-[500px] flex items-center">

            {/* Abstract Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="relative z-10 px-6 md:px-16 w-full max-w-4xl">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-xs font-bold tracking-wider mb-6 backdrop-blur-md">
                🚀 NEW: AI MEDIA PLANNING
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                Dominate the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Real World.</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium mb-8 max-w-xl leading-relaxed">
                The world's first operating system for Out-Of-Home advertising.
                Book premium billboards, digital screens, and transit media in clicks, not weeks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/explore" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                  Start Booking <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/wizard" className="px-8 py-4 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" /> AI Recommendation
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Stats Card (Absolute) */}
          <div className="hidden lg:block absolute right-16 bottom-16 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-80 shadow-2xl">
            <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                A+
              </div>
              <div>
                <div className="text-white font-bold">Verified Inventory</div>
                <div className="text-blue-200 text-xs">All spaces audit-checked</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">50k+</div>
                <div className="text-xs text-gray-300 uppercase tracking-widest">Screens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">120+</div>
                <div className="text-xs text-gray-300 uppercase tracking-widest">Cities</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Value Props (Icon Strip) */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 bg-white border-y border-gray-100 mb-8 shadow-sm">
          {[
            { label: 'Direct Pricing', sub: 'Zero hidden fees', icon: ShoppingBag },
            { label: 'Verified Owners', sub: '100% Legit Inventory', icon: Star },
            { label: 'Instant Booking', sub: 'Real-time availability', icon: Zap },
            { label: 'Secure Payments', sub: 'Bank grade security', icon: Monitor },
          ].map((prop) => (
            <div key={prop.label} className="p-6 flex items-center justify-center gap-4 group cursor-default">
              <prop.icon className="h-8 w-8 text-gray-300 group-hover:text-blue-600 transition-colors" />
              <div>
                <div className="font-bold text-gray-900">{prop.label}</div>
                <div className="text-xs text-gray-500">{prop.sub}</div>
              </div>
            </div>
          ))}
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

      {/* Bottom Nav (Mobile Only) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden flex justify-around py-3 z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1 text-blue-600">
          <Layout className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <Monitor className="h-5 w-5" />
          <span className="text-[10px] font-medium">Play</span>
        </div>
        <Link href="/explore" className="flex flex-col items-center gap-1 text-gray-400">
          <Layout className="h-5 w-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Account</span>
        </div>
        <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-400">
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
      </div>
    </div>
  )
}
