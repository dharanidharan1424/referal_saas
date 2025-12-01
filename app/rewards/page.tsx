import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MarkRewardButton } from "./mark-reward-button"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Rewards",
    description: "Manage unlocked rewards and track member achievements.",
}

export const revalidate = 30


export default async function RewardsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login?from=/rewards")
    }

    const gym = await prisma.gym.findFirst({
        where: { ownerId: session.user.id },
    })

    if (!gym) return <div>Gym not found</div>

    const rewards = await prisma.reward.findMany({
        where: {
            referralCode: {
                campaign: { gymId: gym.id }
            },
            status: { in: ["UNLOCKED", "GIVEN"] }
        },
        include: {
            referralCode: {
                include: {
                    member: true,
                    campaign: true
                }
            }
        },
        orderBy: { unlockedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Rewards Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                    <Card key={reward.id} className={reward.status === 'GIVEN' ? 'bg-gray-50' : 'border-green-200 bg-green-50'}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{reward.referralCode.member.name}</CardTitle>
                                <Badge variant={reward.status === 'GIVEN' ? 'secondary' : 'default'} className={reward.status === 'UNLOCKED' ? 'bg-green-600' : ''}>
                                    {reward.status}
                                </Badge>
                            </div>
                            <CardDescription>{reward.referralCode.campaign.rewardName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-sm">
                                    <p className="text-gray-500">Referrer Phone:</p>
                                    <p className="font-medium">{reward.referralCode.member.phone}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-500">Unlocked At:</p>
                                    <p>{reward.unlockedAt?.toLocaleDateString()}</p>
                                </div>

                                {reward.status === 'UNLOCKED' && (
                                    <MarkRewardButton rewardId={reward.id} />
                                )}

                                {reward.status === 'GIVEN' && (
                                    <p className="text-xs text-gray-400 text-center pt-2">
                                        Given on {reward.givenAt?.toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {rewards.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No unlocked rewards yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
