import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const campaignSchema = z.object({
    title: z.string().min(2),
    rewardName: z.string().min(2),
    targetJoins: z.coerce.number().min(1),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { title, rewardName, targetJoins } = campaignSchema.parse(body)

        const gym = await prisma.gym.findFirst({
            where: { ownerId: session.user.id },
        })

        if (!gym) {
            return NextResponse.json({ error: "Gym not found" }, { status: 404 })
        }

        const campaign = await prisma.campaign.create({
            data: {
                gymId: gym.id,
                title,
                rewardName,
                targetJoins,
            },
        })

        return NextResponse.json(campaign, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
