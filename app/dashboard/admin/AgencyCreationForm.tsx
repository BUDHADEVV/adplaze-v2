'use client'

import { useActionState } from "react"
import { createAgencyUser } from "./actions"

const initialState = {
    success: false,
    message: '',
}

export function AgencyCreationForm() {
    const [state, formAction, isPending] = useActionState(createAgencyUser, initialState)

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Agency / Company Name</label>
                <input name="companyName" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Username (for login)</label>
                <input name="username" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input name="password" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                <input name="email" type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-bold shadow-sm">
                Generate Agency Account
            </button>

            {state?.message && (
                <div className={`p-4 rounded-md text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {state.message}
                </div>
            )}
        </form>
    )
}
