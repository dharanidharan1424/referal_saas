import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Get gym owned by user
        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id },
        })

        if (!gym) {
            return NextResponse.json({ error: "Gym not found" }, { status: 404 })
        }

        // Fetch stats
        const [totalScans, activeMembers, successfulJoins, rewardsUnlocked] = await Promise.all([
            // Total scans (visits to scan page - strictly this needs analytics, but we can count created members as a proxy for now or add a scan log later. 
            // For now, let's count total referral codes generated as "Active Members" and joins as "Successful Joins")

            // Actually, let's count total members
            prisma.member.count({ where: { gymId: gym.id } }),

            // Active Referrers (members with at least 1 join)
            prisma.referralCode.count({
                where: {
                    campaign: { gymId: gym.id },
                    joinCount: { gt: 0 }
                }
            }),

            // Successful Joins (verified)
            prisma.referralJoin.count({
                where: {
                    referralCode: { campaign: { gymId: gym.id } },
                    verifiedByStaff: true
                }
            }),

            // Rewards Unlocked
            prisma.reward.count({
                where: {
                    referralCode: { campaign: { gymId: gym.id } },
                    status: { in: ["UNLOCKED", "GIVEN"] }
                }
            })
        ])

        return NextResponse.json({
            totalScans: 0, // Placeholder as we don't track raw scans yet
            activeMembers, // Total members
            successfulJoins,
            rewardsUnlocked
        })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
