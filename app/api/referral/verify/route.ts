import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const verifySchema = z.object({
    code: z.string(),
    phone: z.string().min(10),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { code, phone } = verifySchema.parse(body)

        // Find referral code
        const referralCode = await prisma.referralCode.findUnique({
            where: { code },
            include: { campaign: true },
        })

        if (!referralCode) {
            return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
        }

        // Check if gym owner owns this campaign
        const gym = await prisma.gym.findUnique({
            where: { id: referralCode.campaign.gymId },
        })

        if (!gym || gym.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized for this gym" }, { status: 403 })
        }

        // Check if this phone number has already been verified for this code (prevent double counting)
        const existingJoin = await prisma.referralJoin.findFirst({
            where: {
                referralCodeId: referralCode.id,
                joinedMemberPhone: phone,
            },
        })

        if (existingJoin) {
            return NextResponse.json({ error: "This member has already been verified" }, { status: 400 })
        }

        // Create verification record
        await prisma.referralJoin.create({
            data: {
                referralCodeId: referralCode.id,
                joinedMemberPhone: phone,
                verifiedByStaff: true,
                verifiedAt: new Date(),
            },
        })

        // Increment join count
        const updatedCode = await prisma.referralCode.update({
            where: { id: referralCode.id },
            data: { joinCount: { increment: 1 } },
        })

        // Check if reward should be unlocked
        if (updatedCode.joinCount >= referralCode.campaign.targetJoins) {
            // Check if reward already exists
            const existingReward = await prisma.reward.findFirst({
                where: { referralCodeId: referralCode.id },
            })

            if (!existingReward) {
                await prisma.reward.create({
                    data: {
                        referralCodeId: referralCode.id,
                        status: "UNLOCKED",
                        unlockedAt: new Date(),
                    },
                })
            }
        }

        return NextResponse.json({ success: true, message: "Verification successful" })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })

        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
