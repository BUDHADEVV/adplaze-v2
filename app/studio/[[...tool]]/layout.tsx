import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Adplaze Studio',
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
