import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/signin');
    }

    // Try to get userId from token, or look up by email/githubUsername
    let userId = (session.user as any).id;

    if (!userId) {
        // Token doesn't have user ID - look up user by email
        const email = session.user.email;
        const githubUsername = (session.user as any).githubUsername || session.user.name;

        if (email) {
            const dbUser = await prisma.user.findUnique({
                where: { email },
            });
            if (dbUser) {
                userId = dbUser.id;
            }
        }

        // If still no userId, try by githubUsername
        if (!userId && githubUsername) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { githubUsername },
                        { name: githubUsername }
                    ]
                },
            });
            if (dbUser) {
                userId = dbUser.id;
            }
        }
    }

    // If we still don't have userId, show a helpful message with sign out option
    if (!userId) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold text-surface mb-4">
                        Welcome, {session.user.name}!
                    </h1>
                    <p className="text-surface/70 mb-4">
                        Your session needs to be refreshed. Please sign out and sign back in.
                    </p>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background-card border border-border mb-4">
                        {session.user.image && (
                            <img
                                src={session.user.image}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full"
                            />
                        )}
                        <div>
                            <p className="text-surface font-medium">{session.user.name}</p>
                            <p className="text-surface/50 text-sm">{session.user.email}</p>
                        </div>
                    </div>
                    <a href="/api/auth/signout" className="inline-block px-4 py-2 bg-primary text-white rounded-lg">
                        Sign out and sign back in
                    </a>
                </div>
            </div>
        );
    }

    try {
        // Fetch user's groups
        const memberships = await prisma.groupMember.findMany({
            where: { userId },
            include: {
                group: {
                    include: {
                        members: true,
                        challenges: {
                            where: {
                                OR: [{ status: 'ACTIVE' }, { status: 'VOTING' }],
                            },
                            include: {
                                submissions: {
                                    where: { userId },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { joinedAt: 'desc' },
        });

        const groups = memberships.map((m) => ({
            id: m.group.id,
            name: m.group.name,
            memberCount: m.group.members.length,
            activeChallenges: m.group.challenges.length,
            challenges: m.group.challenges.map((c) => ({
                id: c.id,
                title: c.title,
                endDate: c.endDate.toISOString(),
                status: c.status,
                hasSubmitted: c.submissions.length > 0,
            })),
        }));

        // Fetch user stats
        const totalSubmissions = await prisma.submission.count({
            where: { userId },
        });

        const avgScore = await prisma.submission.aggregate({
            where: { userId, finalScore: { not: null } },
            _avg: { finalScore: true },
        });

        const stats = {
            totalGroups: groups.length,
            totalChallenges: totalSubmissions,
            avgScore: avgScore._avg.finalScore || 0,
        };

        return <DashboardClient groups={groups} stats={stats} user={session.user} />;
    } catch (error) {
        console.error('Dashboard error:', error);

        // Fallback UI on error
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold text-surface mb-4">
                        Welcome back, {session.user.name}!
                    </h1>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background-card border border-border mb-6">
                        {session.user.image && (
                            <img
                                src={session.user.image}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full"
                            />
                        )}
                        <div>
                            <p className="text-surface font-medium">{session.user.name}</p>
                            <p className="text-surface/50 text-sm">{session.user.email}</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 rounded-lg bg-background-card border border-border">
                            <h3 className="font-semibold text-surface mb-2">Your Groups</h3>
                            <p className="text-surface/50 text-sm">No groups yet</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background-card border border-border">
                            <h3 className="font-semibold text-surface mb-2">Active Challenges</h3>
                            <p className="text-surface/50 text-sm">No active challenges</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background-card border border-border">
                            <h3 className="font-semibold text-surface mb-2">Recent Submissions</h3>
                            <p className="text-surface/50 text-sm">No submissions yet</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
