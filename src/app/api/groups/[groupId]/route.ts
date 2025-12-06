import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { groupId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;
        const { groupId } = params;

        // Check if user is member
        const membership = await prisma.groupMember.findUnique({
            where: {
                groupId_userId: {
                    groupId,
                    userId,
                },
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a member of this group' } },
                { status: 403 }
            );
        }

        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                createdBy: {
                    select: { id: true, name: true, avatarUrl: true },
                },
                members: true,
                challenges: true,
            },
        });

        if (!group) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Group not found' } },
                { status: 404 }
            );
        }

        const activeChallenges = group.challenges.filter((c) => c.status === 'ACTIVE');
        const completedChallenges = group.challenges.filter((c) => c.status === 'COMPLETED');

        return NextResponse.json({
            id: group.id,
            name: group.name,
            inviteCode: group.inviteCode,
            createdBy: group.createdBy,
            memberCount: group.members.length,
            createdAt: group.createdAt,
            stats: {
                totalChallenges: group.challenges.length,
                activeChallenges: activeChallenges.length,
                completedChallenges: completedChallenges.length,
            },
        });
    } catch (error) {
        console.error('Error fetching group:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
