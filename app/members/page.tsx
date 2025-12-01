import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Members",
    description: "View and manage your gym members and their referral activity.",
}

export const revalidate = 30


export default async function MembersPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login?from=/members")
    }

    const gym = await prisma.gym.findFirst({
        where: { ownerId: session.user.id },
    })

    if (!gym) return <div>Gym not found</div>

    const members = await prisma.member.findMany({
        where: { gymId: gym.id },
        include: {
            referralCodes: {
                include: { _count: { select: { referralJoins: true } } }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Members</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Members ({members.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead>Referrals Made</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => {
                                const totalReferrals = member.referralCodes.reduce((acc, code) => acc + code._count.referralJoins, 0)
                                return (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.phone}</TableCell>
                                        <TableCell>{member.createdAt.toLocaleDateString()}</TableCell>
                                        <TableCell>{totalReferrals}</TableCell>
                                    </TableRow>
                                )
                            })}
                            {members.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                        No members yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
