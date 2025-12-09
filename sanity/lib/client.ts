import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
    projectId: projectId || 'dummy_id_to_prevent_build_crash', // Fallback to allow app to load
    dataset: dataset || 'production',
    apiVersion,
    useCdn: false, // Set to false to ensure fresh data for Auth
})
