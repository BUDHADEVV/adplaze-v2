
import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "@/sanity/env"

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

async function check() {
    const user = await client.fetch(`*[_type == "user" && username == "pixelp"]`)
    console.log("User Found:", JSON.stringify(user, null, 2))
}

check()
