import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Approve or reject a pending challenge
export async function POST(
    request: Request,
    { params }: { params: { challengeId: string } }
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
        const { challengeId } = params;
        const body = await request.json();
        const { approved } = body;

        if (typeof approved !== 'boolean') {
            return NextResponse.json(
                { error: { code: 'VALIDATION_ERROR', message: 'approved must be a boolean' } },
                { status: 400 }
            );
        }

        // Get the challenge and verify it's pending
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            include: {
                group: {
                    include: {
                        members: true,
                    },
                },
                approvals: true,
            },
        });

        if (!challenge) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Challenge not found' } },
                { status: 404 }
            );
        }

        if (challenge.status !== 'PENDING') {
            return NextResponse.json(
                { error: { code: 'INVALID_STATE', message: 'Challenge is not pending approval' } },
                { status: 400 }
            );
        }

        // Check if user is a member of the group
        const isMember = challenge.group.members.some((m) => m.userId === userId);
        if (!isMember) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a member of this group' } },
                { status: 403 }
            );
        }

        // Upsert approval (allows changing vote)
        await prisma.challengeApproval.upsert({
            where: {
                challengeId_userId: { challengeId, userId },
            },
            create: {
                challengeId,
                userId,
                approved,
            },
            update: {
                approved,
            },
        });

        // Get updated approval count
        const approvals = await prisma.challengeApproval.findMany({
            where: { challengeId },
        });

        const totalMembers = challenge.group.members.length;
        const approvedCount = approvals.filter((a) => a.approved).length;
        const rejectedCount = approvals.filter((a) => !a.approved).length;
        const threshold = Math.ceil(totalMembers * 0.6); // 60% threshold

        let newStatus: string = challenge.status;

        // Check if approved (60% approved)
        if (approvedCount >= threshold) {
            // Determine if UPCOMING or ACTIVE based on start date
            const now = new Date();
            const start = new Date(challenge.startDate);
            newStatus = start <= now ? 'ACTIVE' : 'UPCOMING';

            await prisma.challenge.update({
                where: { id: challengeId },
                data: { status: newStatus as 'ACTIVE' | 'UPCOMING' },
            });
        }

        // Check if rejected (more than 40% rejected means it can never reach 60% approval)
        const maxPossibleApprovals = approvedCount + (totalMembers - approvals.length);
        if (maxPossibleApprovals < threshold) {
            // Cannot reach threshold anymore - could mark as rejected
            // For now, we'll leave it pending but inform the user
        }

        return NextResponse.json({
            success: true,
            approval: {
                approved,
                totalMembers,
                approvedCount,
                rejectedCount,
                threshold,
                challengeStatus: newStatus,
            },
        });
    } catch (error) {
        console.error('Error approving challenge:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

// GET - Get approval status for a challenge
export async function GET(
    request: Request,
    { params }: { params: { challengeId: string } }
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
        const { challengeId } = params;

        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            include: {
                group: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: { id: true, name: true, avatarUrl: true },
                                },
                            },
                        },
                    },
                },
                approvals: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true },
                        },
                    },
                },
            },
        });

        if (!challenge) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Challenge not found' } },
                { status: 404 }
            );
        }

        // Check if user is a member
        const isMember = challenge.group.members.some((m) => m.userId === userId);
        if (!isMember) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a member of this group' } },
                { status: 403 }
            );
        }

        const totalMembers = challenge.group.members.length;
        const approvedCount = challenge.approvals.filter((a) => a.approved).length;
        const rejectedCount = challenge.approvals.filter((a) => !a.approved).length;
        const threshold = Math.ceil(totalMembers * 0.6);
        const userApproval = challenge.approvals.find((a) => a.userId === userId);

        return NextResponse.json({
            challengeId,
            status: challenge.status,
            totalMembers,
            approvedCount,
            rejectedCount,
            threshold,
            progress: Math.round((approvedCount / threshold) * 100),
            userVote: userApproval ? userApproval.approved : null,
            approvals: challenge.approvals.map((a) => ({
                user: a.user,
                approved: a.approved,
                createdAt: a.createdAt,
            })),
        });
    } catch (error) {
        console.error('Error fetching approval status:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
