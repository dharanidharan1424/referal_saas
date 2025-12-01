import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { NewCampaignForm } from "./new-campaign-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Create New Campaign",
    description: "Create a new referral campaign for your gym members.",
    robots: {
        index: false,
        follow: false,
    },
}

export default async function NewCampaignPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login?from=/campaigns/new")
    }

    // Verify user has a gym
    const gym = await prisma.gym.findFirst({
        where: { ownerId: session.user.id },
    })

    if (!gym) {
        redirect("/dashboard")
    }

    return <NewCampaignForm />
}
