import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const markRewardSchema = z.object({
    rewardId: z.string(),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { rewardId } = markRewardSchema.parse(body)

        const reward = await prisma.reward.findUnique({
            where: { id: rewardId },
            include: { referralCode: { include: { campaign: true } } },
        })

        if (!reward) {
            return NextResponse.json({ error: "Reward not found" }, { status: 404 })
        }

        // Verify ownership
        const gym = await prisma.gym.findUnique({
            where: { id: reward.referralCode.campaign.gymId },
        })

        if (!gym || gym.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const updatedReward = await prisma.reward.update({
            where: { id: rewardId },
            data: {
                status: "GIVEN",
                givenAt: new Date(),
            },
        })

        return NextResponse.json(updatedReward)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
