'use client'

import { useState, useEffect } from 'react'
import { Plus, X, MapPin, Loader2, ImagePlus } from 'lucide-react'
import { createAdSpace } from '../admin/actions'
import { getTrendingLocations } from '@/app/actions'

interface CreateListingModalProps {
    ownerId: string
    onClose: () => void
}

export function CreateListingModal({ ownerId, onClose }: CreateListingModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    // Autocomplete State
    const [addressQuery, setAddressQuery] = useState('')
    const [isAddressFocused, setIsAddressFocused] = useState(false)
    const [suggestionsList, setSuggestionsList] = useState<string[]>([])

    useEffect(() => {
        getTrendingLocations().then(locs => setSuggestionsList(locs))
    }, [])

    const suggestions = addressQuery
        ? suggestionsList.filter(loc => loc.toLowerCase().includes(addressQuery.toLowerCase()))
        : suggestionsList.slice(0, 5)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setMessage('')

        // Append ownerId to formData since it's passed as prop
        formData.append('ownerId', ownerId)
        // Ensure address is set to query if user didn't click simple suggestion
        if (!formData.get('address')) {
            formData.set('address', addressQuery)
        }

        const result = await createAdSpace(null, formData)

        setIsLoading(false)
        if (result.success) {
            setIsSuccess(true)
            setMessage("🎉 Listing Created Successfully!")
            setTimeout(onClose, 2000)
        } else {
            setMessage(result.message || "Something went wrong")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <div className={`bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ${isSuccess ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>

                {/* Header */}
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">List New Space</h2>
                        <p className="text-xs text-gray-500">Add a new screen or billboard to your inventory.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Success Message Banner */}
                {message && (
                    <div className={`p-4 text-center text-sm font-bold ${isSuccess ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {message}
                    </div>
                )}

                {/* Form */}
                <form action={handleSubmit} className="p-6 space-y-6">

                    {/* 1. Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="e.g. Digital Billboard at Sony Signal"
                            className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            required
                        />
                    </div>

                    {/* 2. Type & Price Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                            <select name="type" className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500" required>
                                <option value="billboard">Billboard</option>
                                <option value="digital_screen">Digital Screen</option>
                                <option value="transit">Transit Media</option>
                                <option value="street_furniture">Street Furniture</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Price / Day</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400">₹</span>
                                <input
                                    name="price"
                                    type="number"
                                    placeholder="5000"
                                    className="w-full pl-7 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Address with Autocomplete - THE REQUESTED FEATURE */}
                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                name="address"
                                type="text"
                                value={addressQuery}
                                onChange={(e) => setAddressQuery(e.target.value)}
                                onFocus={() => setIsAddressFocused(true)}
                                onBlur={() => setTimeout(() => setIsAddressFocused(false), 200)}
                                placeholder="Enter location..."
                                className="w-full pl-9 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                required
                                autoComplete="off"
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        {isAddressFocused && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-48 overflow-y-auto">
                                <div className="p-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    {addressQuery ? 'Matching Locations' : 'Popular Spots (High Visibility)'}
                                </div>
                                {suggestions.map((loc, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                        onClick={() => setAddressQuery(loc)}
                                    >
                                        <MapPin className="h-3 w-3 text-gray-400" />
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 4. Image Upload (Simple) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Photo</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative">
                            <ImagePlus className="h-8 w-8 mb-2" />
                            <span className="text-xs">Tap to upload space image</span>
                            <input name="image" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" required />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                        {isLoading ? 'Creating...' : 'List Space Now'}
                    </button>
                </form>
            </div>
        </div>
    )
}
