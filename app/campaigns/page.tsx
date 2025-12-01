import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Plus, QrCode } from "lucide-react"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Campaigns",
    description: "Manage your gym's referral campaigns and track their performance.",
}

// Revalidate every 60 seconds for fresh data
export const revalidate = 60


export default async function CampaignsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login?from=/campaigns")
    }

    const gym = await prisma.gym.findFirst({
        where: { ownerId: session.user.id },
        include: { campaigns: { orderBy: { createdAt: 'desc' } } }
    })

    if (!gym) return <div>Gym not found</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
                <Link href="/campaigns/new">
                    <Button className="gap-2">
                        <Plus size={16} /> Create Campaign
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gym.campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                        <CardHeader>
                            <CardTitle>{campaign.title}</CardTitle>
                            <CardDescription>Reward: {campaign.rewardName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Target Joins:</span>
                                    <span className="font-medium">{campaign.targetJoins}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`font-medium ${campaign.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {campaign.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="pt-4">
                                    <Link href={`/campaigns/${campaign.id}`}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <QrCode size={16} /> View Details & QR
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {gym.campaigns.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">No campaigns found. Create your first one!</p>
                        <Link href="/campaigns/new">
                            <Button>Create Campaign</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
