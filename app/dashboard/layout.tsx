import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Megaphone, Users, CheckCircle, Gift, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800">GymReferral</h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <NavLink href="/campaigns" icon={<Megaphone size={20} />} label="Campaigns" />
                    <NavLink href="/members" icon={<Users size={20} />} label="Members" />
                    <NavLink href="/verify" icon={<CheckCircle size={20} />} label="Verify Joins" />
                    <NavLink href="/rewards" icon={<Gift size={20} />} label="Rewards" />
                    <NavLink href="/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                            {session.user?.name?.[0] || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{session.user?.name}</p>
                            <p className="text-xs text-gray-500 truncate w-32">{session.user?.email}</p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout">
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <LogOut size={16} /> Logout
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    )
}
