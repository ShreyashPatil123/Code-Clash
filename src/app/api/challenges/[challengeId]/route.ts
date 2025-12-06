import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
                        members: true,
                    },
                },
                createdBy: {
                    select: { id: true, name: true, avatarUrl: true },
                },
                submissions: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, githubUsername: true },
                        },
                        votes: true,
                    },
                },
                votes: true,
            },
        });

        if (!challenge) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Challenge not found' } },
                { status: 404 }
            );
        }

        // Check membership
        const isMember = challenge.group.members.some((m) => m.userId === userId);
        if (!isMember) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a member of this group' } },
                { status: 403 }
            );
        }

        // Find user's submission
        const mySubmission = challenge.submissions.find((s) => s.userId === userId);

        // Calculate voting progress
        const totalParticipants = challenge.submissions.length;
        const totalVotesNeeded = totalParticipants * (totalParticipants - 1);
        const votesCompleted = challenge.votes.length;

        const myVotes = challenge.votes.filter((v) => v.voterId === userId);
        const otherSubmissions = challenge.submissions.filter((s) => s.userId !== userId);

        return NextResponse.json({
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            startDate: challenge.startDate,
            endDate: challenge.endDate,
            status: challenge.status,
            weights: {
                functionality: challenge.weightFunctionality,
                uiDesign: challenge.weightUiDesign,
                creativity: challenge.weightCreativity,
                codeQuality: challenge.weightCodeQuality,
            },
            createdBy: challenge.createdBy,
            group: {
                id: challenge.group.id,
                name: challenge.group.name,
            },
            submissionCount: challenge.submissions.length,
            mySubmission: mySubmission
                ? {
                    id: mySubmission.id,
                    status: mySubmission.status,
                    projectTitle: mySubmission.projectTitle,
                }
                : null,
            votingProgress: {
                totalVotesNeeded,
                votesCompleted,
                myVotesCompleted: myVotes.length,
                myVotesNeeded: otherSubmissions.length,
            },
        });
    } catch (error) {
        console.error('Error fetching challenge:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
