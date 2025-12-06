import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateInviteCode } from '@/lib/utils';
import { createGroupSchema } from '@/lib/validations/group';

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
        const validatedData = createGroupSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json(
                { error: { code: 'VALIDATION_ERROR', message: validatedData.error.errors[0].message } },
                { status: 400 }
            );
        }

        // Generate unique invite code
        let inviteCode = generateInviteCode();
        let codeExists = await prisma.group.findUnique({ where: { inviteCode } });
        while (codeExists) {
            inviteCode = generateInviteCode();
            codeExists = await prisma.group.findUnique({ where: { inviteCode } });
        }

        // Create group and add creator as member
        const group = await prisma.group.create({
            data: {
                name: validatedData.data.name,
                inviteCode,
                createdById: userId,
                members: {
                    create: {
                        userId,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        return NextResponse.json({
            id: group.id,
            name: group.name,
            inviteCode: group.inviteCode,
            createdAt: group.createdAt,
            memberCount: group.members.length,
        });
    } catch (error) {
        console.error('Error creating group:', error);
        return NextResponse.json(
            { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
