import { Search, MousePointerClick, CreditCard, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "SEARCH",
            desc: "Select your location & ad format filters",
            icon: Search,
            color: "bg-blue-600",
            iconColor: "text-blue-600"
        },
        {
            id: 2,
            title: "SELECT",
            desc: "Pick and bundle spaces that fit your campaign",
            icon: MousePointerClick,
            color: "bg-green-600",
            iconColor: "text-green-600"
        },
        {
            id: 3,
            title: "BOOK & PAY",
            desc: "Complete checkout—secure payment in seconds",
            icon: CreditCard,
            color: "bg-purple-600",
            iconColor: "text-purple-600"
        },
        {
            id: 4,
            title: "MONITOR",
            desc: "Track real-time performance & analytics",
            icon: BarChart3,
            color: "bg-orange-500",
            iconColor: "text-orange-500"
        }
    ]

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <div className="mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Simple Process</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">How AdPlaze Works</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Get your advertising campaign live in just four simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10"></div>

                    {steps.map((step) => (
                        <div key={step.id} className="relative group bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100">
                            <div className={`w-16 h-16 ${step.color} text-white rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                                {step.id}
                            </div>

                            <h3 className={`text-xl font-extrabold ${step.iconColor} mb-3 uppercase`}>{step.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[40px]">
                                {step.desc}
                            </p>

                            <div className="flex justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                <step.icon className={`h-10 w-10 ${step.iconColor}`} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16">
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-1"
                    >
                        Get Started Today <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

            </div>
        </section>
    )
}
