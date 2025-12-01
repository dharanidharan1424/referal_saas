import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { VerifyForm } from "./verify-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Verify New Member",
    description: "Staff verification portal for new gym member referrals.",
    robots: {
        index: false,
        follow: false,
    },
}

export default async function VerifyPage() {
    const session = await getServerSession(authOptions)

    // Require authentication for verification
    if (!session) {
        redirect("/login?from=/verify")
    }

    return <VerifyForm />
}
