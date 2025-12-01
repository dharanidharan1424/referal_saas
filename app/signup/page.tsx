import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignupForm } from "./signup-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your GymReferral account and start growing your gym with word-of-mouth marketing. Free trial available.",
    robots: {
        index: false,
        follow: true,
    },
}

export default async function SignupPage() {
    const session = await getServerSession(authOptions)

    // If already logged in, redirect to dashboard
    if (session) {
        redirect("/dashboard")
    }

    return <SignupForm />
}
