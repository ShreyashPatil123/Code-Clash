import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createChallengeSchema } from '@/lib/validations/challenge';

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
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Check membership
        const membership = await prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });

        if (!membership) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a member of this group' } },
                { status: 403 }
            );
        }

        const challenges = await prisma.challenge.findMany({
            where: {
                groupId,
                ...(status ? { status: status as any } : {}),
            },
            include: {
                createdBy: {
                    select: { id: true, name: true },
                },
                submissions: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            challenges: challenges.map((c) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                startDate: c.startDate,
                endDate: c.endDate,
                status: c.status,
                submissionCount: c.submissions.length,
                createdBy: c.createdBy,
                weights: {
                    functionality: c.weightFunctionality,
                    uiDesign: c.weightUiDesign,
                    creativity: c.weightCreativity,
                    codeQuality: c.weightCodeQuality,
                },
            })),
        });
    } catch (error) {
        console.error('Error fetching challenges:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

export async function POST(
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
        const body = await request.json();

        // Check membership
        const membership = await prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });

        if (!membership) {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Not a member of this group' } },
                { status: 403 }
            );
        }

        // Validate input
        const validatedData = createChallengeSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json(
                { error: { code: 'VALIDATION_ERROR', message: validatedData.error.errors[0].message } },
                { status: 400 }
            );
        }

        const { title, description, startDate, endDate, weights } = validatedData.data;

        // Create challenge with PENDING status (needs member approval)
        const challenge = await prisma.challenge.create({
            data: {
                groupId,
                createdById: userId,
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                weightFunctionality: weights.functionality,
                weightUiDesign: weights.uiDesign,
                weightCreativity: weights.creativity,
                weightCodeQuality: weights.codeQuality,
                status: 'PENDING',
            },
        });

        // Auto-approve from the creator
        await prisma.challengeApproval.create({
            data: {
                challengeId: challenge.id,
                userId,
                approved: true,
            },
        });

        // Check if this is a solo group (auto-activate)
        const memberCount = await prisma.groupMember.count({
            where: { groupId },
        });

        if (memberCount === 1) {
            // Solo group - auto-activate
            const now = new Date();
            const start = new Date(startDate);
            const newStatus = start <= now ? 'ACTIVE' : 'UPCOMING';

            await prisma.challenge.update({
                where: { id: challenge.id },
                data: { status: newStatus },
            });

            return NextResponse.json({
                id: challenge.id,
                title: challenge.title,
                status: newStatus,
                createdAt: challenge.createdAt,
            });
        }

        return NextResponse.json({
            id: challenge.id,
            title: challenge.title,
            status: challenge.status,
            createdAt: challenge.createdAt,
            message: 'Challenge created. Waiting for member approval (60% threshold).',
        });
    } catch (error) {
        console.error('Error creating challenge:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
