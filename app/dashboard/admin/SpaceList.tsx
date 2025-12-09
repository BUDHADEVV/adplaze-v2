'use client'

import { useActionState } from "react"
import { updateAdSpace, deleteAdSpace } from "./actions"
import { useState } from "react"
import { Pencil, X, MapPin, Trash2 } from "lucide-react"

export function SpaceList({ spaces }: { spaces: any[] }) {
    const [editingSpace, setEditingSpace] = useState<any>(null)

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Manage Inventory</h2>
                <span className="text-xs font-medium text-gray-500">{spaces.length} Spaces</span>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-white text-gray-900 font-semibold sticky top-0 border-b">
                        <tr>
                            <th className="px-4 py-3">Space Details</th>
                            <th className="px-4 py-3 text-right">Price</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {spaces.map((space: any) => (
                            <tr key={space._id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-bold text-gray-900">{space.title}</div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate max-w-[150px]">{space.address}</span>
                                    </div>
                                    <div className="text-[10px] text-blue-500 mt-1 uppercase font-semibold tracking-wider">
                                        {space.type?.replace('_', ' ')}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-medium text-gray-700">
                                    ₹{space.price?.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => setEditingSpace(space)}
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                                        title="Edit Space"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <DeleteButton spaceId={space._id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingSpace && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold">Edit Space</h3>
                            <button onClick={() => setEditingSpace(null)}><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <EditSpaceForm space={editingSpace} onClose={() => setEditingSpace(null)} />
                    </div>
                </div>
            )}
        </div>
    )
}

function DeleteButton({ spaceId }: { spaceId: string }) {
    const [state, formAction] = useActionState(deleteAdSpace, { success: false, message: '' })

    return (
        <form action={formAction} className="inline-block" onSubmit={(e) => {
            if (!confirm("Are you sure you want to delete this space?")) {
                e.preventDefault()
            }
        }}>
            <input type="hidden" name="spaceId" value={spaceId} />
            <button type="submit" className="text-gray-400 hover:text-red-600 transition-colors p-2" title="Delete Space">
                <Trash2 className="h-4 w-4" />
            </button>
        </form>
    )
}

function EditSpaceForm({ space, onClose }: { space: any, onClose: () => void }) {
    const [state, formAction] = useActionState(updateAdSpace, { success: false, message: '' })

    return (
        <form action={formAction} className="p-6 space-y-4">
            <input type="hidden" name="spaceId" value={space._id} />

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
                <input name="title" defaultValue={space.title} className="w-full border rounded p-2 mt-1" required />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Price (Daily)</label>
                <input name="price" type="number" defaultValue={space.price} className="w-full border rounded p-2 mt-1" required />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Address</label>
                <input name="address" defaultValue={space.address} className="w-full border rounded p-2 mt-1" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">
                Update Space
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
