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
        return { success: true, message: "Space updated successfully" }
    } catch (e: any) {
        console.error("Update Error:", e)
        return { success: false, message: `Failed to update: ${e.message}` }
    }
}

export async function deleteAdSpace(prevState: any, formData: FormData) {
    const spaceId = formData.get('spaceId') as string

    if (!spaceId) return { success: false, message: "Missing space ID" }

    try {
        await writeClient.delete(spaceId)
        revalidatePath('/dashboard/admin')
        return { success: true, message: "Space deleted successfully" }
    } catch (e: any) {
        console.error("Delete Error:", e)
        return { success: false, message: `Failed to delete: ${e.message}` }
    }
}

export async function manageBooking(prevState: any, formData: FormData) {
    const bookingId = formData.get('bookingId') as string
    const action = formData.get('action') as string // 'confirm' or 'reject'
    const spaceId = formData.get('spaceId') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string

    if (!bookingId || !action) return { success: false, message: "Missing fields" }

    try {
        const status = action === 'confirm' ? 'confirmed' : 'rejected'

        // 1. Update Booking Status
        await writeClient.patch(bookingId).set({ status }).commit()

        // 2. If Confirmed, Block Dates on Space
        if (action === 'confirm' && spaceId && startDate && endDate) {
            // Generate array of dates between start and end
            const dates: string[] = []
            let current = new Date(startDate)
            const end = new Date(endDate)

            while (current <= end) {
                dates.push(current.toISOString().split('T')[0])
                current.setDate(current.getDate() + 1)
            }

            // Append these dates to availability array
            await writeClient.patch(spaceId)
                .setIfMissing({ availability: [] })
                .append('availability', dates)
                .commit()
        }

        revalidatePath('/dashboard/admin')
        revalidatePath('/dashboard/agency')
        return { success: true, message: `Booking ${status}` }
    } catch (e: any) {
        console.error("Booking Manage Error:", e)
        return { success: false, message: `Failed: ${e.message}` }
    }
}
