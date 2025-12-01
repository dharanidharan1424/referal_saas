"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ScanFormProps {
    gymId: string
    gymName: string
}

export function ScanForm({ gymId, gymName }: ScanFormProps) {
    const router = useRouter()
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/member/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gymId, name, phone }),
            })

            if (res.ok) {
                const data = await res.json()
                router.push(`/referral/${data.code}`)
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
        <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Join {gymName} & Earn Rewards!</CardTitle>
                    <CardDescription>Enter your details to get your unique referral code.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                placeholder="Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                            {loading ? "Generating Code..." : "Get My Referral Code"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
