import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Download, Printer } from "lucide-react"
import QRCode from "qrcode"
import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const campaign = await prisma.campaign.findUnique({
        where: { id },
        select: { title: true, rewardName: true },
    })

    if (!campaign) {
        return { title: "Campaign Not Found" }
    }

    return {
        title: `${campaign.title}`,
        description: `Campaign details for ${campaign.title}. Reward: ${campaign.rewardName}`,
        robots: {
            index: false,
            follow: false,
        },
    }
}

export async function generateStaticParams() {
    const campaigns = await prisma.campaign.findMany({
        where: { isActive: true },
        select: { id: true },
        take: 20,
    })

    return campaigns.map((campaign) => ({
        id: campaign.id,
    }))
}

export const revalidate = 60


export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login?from=/campaigns")
    }

    const { id } = await params

    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { gym: true },
    })

    if (!campaign) notFound()

    if (campaign.gym.ownerId !== session.user.id) {
        return <div>Unauthorized</div>
    }

    const scanUrl = `${process.env.NEXTAUTH_URL}/scan/${campaign.gymId}`
    const qrCodeDataUrl = await QRCode.toDataURL(scanUrl)

    return (
        <div className="space-y-6">
            <Link href="/campaigns" className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft size={16} className="mr-2" /> Back to Campaigns
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{campaign.title}</CardTitle>
                        <CardDescription>Campaign Details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Reward</p>
                            <p className="text-lg">{campaign.rewardName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Target Joins</p>
                            <p className="text-lg">{campaign.targetJoins}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className={`text-lg ${campaign.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {campaign.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>QR Code</CardTitle>
                        <CardDescription>Scan to join this gym's referral program</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="border p-4 rounded-lg bg-white">
                            <img src={qrCodeDataUrl} alt="Campaign QR Code" width={200} height={200} />
                        </div>
                        <p className="text-sm text-gray-500 break-all text-center">{scanUrl}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2">
                                <Download size={16} /> Download PNG
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Printer size={16} /> Print
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
