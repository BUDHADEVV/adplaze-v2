'use server'

import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "@/sanity/env"

// WE NEED A WRITE CLIENT FOR ACTIONS
const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Important for fresh data
    token: process.env.SANITY_API_TOKEN,
})

// READ CLIENT FOR PUBLIC FETCHING (optional optimization)
const readClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
})

export async function getTrendingLocations() {
    try {
        // Fetch address, city, and district
        const spaces = await readClient.fetch(`*[_type == "adSpace"]{address, city}`)

        const locationCounts: Record<string, number> = {}

        spaces.forEach((space: any) => {
            // Priority: City > Address
            const loc = space.city || space.address
            if (loc) {
                const normalizedLoc = loc.trim()
                // Split logic inside Navbar expects 'City, Detail' or just 'City'
                // We should store clean names
                locationCounts[normalizedLoc] = (locationCounts[normalizedLoc] || 0) + 1
            }
        })

        const sortedLocations = Object.entries(locationCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([loc]) => loc)

        const SEED_LOCATIONS = [
            'Kochi, Edappally', 'Kochi, MG Road', 'Kochi, Vyttila',
            'Calicut, Mavoor Road', 'Calicut, Beach Road',
            'Trivandrum, Technopark', 'Trivandrum, MG Road',
            'Bangalore, Koramangala', 'Mumbai, Bandra' // Keep a few majors as backup
        ]

        const finalLocations = Array.from(new Set([...sortedLocations, ...SEED_LOCATIONS])).slice(0, 10)

        return finalLocations
    } catch (e) {
        console.error("Location Fetch Error:", e)
        return []
    }
}

export async function createBooking(data: any) {
    const { name, phone, address, cartItems, totalPrice, userEmail } = data

    if (!cartItems || cartItems.length === 0) {
        return { success: false, message: "Cart is empty" }
    }

    try {
        // 1. Get User Reference
        const user = await writeClient.fetch(`*[_type == "user" && email == $email][0]`, { email: userEmail })
        if (!user) return { success: false, message: "User not found" }

        // 2. Create a Booking for EACH item in the cart
        // Using a transaction to ensure all or nothing
        const transaction = writeClient.transaction()

        cartItems.forEach((item: any) => {
            transaction.create({
                _type: 'booking',
                status: 'pending',
                advertiser: { _type: 'reference', _ref: user._id },
                space: { _type: 'reference', _ref: item._id },
                startDate: item.startDate,
                endDate: item.endDate,
                totalPrice: item.price * (item.days || 1), // Per item price
                contactDetails: {
                    name,
                    phone,
                    address
                },
                createdAt: new Date().toISOString()
            })
        })

        await transaction.commit()

        return { success: true, message: "Booking created successfully!" }
    } catch (e: any) {
        console.error("Booking Error:", e)
        return { success: false, message: `Booking Failed: ${e.message}` }
    }
}
