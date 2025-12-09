'use client'

import { useActionState } from "react"
import { createAdSpace } from "./actions"
import { MapPin, DollarSign, Layout, User as UserIcon } from "lucide-react"

export function SpaceCreationForm({ agencies }: { agencies: any[] }) {
    const [state, formAction, isPending] = useActionState(createAdSpace, { success: false, message: '' })

    return (
        <form action={formAction} className="space-y-4">

            <div>
                <label className="block text-sm font-medium text-gray-700">Ad Space Title</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input name="title" type="text" required className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. Downtown Digital Billboard" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Layout className="h-4 w-4 text-gray-400" />
                        </div>
                        <select name="type" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="billboard">Billboard</option>
                            <option value="digital_screen">Digital Screen</option>
                            <option value="transit">Transit Ad</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Daily Price (₹)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input name="price" type="number" required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="5000" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Specific Spot / Landmark</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input name="address" type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. Opposite Lulu Mall" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">City / Town</label>
                    <input name="city" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. Kochi" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">District / State</label>
                    <input name="district" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. Ernakulam" />
                </div>
                {/* Empty col for spacing or future field */}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Space Image</label>
                <div className="mt-1 bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
                    <input name="image" type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <p className="text-xs text-gray-500 mt-2">Upload a high-quality image of the ad space</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Assign to Agency Space Owner</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <select name="ownerId" required className="block w-full pl-10 pr-3 py-2 border border-blue-300 bg-blue-50 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-blue-900 font-medium">
                        <option value="">-- Select Agency --</option>
                        {agencies.map((agency) => (
                            <option key={agency._id} value={agency._id}>
                                {agency.name || agency.agencyProfile?.companyName || agency.username} ({agency.email || 'No Email'})
                            </option>
                        ))}
                    </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">The selected agency will see this space in their dashboard.</p>
            </div>

            <button disabled={isPending} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {isPending ? 'Creating...' : 'List Space & Assign'}
            </button>

            {state?.message && (
                <div className={`p-3 rounded-md text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {state.message}
                </div>
            )}
        </form>
    )
}
