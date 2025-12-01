import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Megaphone, Gift } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "View your gym's referral campaign performance and analytics.",
}

async function getStats(gymId: string) {
    const [totalMembers, totalReferralCodes, totalJoins, totalRewards] = await Promise.all([
        prisma.member.count({ where: { gymId } }),
        prisma.referralCode.count({ where: { campaign: { gymId } } }),
        prisma.referralJoin.count({ where: { referralCode: { campaign: { gymId } } } }),
        prisma.reward.count({ where: { status: "UNLOCKED", referralCode: { campaign: { gymId } } } }),
    ])

    return {
        totalScans: totalMembers,
        activeMembers: totalReferralCodes,
        successfulJoins: totalJoins,
        rewardsUnlocked: totalRewards,
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login?from=/dashboard")
    }

    const gym = await prisma.gym.findFirst({
        where: { ownerId: session.user.id },
    })

    if (!gym) {
        return <div className="p-6">No gym found. Please contact support.</div>
    }

    const stats = await getStats(gym.id)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Scans" value={stats.totalScans} icon={<Megaphone className="text-blue-500" />} />
                <StatCard title="Active Referrers" value={stats.activeMembers} icon={<Users className="text-green-500" />} />
                <StatCard title="Successful Joins" value={stats.successfulJoins} icon={<UserCheck className="text-purple-500" />} />
                <StatCard title="Rewards Unlocked" value={stats.rewardsUnlocked} icon={<Gift className="text-orange-500" />} />
            </div>

            {/* Charts will go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-96">
                    <CardHeader>
                        <CardTitle>Referral Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="h-96">
                    <CardHeader>
                        <CardTitle>Recent Joins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-full text-gray-400">
                            List Placeholder
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}
