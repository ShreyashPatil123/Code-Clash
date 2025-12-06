import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSubmissionSchema } from '@/lib/validations/submission';

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

        // Verify challenge exists and user has access
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            include: {
                group: { include: { members: true } },
                submissions: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, githubUsername: true },
                        },
                        votes: true,
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

        const isMember = challenge.group.members.some((m) => m.userId === userId);
        if (!isMember) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a group member' } },
                { status: 403 }
            );
        }

        return NextResponse.json({
            submissions: challenge.submissions.map((s) => ({
                id: s.id,
                projectTitle: s.projectTitle,
                description: s.description,
                githubUrl: s.githubUrl,
                liveUrl: s.liveUrl,
                techStack: s.techStack,
                status: s.status,
                user: s.user,
                createdAt: s.createdAt,
                finalScore: s.finalScore,
                voteCount: s.votes.length,
            })),
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

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

        // Validate input
        const validatedData = createSubmissionSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json(
                { error: { code: 'VALIDATION_ERROR', message: validatedData.error.errors[0].message } },
                { status: 400 }
            );
        }

        // Check challenge exists and is active
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            include: { group: { include: { members: true } } },
        });

        if (!challenge) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Challenge not found' } },
                { status: 404 }
            );
        }

        if (challenge.status !== 'ACTIVE') {
            return NextResponse.json(
                { error: { code: 'BAD_REQUEST', message: 'Challenge is not accepting submissions' } },
                { status: 400 }
            );
        }

        const isMember = challenge.group.members.some((m) => m.userId === userId);
        if (!isMember) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a group member' } },
                { status: 403 }
            );
        }

        // Check for existing submission
        const existingSubmission = await prisma.submission.findUnique({
            where: { challengeId_userId: { challengeId, userId } },
        });

        if (existingSubmission) {
            return NextResponse.json(
                { error: { code: 'CONFLICT', message: 'Already submitted to this challenge' } },
                { status: 409 }
            );
        }

        const { projectTitle, description, githubUrl, liveUrl, techStack } = validatedData.data;

        const submission = await prisma.submission.create({
            data: {
                challengeId,
                userId,
                projectTitle,
                description,
                githubUrl,
                liveUrl: liveUrl || null,
                techStack,
                status: 'SUBMITTED',
            },
        });

        return NextResponse.json({
            id: submission.id,
            projectTitle: submission.projectTitle,
            status: submission.status,
            createdAt: submission.createdAt,
        });
    } catch (error) {
        console.error('Error creating submission:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
