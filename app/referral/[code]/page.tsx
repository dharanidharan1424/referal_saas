import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ code: string }>
}): Promise<Metadata> {
    const { code } = await params
    const referralCode = await prisma.referralCode.findUnique({
        where: { code },
        include: {
            campaign: true,
            member: true,
        },
    })

    if (!referralCode) {
        return { title: "Referral Not Found" }
    }

    const progress = Math.min((referralCode.joinCount / referralCode.campaign.targetJoins) * 100, 100)
    const remaining = Math.max(referralCode.campaign.targetJoins - referralCode.joinCount, 0)

    return {
        title: `${referralCode.member.name}'s Referral Progress`,
        description: `Join using code ${code} and help unlock rewards! ${remaining} more joins needed to unlock: ${referralCode.campaign.rewardName}`,
        openGraph: {
            title: `Join & Earn Rewards!`,
            description: `Use referral code ${code} to join. ${remaining} more joins to unlock: ${referralCode.campaign.rewardName}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `Join & Earn Rewards!`,
            description: `Use code ${code}. ${remaining} more joins to unlock: ${referralCode.campaign.rewardName}`,
        },
        robots: {
            index: false,
            follow: false,
        },
    }
}

export const revalidate = 10 // Revalidate every 10 seconds for real-time progress


export default async function ReferralStatusPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params

    const referralCode = await prisma.referralCode.findUnique({
        where: { code },
        include: {
            campaign: true,
            member: true,
            rewards: true,
        },
    })

    if (!referralCode) {
        notFound()
    }

    const { campaign, joinCount } = referralCode
    const progress = Math.min((joinCount / campaign.targetJoins) * 100, 100)
    const isUnlocked = joinCount >= campaign.targetJoins

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-blue-600">Your Referral Status</CardTitle>
                    <CardDescription>Share this code to earn rewards!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Your Unique Code</p>
                        <p className="text-3xl font-mono font-bold tracking-wider">{code}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
                            <span>{joinCount} / {campaign.targetJoins} Joins</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <p className="text-xs text-gray-500 text-center">
                            {campaign.targetJoins - joinCount} more joins to unlock: <span className="font-bold">{campaign.rewardName}</span>
                        </p>
                    </div>

                    {isUnlocked && (
                        <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg text-center animate-pulse">
                            <p className="font-bold text-lg">🎉 Reward Unlocked!</p>
                            <p className="text-sm">Show this screen to staff to claim your {campaign.rewardName}.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full gap-2">
                            <Copy size={16} /> Copy Code
                        </Button>
                        <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                            <Share2 size={16} /> WhatsApp
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="justify-center text-xs text-gray-400">
                    Gym Referral System
                </CardFooter>
            </Card>
        </div>
    )
}
