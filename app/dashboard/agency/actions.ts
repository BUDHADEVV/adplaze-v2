'use server'

import { createClient } from 'next-sanity'
import { revalidatePath } from 'next/cache'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// We need a client with a WRITE token for this
// User must add SANITY_API_TOKEN to .env.local
const token = process.env.SANITY_API_TOKEN

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
})

export async function toggleAvailability(spaceId: string, date: string, currentBlockedDates: string[] = []) {
    if (!token) {
        throw new Error("Missing SANITY_API_TOKEN. Cannot write to database.")
    }

    const isBlocked = currentBlockedDates.includes(date)

    let newDates = []
    if (isBlocked) {
        // Unblock (Remove date)
        newDates = currentBlockedDates.filter(d => d !== date)
    } else {
        // Block (Add date)
        newDates = [...currentBlockedDates, date]
    }

    try {
        await client.patch(spaceId)
            .set({ availability: newDates })
            .commit()

        revalidatePath('/dashboard/agency')
        revalidatePath(`/space/${spaceId}`) // Assuming space slug or similar
        return { success: true, newDates }
    } catch (e) {
        console.error("Sanity Write Failed:", e)
        return { success: false, error: "Failed to update availability" }
    }
}
