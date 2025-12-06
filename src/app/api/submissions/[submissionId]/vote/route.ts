import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createVoteSchema } from '@/lib/validations/vote';

export async function POST(
    request: Request,
    { params }: { params: { submissionId: string } }
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
        const { submissionId } = params;
        const body = await request.json();

        // Get submission and challenge
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                challenge: {
                    include: {
                        group: { include: { members: true } },
                    },
                },
            },
        });

        if (!submission) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Submission not found' } },
                { status: 404 }
            );
        }

        const challenge = submission.challenge;

        // Check membership
        const isMember = challenge.group.members.some((m) => m.userId === userId);
        if (!isMember) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a group member' } },
                { status: 403 }
            );
        }

        // Check if voting on own submission
        if (submission.userId === userId) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Cannot vote on your own submission' } },
                { status: 403 }
            );
        }

        // Check challenge is in voting phase
        if (challenge.status !== 'VOTING') {
            return NextResponse.json(
                { error: { code: 'BAD_REQUEST', message: 'Challenge is not in voting phase' } },
                { status: 400 }
            );
        }

        // Validate vote scores against weights
        const weights = {
            functionality: challenge.weightFunctionality,
            uiDesign: challenge.weightUiDesign,
            creativity: challenge.weightCreativity,
            codeQuality: challenge.weightCodeQuality,
        };

        const voteSchema = createVoteSchema(weights);
        const validatedData = voteSchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json(
                { error: { code: 'VALIDATION_ERROR', message: validatedData.error.errors[0].message } },
                { status: 400 }
            );
        }

        // Check for existing vote
        const existingVote = await prisma.vote.findUnique({
            where: { submissionId_voterId: { submissionId, voterId: userId } },
        });

        if (existingVote) {
            return NextResponse.json(
                { error: { code: 'CONFLICT', message: 'Already voted on this submission' } },
                { status: 409 }
            );
        }

        const { functionality, uiDesign, creativity, codeQuality } = validatedData.data;
        const totalScore = functionality + uiDesign + creativity + codeQuality;

        const vote = await prisma.vote.create({
            data: {
                challengeId: challenge.id,
                submissionId,
                voterId: userId,
                scoreFunctionality: functionality,
                scoreUiDesign: uiDesign,
                scoreCreativity: creativity,
                scoreCodeQuality: codeQuality,
                totalScore,
            },
        });

        return NextResponse.json({
            id: vote.id,
            totalScore: vote.totalScore,
            createdAt: vote.createdAt,
        });
    } catch (error) {
        console.error('Error creating vote:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
