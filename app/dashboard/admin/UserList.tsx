'use client'

import { useActionState } from "react"
import { updateAgencyCredentials } from "./actions"
import { useState } from "react"
import { Pencil, X } from "lucide-react"

export function UserList({ users }: { users: any[] }) {
    const [editingUser, setEditingUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'agency' | 'advertiser'>('agency')

    const filteredUsers = users.filter((u: any) =>
        activeTab === 'agency' ? u.role === 'agency' : u.role !== 'agency'
    )

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Agencies & Users</h2>
                    <span className="text-xs font-medium text-gray-500">{filteredUsers.length} Found</span>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('agency')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'agency' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Agencies (Owners)
                    </button>
                    <button
                        onClick={() => setActiveTab('advertiser')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'advertiser' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Advertisers (Users)
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-white text-gray-900 font-semibold sticky top-0 border-b">
                        <tr>
                            <th className="px-4 py-3">{activeTab === 'agency' ? 'Agency Name' : 'User Name'}</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length > 0 ? filteredUsers.map((user: any) => (
                            <tr key={user._id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-bold text-gray-900">{user.name || user.agencyProfile?.companyName || user.username || 'No Name'}</div>
                                    <div className="text-xs text-blue-600 font-mono mt-0.5">
                                        {activeTab === 'agency' ? `USER: ${user.username || '-'} | PASS: ${user.password || '***'}` : `PHONE: ${user.phone || '-'}`}
                                    </div>
                                    <div className="text-[10px] text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {user.role === 'agency' && (
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2} className="px-4 py-8 text-center text-gray-400 text-xs">
                                    No {activeTab}s found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold">Edit Credentials</h3>
                            <button onClick={() => setEditingUser(null)}><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <EditForm user={editingUser} onClose={() => setEditingUser(null)} />
                    </div>
                </div>
            )}
        </div>
    )
}

function EditForm({ user, onClose }: { user: any, onClose: () => void }) {
    const [state, formAction] = useActionState(updateAgencyCredentials, { success: false, message: '' })

    return (
        <form action={formAction} className="p-6 space-y-4">
            <input type="hidden" name="userId" value={user._id} />

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Username</label>
                <input name="username" defaultValue={user.username} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
                <input name="password" defaultValue={user.password} className="w-full border rounded p-2 mt-1" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">
                Update Login Details
            </button>

            {state?.message && (
                <p className={`text-sm text-center ${state.success ? 'text-green-600' : 'text-red-500'}`}>
                    {state.message}
                </p>
            )}
            {state?.success && (
                <button type="button" onClick={onClose} className="w-full text-xs text-gray-400 mt-2 underline">Close</button>
            )}
        </form>
    )
}
