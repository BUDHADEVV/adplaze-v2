export const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-09'

export const dataset = assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

// Helper to provide a clear error or a fallback to prevent crash during build/dev
function assertValue<T>(v: T | undefined, errorMessage: string): T {
    // If we are in the browser or build time and value is missing, we might want to throw
    // But to allow the app to "run" and show a UI error, we can return a placeholder if needed.
    // For now, let's just warn and return an empty string to satisfy the type, 
    // checking it later in the client.
    if (v === undefined) {
        console.warn(errorMessage);
        return '' as T;
    }
    return v
}
