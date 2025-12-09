'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { ListingCard } from '@/components/ListingCard'
import { Sparkles, ArrowRight, Target, Users, Wallet, CheckCircle } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export default function AIWizardPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any[]>([])

    // Form State
    const [formData, setFormData] = useState({
        businessType: '',
        audience: [] as string[],
        budget: 50000,
        goal: ''
    })

    const handleNext = () => {
        if (step === 3) {
            generateRecommendations()
        } else {
            setStep(prev => prev + 1)
        }
    }

    const generateRecommendations = async () => {
        setLoading(true)
        setStep(4) // Loading/Results step

        // Mock AI Logic: Fetch all and filter client side for Demo
        // In real app, we would use embeddings or complex GROQ
        try {
            const query = groq`*[_type == "adSpace"] {
                 _id, title, slug, type, price, address, 
                 "imageUrl": images[0].asset->url,
                 demographics
            }`
            const allSpaces = await client.fetch(query)

            // Simple Scoring Algorithm
            const scored = allSpaces.map((space: any) => {
                let score = 0
                // Match Budget
                if (space.price <= formData.budget) score += 5

                // Match Audience
                const matches = space.demographics?.filter((d: string) => formData.audience.includes(d)).length || 0
                score += matches * 3

                // Penalize if no match
                if (matches === 0 && formData.audience.length > 0) score -= 2

                return { ...space, score }
            }).sort((a: any, b: any) => b.score - a.score).slice(0, 3) // Top 3

            setResults(scored)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const toggleAudience = (aud: string) => {
        setFormData(prev => ({
            ...prev,
            audience: prev.audience.includes(aud)
                ? prev.audience.filter(a => a !== aud)
                : [...prev.audience, aud]
        }))
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-12">

                {/* Progress */}
                <div className="mb-12">
                    <div className="flex justify-between mb-2">
                        <span className={`text-sm font-bold ${step >= 1 ? 'text-blue-600' : 'text-gray-300'}`}>Business</span>
                        <span className={`text-sm font-bold ${step >= 2 ? 'text-blue-600' : 'text-gray-300'}`}>Audience</span>
                        <span className={`text-sm font-bold ${step >= 3 ? 'text-blue-600' : 'text-gray-300'}`}>Budget</span>
                        <span className={`text-sm font-bold ${step >= 4 ? 'text-blue-600' : 'text-gray-300'}`}>Results</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${step * 25}%` }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] relative">
                    {/* Header */}
                    {step < 4 && (
                        <div className="text-center mb-10">
                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Let's find your perfect space</h1>
                            <p className="text-gray-500">Answer 3 questions to get AI-powered suggestions.</p>
                        </div>
                    )}

                    {/* Step 1: Business Type */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                            <label className="block font-medium text-gray-700">What is your business category?</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Retail', 'Tech / Startups', 'Real Estate', 'Education', 'Events', 'Healthcare'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, businessType: type })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all
                                            ${formData.businessType === type
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-blue-300 text-gray-600'}
                                        `}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Audience */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                            <label className="block font-medium text-gray-700">Who is your target audience? (Select multiple)</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['students', 'professionals', 'families', 'tourists', 'gen_z', 'hnw'].map(aud => (
                                    <button
                                        key={aud}
                                        onClick={() => toggleAudience(aud)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center
                                            ${formData.audience.includes(aud)
                                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                : 'border-gray-200 hover:border-purple-300 text-gray-600'}
                                        `}
                                    >
                                        <span className="capitalize">{aud.replace('_', ' ')}</span>
                                        {formData.audience.includes(aud) && <CheckCircle className="h-5 w-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Budget */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                            <label className="block font-medium text-gray-700">What is your daily budget?</label>
                            <div className="px-4 py-8">
                                <input
                                    type="range"
                                    min="1000"
                                    max="100000"
                                    step="1000"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="text-center mt-6">
                                    <span className="text-4xl font-bold text-gray-900">₹{formData.budget.toLocaleString()}</span>
                                    <span className="text-gray-500 ml-2">/ day</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && (
                        <div className="animate-in fade-in zoom-in-95">
                            {loading ? (
                                <div className="text-center py-20">
                                    <Sparkles className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
                                    <h2 className="text-xl font-bold">Analyzing Demographics...</h2>
                                    <p className="text-gray-500">Matching your profile with 500+ spaces.</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Top 3 Recommendations</h2>
                                        <p className="text-gray-600">Based on your target of <strong>{formData.audience.join(', ')}</strong></p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {results.map((space, idx) => (
                                            <div key={space._id} className="relative">
                                                {idx === 0 && (
                                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                                                        BEST MATCH
                                                    </div>
                                                )}
                                                <ListingCard
                                                    title={space.title}
                                                    price={space.price}
                                                    type={space.type}
                                                    address={space.address}
                                                    imageUrl={space.imageUrl}
                                                    slug={space.slug.current}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 text-center">
                                        <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 underline">Start Over</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons for Form Steps */}
                    {step < 4 && (
                        <div className="absolute bottom-8 right-8 flex gap-4">
                            {step > 1 && (
                                <button onClick={() => setStep(s => s - 1)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Back</button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!formData.businessType && step === 1}
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {step === 3 ? 'Generate Matches' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
