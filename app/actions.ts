'use server'

import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "@/sanity/env"

const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

export async function createBooking(data: any) {
    try {
        const { name, phone, address, cartItems, totalPrice, userEmail } = data

        // 1. Find or Create the User
        let user = await writeClient.fetch(`*[_type == "user" && email == $email][0]`, { email: userEmail })

        if (!user) {
            console.log("Booking: User not found, creating new user:", userEmail)
            user = await writeClient.create({
                _type: 'user',
                name: name,
                email: userEmail,
                role: 'advertiser',
                phone: phone,
                username: userEmail.split('@')[0] // Fallback username
            })
        } else {
            // Update phone if missing or changed (optional, but good for contact)
            await writeClient.patch(user._id).set({ phone: phone }).commit()
        }

        // 2. Create Booking Documents
        const bookingPromises = cartItems.map((item: any) => {
            const itemTotal = item.price * (item.days || 1)

            return writeClient.create({
                _type: 'booking',
                space: { _type: 'reference', _ref: item._id },
                advertiser: { _type: 'reference', _ref: user._id },
                startDate: item.startDate,
                endDate: item.endDate,
                status: 'pending',
                totalPrice: itemTotal,
                contactDetails: { // Storing exact contact info for this specific booking
                    name,
                    phone,
                    address
                }
            })
        })

        await Promise.all(bookingPromises)

        return { success: true, message: "Booking created successfully" }
    } catch (e: any) {
        console.error("Booking Error:", e)
        return { success: false, message: e.message }
    }
}
