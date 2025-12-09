import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-blue-900/50 shadow-lg">
                                A
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Adplaze<span className="text-blue-500">.</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The smartest marketplace for Out-of-Home advertising.
                            Book billboards, digital screens, and transit media in minutes with AI-powered recommendations.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Platform</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/explore" className="hover:text-blue-400 transition-colors">Browse Spaces</Link></li>
                            <li><Link href="/wizard" className="hover:text-blue-400 transition-colors">AI Recommendation</Link></li>
                            <li><Link href="/dashboard/agency" className="hover:text-blue-400 transition-colors">List Your Space</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/case-studies" className="hover:text-blue-400 transition-colors">Case Studies</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/cancellation" className="hover:text-blue-400 transition-colors">Cancellation Policy</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <span>123 Ad Tech Park, Koramangala<br />Bangalore, KA 560034</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <span>hello@adplaze.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Adplaze Technologies Pvt Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <Link href="#" className="hover:text-white">Sitemap</Link>
                        <Link href="#" className="hover:text-white">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
