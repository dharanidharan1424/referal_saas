"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

export function MarkRewardButton({ rewardId }: { rewardId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleMarkGiven = async () => {
        setLoading(true)
        try {
            await fetch("/api/reward/mark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rewardId }),
            })
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button onClick={handleMarkGiven} disabled={loading} className="w-full gap-2">
            <Check size={16} /> Mark as Given
        </Button>
    )
}
