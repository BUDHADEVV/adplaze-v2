'use server'

import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "@/sanity/env"
import { revalidatePath } from "next/cache"

const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

export async function createAgencyUser(prevState: any, formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const companyName = formData.get('companyName') as string
    const email = formData.get('email') as string

    if (!username || !password || !companyName) {
        return { success: false, message: "Missing fields" }
    }

    try {
        const exists = await writeClient.fetch(`count(*[_type == "user" && username == $username])`, { username })
        if (exists > 0) return { success: false, message: "Username already taken" }

        await writeClient.create({
            _type: 'user',
            name: companyName,
            email: email || `${username}@adplaze.agency`,
            username,
            password,
            role: 'agency',
            agencyProfile: {
                companyName,
                gst: 'PENDING'
            }
        })
        revalidatePath('/dashboard/admin')
        return { success: true, message: `Agency ${companyName} created!` }

    } catch (e: any) {
        console.error("Creation Error:", e)
        return { success: false, message: `Error: ${e.message}` }
    }
}

export async function updateAgencyCredentials(prevState: any, formData: FormData) {
    const userId = formData.get('userId') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!userId || !username || !password) return { success: false, message: "Missing fields" }

    try {
        await writeClient.patch(userId)
            .set({ username, password })
            .commit()

        revalidatePath('/dashboard/admin')
        return { success: true, message: "Credentials updated" }
    } catch (e: any) {
        return { success: false, message: `Update failed: ${e.message}` }
    }
}

export async function createAdSpace(prevState: any, formData: FormData) {
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const price = Number(formData.get('price'))
    const address = formData.get('address') as string
    const ownerId = formData.get('ownerId') as string

    if (!title || !price || !ownerId) return { success: false, message: "Missing required fields" }

    try {
        // Generate a slug
        const slug = title.toLowerCase().replace(/\s+/g, '-').slice(0, 90) + '-' + Math.floor(Math.random() * 1000)

        // Initialize images array
        let images = []

        // Handle Image Upload
        const imageFile = formData.get('image') as File
        if (imageFile && imageFile.size > 0) {
            const buffer = await imageFile.arrayBuffer()
            const asset = await writeClient.assets.upload('image', Buffer.from(buffer), {
                filename: imageFile.name
            })
            images.push({
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            })
        }

        await writeClient.create({
            _type: 'adSpace',
            title,
            slug: { _type: 'slug', current: slug },
            type,
            price,
            address,
            owner: {
                _type: 'reference',
                _ref: ownerId
            },
            images: images,
            description: "Newly listed space. Add description and images in Studio."
        })

        revalidatePath('/dashboard/admin')
        revalidatePath('/dashboard/agency') // Update agency dashboard too
        return { success: true, message: "Space listed and assigned!" }

    } catch (e: any) {
        console.error("Listing Error:", e)
        return { success: false, message: `Failed to list space: ${e.message}` }
    }
}

export async function updateAdSpace(prevState: any, formData: FormData) {
    const spaceId = formData.get('spaceId') as string
    const title = formData.get('title') as string
    const price = Number(formData.get('price'))
    const address = formData.get('address') as string

    if (!spaceId || !title || !price) return { success: false, message: "Missing required fields" }

    try {
        await writeClient.patch(spaceId)
            .set({ title, price, address })
            .commit()

        revalidatePath('/dashboard/admin')
        revalidatePath('/dashboard/agency')
        return { success: true, message: "Space updated successfully" }
    } catch (e: any) {
        console.error("Update Error:", e)
        return { success: false, message: `Failed to update: ${e.message}` }
    }
}

export async function deleteAdSpace(prevState: any, formData: FormData) {
    const spaceId = formData.get('spaceId') as string

    if (!spaceId) return { success: false, message: "Missing space ID" }

    // Debugging: Check if token is present
    if (!process.env.SANITY_API_TOKEN) {
        console.error("CRITICAL: SANITY_API_TOKEN is missing in environment variables.")
        return { success: false, message: "Server Error: Missing API Token for Write Permissions. Please verify Vercel Environment Variables." }
    }

    try {
        // 1. Delete all bookings referencing this space (Cascade Delete)
        // We first fetch them to get their IDs
        const referencingBookings = await writeClient.fetch(`*[_type == "booking" && space._ref == $spaceId]._id`, { spaceId })

        if (referencingBookings.length > 0) {
            const tx = writeClient.transaction()
            referencingBookings.forEach((id: string) => tx.delete(id))
            await tx.commit()
        }

        // 2. Now delete the space
        await writeClient.delete(spaceId)

        revalidatePath('/dashboard/admin')
        revalidatePath('/dashboard/agency')
        return { success: true, message: "Space and associated bookings deleted successfully" }
    } catch (e: any) {
        console.error("Delete Error:", e)
        return { success: false, message: `Failed to delete: ${e.message}` }
    }
}

export async function manageBooking(prevState: any, formData: FormData) {
    const bookingId = formData.get('bookingId') as string
    const action = formData.get('action') as string // 'confirm' or 'reject' or 'cancel'
    const spaceId = formData.get('spaceId') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string

    if (!bookingId || !action) return { success: false, message: "Missing fields" }

    try {
        let status = ''
        if (action === 'confirm') status = 'confirmed'
        else if (action === 'reject') status = 'rejected'
        else if (action === 'cancel') status = 'cancelled'

        if (!status) return { success: false, message: "Invalid action" }

        // 1. Update Booking Status
        await writeClient.patch(bookingId).set({ status }).commit()

        // 2. Logic for Blocking/Unblocking Dates
        if (spaceId && startDate && endDate) {
            const dates: string[] = []
            let current = new Date(startDate)
            const end = new Date(endDate)

            while (current <= end) {
                dates.push(current.toISOString().split('T')[0])
                current.setDate(current.getDate() + 1)
            }

            // If Confirming: ADD dates to availability
            if (action === 'confirm') {
                await writeClient.patch(spaceId)
                    .setIfMissing({ availability: [] })
                    .append('availability', dates)
                    .commit()
            }
            // If Cancelling: REMOVE dates from availability
            else if (action === 'cancel') {
                // Fetch current availability
                const space = await writeClient.fetch(`*[_id == $id][0]{availability}`, { id: spaceId })
                const currentAvailability = space?.availability || []

                // Filter out the booking dates
                const newAvailability = currentAvailability.filter((d: string) => !dates.includes(d))

                await writeClient.patch(spaceId)
                    .set({ availability: newAvailability })
                    .commit()
            }
        }

        revalidatePath('/dashboard/admin')
        revalidatePath('/dashboard/agency')
        return { success: true, message: `Booking ${status}` }
    } catch (e: any) {
        console.error("Booking Manage Error:", e)
        return { success: false, message: `Failed: ${e.message}` }
    }
}
