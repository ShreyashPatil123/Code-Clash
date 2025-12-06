import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE - Leave a group
export async function DELETE(
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

        // Get the group with members
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                members: {
                    orderBy: { joinedAt: 'asc' },
                },
                challenges: {
                    where: {
                        status: { in: ['ACTIVE', 'VOTING'] },
                    },
                    include: {
                        submissions: {
                            where: { userId },
                        },
                    },
                },
            },
        });

        if (!group) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Group not found' } },
                { status: 404 }
            );
        }

        // Check if user is a member
        const membership = group.members.find((m) => m.userId === userId);
        if (!membership) {
            return NextResponse.json(
                { error: { code: 'NOT_MEMBER', message: 'You are not a member of this group' } },
                { status: 400 }
            );
        }

        // Check if user has pending submissions in active challenges
        const hasActiveSubmissions = group.challenges.some(
            (c) => c.submissions.length > 0
        );
        if (hasActiveSubmissions) {
            return NextResponse.json(
                {
                    error: {
                        code: 'ACTIVE_SUBMISSIONS',
                        message: 'Cannot leave group while you have submissions in active challenges',
                    },
                },
                { status: 400 }
            );
        }

        const isAdmin = membership.isAdmin;
        const isLastMember = group.members.length === 1;

        // If last member, delete the entire group
        if (isLastMember) {
            await prisma.group.delete({
                where: { id: groupId },
            });

            return NextResponse.json({
                success: true,
                message: 'You have left the group. The group has been deleted as you were the last member.',
                groupDeleted: true,
            });
        }

        // If admin is leaving, transfer admin to the next oldest member
        if (isAdmin) {
            const nextAdmin = group.members.find(
                (m) => m.userId !== userId && !m.isAdmin
            );

            if (nextAdmin) {
                await prisma.groupMember.update({
                    where: { id: nextAdmin.id },
                    data: { isAdmin: true },
                });
            }
        }

        // Remove the user from the group
        await prisma.groupMember.delete({
            where: { groupId_userId: { groupId, userId } },
        });

        return NextResponse.json({
            success: true,
            message: isAdmin
                ? 'You have left the group. Admin privileges have been transferred.'
                : 'You have successfully left the group.',
            groupDeleted: false,
        });
    } catch (error) {
        console.error('Error leaving group:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
