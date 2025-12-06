import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { joinGroupSchema } from '@/lib/validations/group';

export async function POST(request: Request) {
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

        // Validate input
        const validatedData = joinGroupSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json(
                { error: { code: 'VALIDATION_ERROR', message: validatedData.error.errors[0].message } },
                { status: 400 }
            );
        }

        // Find group by invite code
        const group = await prisma.group.findUnique({
            where: { inviteCode: validatedData.data.inviteCode.toUpperCase() },
        });

        if (!group) {
            return NextResponse.json(
                { error: { code: 'NOT_FOUND', message: 'Invalid invite code' } },
                { status: 404 }
            );
        }

        // Check if already a member
        const existingMember = await prisma.groupMember.findUnique({
            where: {
                groupId_userId: {
                    groupId: group.id,
                    userId,
                },
            },
        });

        if (existingMember) {
            return NextResponse.json(
                { error: { code: 'CONFLICT', message: 'Already a member of this group' } },
                { status: 409 }
            );
        }

        // Add user to group
        await prisma.groupMember.create({
            data: {
                groupId: group.id,
                userId,
            },
        });

        return NextResponse.json({
            group: {
                id: group.id,
                name: group.name,
            },
            joined: true,
        });
    } catch (error) {
        console.error('Error joining group:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
