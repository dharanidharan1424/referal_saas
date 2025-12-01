import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap, TrendingUp, Users } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GymReferral - Grow Your Gym with Word-of-Mouth",
  description: "Turn your members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically. Simple pricing at ₹999/month.",
  openGraph: {
    title: "GymReferral - Grow Your Gym with Word-of-Mouth",
    description: "Turn your members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically.",
    type: "website",
  },
}


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">GymReferral</div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Grow Your Gym with <span className="text-blue-600">Word-of-Mouth</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Turn your members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">Get Started for Free</Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8">How It Works</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Gyms Love Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Zap className="text-yellow-500" size={40} />}
              title="Instant Setup"
              description="Create a campaign in 2 minutes. Generate a QR code and start getting referrals immediately."
            />
            <BenefitCard
              icon={<TrendingUp className="text-green-500" size={40} />}
              title="Track Everything"
              description="Know exactly who referred whom. Track successful joins and reward unlocks in real-time."
            />
            <BenefitCard
              icon={<Users className="text-purple-500" size={40} />}
              title="Member Engagement"
              description="Gamify the experience for your members. They can track their progress and unlock rewards."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Step number={1} title="Create Campaign" description="Set a reward (e.g., 1 Month Free) and a target (e.g., 5 friends)." />
            <Step number={2} title="Members Scan & Share" description="Members scan your QR code to get their unique referral link." />
            <Step number={3} title="Verify & Reward" description="Staff verifies new joins. System automatically unlocks rewards." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Simple Pricing</h2>
          <div className="max-w-md mx-auto border rounded-2xl p-8 shadow-lg bg-white">
            <h3 className="text-2xl font-bold mb-4">Pro Plan</h3>
            <div className="text-4xl font-bold mb-6">₹999<span className="text-lg font-normal text-gray-500">/month</span></div>
            <ul className="space-y-4 text-left mb-8">
              <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Unlimited Campaigns</li>
              <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Unlimited Members</li>
              <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Analytics Dashboard</li>
              <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Priority Support</li>
            </ul>
            <Link href="/signup">
              <Button className="w-full text-lg">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-center text-gray-500">
        <p>© 2024 GymReferral SaaS. All rights reserved.</p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "GymReferral",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "Offer",
                price: "999",
                priceCurrency: "INR",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "999",
                  priceCurrency: "INR",
                  unitText: "MONTH",
                },
              },
              description: "Turn your gym members into your best marketing team. Create referral campaigns, track joins, and reward loyalty automatically.",
              featureList: [
                "Unlimited Campaigns",
                "Unlimited Members",
                "Analytics Dashboard",
                "Priority Support",
              ],
            }),
          }}
        />
      </footer>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
