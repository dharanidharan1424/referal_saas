"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function NewCampaignForm() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [rewardName, setRewardName] = useState("")
    const [targetJoins, setTargetJoins] = useState("10")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/campaign/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, rewardName, targetJoins }),
            })

            if (res.ok) {
                router.push("/campaigns")
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || "Something went wrong")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/campaigns" className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft size={16} className="mr-2" /> Back to Campaigns
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Campaign</CardTitle>
                    <CardDescription>Set up a referral program for your gym</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Campaign Title</Label>
                            <Input
                                id="title"
                                placeholder="Summer Referral Bonus"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rewardName">Reward Name</Label>
                            <Input
                                id="rewardName"
                                placeholder="1 Month Free Membership"
                                value={rewardName}
                                onChange={(e) => setRewardName(e.target.value)}
                                required
                            />
                            <p className="text-sm text-gray-500">What does the referrer get?</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetJoins">Target Joins</Label>
                            <Input
                                id="targetJoins"
                                type="number"
                                min="1"
                                value={targetJoins}
                                onChange={(e) => setTargetJoins(e.target.value)}
                                required
                            />
                            <p className="text-sm text-gray-500">How many friends need to join to unlock the reward?</p>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create Campaign"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
