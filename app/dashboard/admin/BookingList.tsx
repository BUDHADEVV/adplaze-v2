'use client'

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, User, MapPin, X, Phone, Mail, Clock } from "lucide-react"

export function BookingList({ bookings }: { bookings: any[] }) {
    const [selectedBooking, setSelectedBooking] = useState<any>(null)

    if (!bookings || bookings.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium">No Bookings Yet</h3>
                <p className="text-sm text-gray-500 mt-1">When advertisers book spaces, they will appear here.</p>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                    <span className="text-xs font-medium text-gray-500">{bookings.length} Total</span>
                </div>

                <div className="overflow-y-auto max-h-[600px]">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-white text-gray-900 font-semibold sticky top-0 border-b">
                            <tr>
                                <th className="px-4 py-3">Space & Advertiser</th>
                                <th className="px-4 py-3">Dates</th>
                                <th className="px-4 py-3 text-right">Status / Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking: any) => (
                                <tr
                                    key={booking._id}
                                    onClick={() => setSelectedBooking(booking)}
                                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-gray-900">{booking.space?.title || 'Unknown Space'}</div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                            <MapPin className="h-3 w-3" />
                                            <span className="truncate max-w-[150px]">{booking.space?.address || 'No Address'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium mt-1">
                                            <User className="h-3 w-3" />
                                            {booking.advertiser?.name || booking.contactDetails?.name || 'Guest User'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                                            <div className="flex items-center gap-1">
                                                <span className="text-green-600">IN:</span> {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-red-500">OUT:</span> {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <div className="font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Booking Details</h3>
                                <p className="text-xs text-gray-500">ID: {selectedBooking._id}</p>
                            </div>
                            <button onClick={() => setSelectedBooking(null)}><X className="h-5 w-5 text-gray-500" /></button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${selectedBooking.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                                }`}>
                                <Clock className={`h-5 w-5 ${selectedBooking.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`} />
                                <div>
                                    <div className="font-bold text-sm uppercase tracking-wide">Status: {selectedBooking.status}</div>
                                    <p className="text-xs text-gray-600">Booked on {format(new Date(selectedBooking._createdAt || new Date()), 'PPP p')}</p>
                                </div>
                            </div>

                            {/* Two Column Details */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Advertiser Info</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <User className="h-4 w-4 text-gray-400" />
                                            {selectedBooking.contactDetails?.name || selectedBooking.advertiser?.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            {selectedBooking.contactDetails?.phone || selectedBooking.advertiser?.phone || 'No Phone'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {selectedBooking.advertiser?.email}
                                        </div>
                                        {selectedBooking.contactDetails?.address && (
                                            <div className="text-xs text-gray-500 mt-1 pl-6">
                                                {selectedBooking.contactDetails.address}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Booking Summary</h4>
                                    <div className="space-y-2">
                                        <div className="text-sm font-bold text-gray-900">{selectedBooking.space?.title}</div>
                                        <div className="text-xs text-gray-500">{selectedBooking.space?.address}</div>
                                        <div className="mt-2 pt-2 border-t border-dashed">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total</span>
                                                <span className="font-bold text-blue-600">₹{selectedBooking.totalPrice?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase">Duration</span>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {format(new Date(selectedBooking.startDate), 'MMM dd')} - {format(new Date(selectedBooking.endDate), 'MMM dd, yyyy')}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-between">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Close
                            </button>

                            {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                                <BookingActions booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

import { useActionState } from "react"
import { manageBooking } from "./actions"

function BookingActions({ booking, onClose }: { booking: any, onClose: () => void }) {
    const [state, formAction] = useActionState(manageBooking, { success: false, message: '' })

    // Auto close on success (optional, or just show message)
    if (state.success) {
        // Ideally we show a toast, but here we can just close or show success message.
    }

    return (
        <form action={formAction} className="flex gap-2">
            <input type="hidden" name="bookingId" value={booking._id} />
            {/* Pass extra data for date blocking */}
            <input type="hidden" name="spaceId" value={booking.space?._id} />
            <input type="hidden" name="startDate" value={booking.startDate} />
            <input type="hidden" name="endDate" value={booking.endDate} />

            {/* Cancel Button (Admin Only - Confirmed Bookings) */}
            {state?.success && <div className="text-xs text-green-600 font-bold">Done!</div>}

            {booking.status === 'confirmed' && (
                <button
                    type="submit"
                    name="action"
                    value="cancel"
                    className="bg-red-50 text-red-600 border border-red-200 font-bold py-2 px-4 rounded-lg hover:bg-red-100 text-sm ml-auto"
                >
                    Cancel & Refund
                </button>
            )}

            {booking.status === 'pending' && (
                <>
                    <button
                        type="submit"
                        name="action"
                        value="reject"
                        className="bg-red-50 text-red-600 border border-red-200 font-bold py-2 px-4 rounded-lg hover:bg-red-100 text-sm"
                    >
                        Reject
                    </button>
                    <button
                        type="submit"
                        name="action"
                        value="confirm"
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 shadow-sm text-sm"
                    >
                        Confirm Booking
                    </button>
                </>
            )}
        </form>
    )
}
