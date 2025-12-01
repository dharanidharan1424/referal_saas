import { Metadata } from "next"

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
const siteName = "GymReferral"
const siteDescription = "Turn your gym members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically."

interface MetadataOptions {
    title?: string
    description?: string
    path?: string
    image?: string
    noIndex?: boolean
}

export function generatePageMetadata({
    title,
    description = siteDescription,
    path = "",
    image = "/og-image.png",
    noIndex = false,
}: MetadataOptions = {}): Metadata {
    const fullTitle = title ? `${title} | ${siteName}` : siteName
    const url = `${baseUrl}${path}`

    return {
        title: fullTitle,
        description,
        applicationName: siteName,
        ...(noIndex && { robots: { index: false, follow: false } }),
        openGraph: {
            type: "website",
            url,
            title: fullTitle,
            description,
            siteName,
            images: [
                {
                    url: `${baseUrl}${image}`,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [`${baseUrl}${image}`],
        },
        alternates: {
            canonical: url,
        },
    }
}

export function generateDynamicMetadata(
    title: string,
    description: string,
    path: string
): Metadata {
    return generatePageMetadata({ title, description, path })
}
