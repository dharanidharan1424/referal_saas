import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { nanoid } from "nanoid"

const memberSchema = z.object({
    gymId: z.string(),
    name: z.string().min(2),
    phone: z.string().min(10),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { gymId, name, phone } = memberSchema.parse(body)

        // Check if member already exists in this gym
        let member = await prisma.member.findUnique({
            where: {
                gymId_phone: {
                    gymId,
                    phone,
                },
            },
        })

        if (!member) {
            member = await prisma.member.create({
                data: {
                    gymId,
                    name,
                    phone,
                },
            })
        }

        // Find active campaign for this gym
        const campaign = await prisma.campaign.findFirst({
            where: { gymId, isActive: true },
            orderBy: { createdAt: "desc" },
        })

        if (!campaign) {
            return NextResponse.json({ error: "No active campaign found" }, { status: 404 })
        }

        // Check if referral code already exists for this member and campaign
        let referralCode = await prisma.referralCode.findFirst({
            where: {
                memberId: member.id,
                campaignId: campaign.id,
            },
        })

        if (!referralCode) {
            referralCode = await prisma.referralCode.create({
                data: {
                    memberId: member.id,
                    campaignId: campaign.id,
                    code: nanoid(8).toUpperCase(), // Generate unique code
                },
            })
        }

        return NextResponse.json({ code: referralCode.code }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues },   // ✅ FIXED
                { status: 400 }
            )
        }

        console.error("Campaign Create Error:", error)

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }

}
