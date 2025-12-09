'use client'

import { Share2, Heart, Check } from "lucide-react"
import { Share2, Heart, Check } from "lucide-react"
import { useState, useEffect } from "react"
// import { toast } from "react-hot-toast" 

interface SpaceActionsProps {
    spaceId: string
    title: string
    url: string
}

export function SpaceActions({ spaceId, title, url }: SpaceActionsProps) {
    const [isLiked, setIsLiked] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('wishlist')
        if (saved) {
            const items = JSON.parse(saved)
            if (items.includes(spaceId)) setIsLiked(true)
        }
    }, [spaceId])

    const toggleLike = () => {
        const saved = localStorage.getItem('wishlist')
        let items = saved ? JSON.parse(saved) : []

        if (isLiked) {
            items = items.filter((id: string) => id !== spaceId)
        } else {
            items.push(spaceId)
        }

        localStorage.setItem('wishlist', JSON.stringify(items))
        setIsLiked(!isLiked)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out ${title} on Adplaze!`,
                    url: url
                })
            } catch (err) {
                console.log('Share canceled')
            }
        } else {
            // Fallback to copy clipboard
            navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
            >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied' : 'Share'}
            </button>
            <button
                onClick={toggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition-all shadow-sm active:scale-95 ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Saved' : 'Save'}
            </button>
        </div>
    )
}
