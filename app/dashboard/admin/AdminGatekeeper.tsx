'use client'

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'

export function AdminGatekeeper({ children }: { children: React.ReactNode }) {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        // Check session storage on mount
        const unlocked = sessionStorage.getItem('admin_unlocked')
        if (unlocked === 'true') {
            setIsUnlocked(true)
        }
    }, [])

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === '2233') {
            sessionStorage.setItem('admin_unlocked', 'true')
            setIsUnlocked(true)
            setError(false)
        } else {
            setError(true)
            setPassword('')
        }
    }

    if (isUnlocked) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-8 w-8" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
                <p className="text-gray-500 mb-8">Enter admin PIN to continue to dashboard.</p>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter PIN"
                            className="w-full text-center text-2xl tracking-[0.5em] font-bold p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                            autoFocus
                            maxLength={4}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm font-medium animate-pulse">
                            Incorrect PIN. Access Denied.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all active:scale-95"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </div>
    )
}
