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

        const memberships = await prisma.groupMember.findMany({
            where: { userId },
            include: {
                group: {
                    include: {
                        members: true,
                        challenges: {
                            where: { status: 'ACTIVE' },
                        },
                    },
                },
            },
            orderBy: { joinedAt: 'desc' },
        });

        const groups = memberships.map((m) => ({
            id: m.group.id,
            name: m.group.name,
            inviteCode: m.group.inviteCode,
            memberCount: m.group.members.length,
            activeChallenges: m.group.challenges.length,
            joinedAt: m.joinedAt,
        }));

        return NextResponse.json({ groups });
    } catch (error) {
        console.error('Error fetching groups:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
