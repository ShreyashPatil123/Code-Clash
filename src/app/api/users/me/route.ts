import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                groupMemberships: {
                    include: {
                        group: {
                            include: {
                                challenges: {
                                    where: { status: 'ACTIVE' },
                                },
                                members: true,
                            },
                        },
                    },
                },
                submissions: {
                    where: { finalScore: { not: null } },
                    orderBy: { finalScore: 'desc' },
                    take: 1,
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'User not found' } },
                { status: 404 }
            );
        }

        // Calculate stats
        const totalChallenges = await prisma.submission.count({
            where: { userId },
        });

        const wins = await prisma.submission.count({
            where: {
                userId,
                finalScore: { not: null },
                // Complex query for wins would require raw SQL
            },
        });

        const avgScoreResult = await prisma.submission.aggregate({
            where: { userId, finalScore: { not: null } },
            _avg: { finalScore: true },
        });

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            githubUsername: user.githubUsername,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            stats: {
                totalChallenges,
                wins: wins, // Simplified
                avgScore: avgScoreResult._avg.finalScore || 0,
                groupCount: user.groupMemberships.length,
            },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;
        const body = await request.json();

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: body.name,
            },
        });

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            githubUsername: user.githubUsername,
            avatarUrl: user.avatarUrl,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
