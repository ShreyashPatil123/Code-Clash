import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileClient } from './ProfileClient';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/signin');
    }

    const userId = (session.user as any).id;

    // Fetch user with stats
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            groupMemberships: {
                include: {
                    group: {
                        select: { id: true, name: true },
                    },
                },
            },
            submissions: {
                include: {
                    challenge: {
                        select: { id: true, title: true, status: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
        },
    });

    if (!user) {
        redirect('/auth/signin');
    }

    // Calculate stats
    const totalChallenges = await prisma.submission.count({ where: { userId } });

    const avgScore = await prisma.submission.aggregate({
        where: { userId, finalScore: { not: null } },
        _avg: { finalScore: true },
    });

    // Count wins (first place finishes)
    const wins = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(DISTINCT s.id) as count
    FROM submissions s
    WHERE s.user_id = ${userId}
      AND s.final_score IS NOT NULL
      AND s.final_score = (
        SELECT MAX(s2.final_score)
        FROM submissions s2
        WHERE s2.challenge_id = s.challenge_id
      )
  `;

    const sidebarGroups = user.groupMemberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
    }));

    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
        stats: {
            totalChallenges,
            wins: Number(wins[0]?.count || 0),
            avgScore: avgScore._avg.finalScore || 0,
            groupCount: user.groupMemberships.length,
        },
        recentSubmissions: user.submissions.map((s) => ({
            id: s.id,
            projectTitle: s.projectTitle,
            finalScore: s.finalScore,
            createdAt: s.createdAt.toISOString(),
            challenge: s.challenge,
        })),
        groups: sidebarGroups,
    };

    return <ProfileClient user={userData} sidebarGroups={sidebarGroups} />;
}
