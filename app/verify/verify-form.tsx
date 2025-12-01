"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export function VerifyForm() {
    const [code, setCode] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const res = await fetch("/api/referral/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, phone }),
            })

            const data = await res.json()

            if (res.ok) {
                setResult({ success: true, message: "Member verified successfully! Referral count updated." })
                setCode("")
                setPhone("")
            } else {
                setResult({ success: false, message: data.error || "Verification failed" })
            }
        } catch (err) {
            setResult({ success: false, message: "Something went wrong" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Verify New Join</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Staff Verification</CardTitle>
                    <CardDescription>Enter the referral code and the new member's phone number.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Referral Code</Label>
                            <Input
                                id="code"
                                placeholder="ABC-123"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">New Member Phone</Label>
                            <Input
                                id="phone"
                                placeholder="1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        {result && (
                            <div className={`p-4 rounded-lg flex items-center gap-2 ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {result.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                <p className="text-sm font-medium">{result.message}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Verifying..." : "Verify Join"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
