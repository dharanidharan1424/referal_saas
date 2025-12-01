import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ScanForm } from "./scan-form"
import { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ gymId: string }>
}): Promise<Metadata> {
    const { gymId } = await params
    const gym = await prisma.gym.findUnique({
        where: { id: gymId },
        select: { name: true },
    })

    if (!gym) {
        return {
            title: "Gym Not Found",
        }
    }

    return {
        title: `Join ${gym.name}`,
        description: `Join ${gym.name} and start earning rewards by referring your friends. Get your unique referral code now!`,
        robots: {
            index: false,
            follow: false,
        },
    }
}

export async function generateStaticParams() {
    // Pre-generate pages for active gyms
    const gyms = await prisma.gym.findMany({
        select: { id: true },
        take: 50, // Limit to most recent gyms
    })

    return gyms.map((gym) => ({
        gymId: gym.id,
    }))
}

export default async function ScanPage({
    params,
}: {
    params: Promise<{ gymId: string }>
}) {
    const { gymId } = await params

    const gym = await prisma.gym.findUnique({
        where: { id: gymId },
        select: { id: true, name: true },
    })

    if (!gym) {
        notFound()
    }

    return <ScanForm gymId={gym.id} gymName={gym.name} />
}
