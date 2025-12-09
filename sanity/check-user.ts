
import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "./env"

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

async function check() {
    console.log("Checking for user 'pixelp'...")
    try {
        const user = await client.fetch(`*[_type == "user" && username == "pixelp"]`)
        console.log("User Found:", JSON.stringify(user, null, 2))
    } catch (e) {
        console.error("Error:", e)
    }
}

check()
