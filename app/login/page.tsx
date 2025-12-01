import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "./login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your GymReferral account to manage your referral campaigns and track member growth.",
    robots: {
        index: false,
        follow: true,
    },
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string }>
}) {
    const session = await getServerSession(authOptions)
    const params = await searchParams

    // If already logged in, redirect to dashboard
    if (session) {
        redirect(params.from || "/dashboard")
    }

    const redirectTo = params.from || "/dashboard"

    return <LoginForm redirectTo={redirectTo} />
}
