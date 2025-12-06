import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GroupDashboardClient } from './GroupDashboardClient';

interface GroupPageProps {
    params: { groupId: string };
}

export default async function GroupDashboardPage({ params }: GroupPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/signin');
    }

    const userId = (session.user as any).id;
    const { groupId } = params;

    // Check membership
    const membership = await prisma.groupMember.findUnique({
        where: { groupId_userId: { groupId, userId } },
    });

    if (!membership) {
        notFound();
    }

    // Fetch group with details
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
            createdBy: {
                select: { id: true, name: true, avatarUrl: true },
            },
            members: {
                include: {
                    user: {
                        select: { id: true, name: true, avatarUrl: true, githubUsername: true },
                    },
                },
                orderBy: { joinedAt: 'asc' },
            },
            challenges: {
                include: {
                    submissions: true,
                    createdBy: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!group) {
        notFound();
    }

    // Get user's groups for sidebar
    const memberships = await prisma.groupMember.findMany({
        where: { userId },
        include: { group: { select: { id: true, name: true } } },
    });

    const sidebarGroups = memberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
    }));

    // Transform data
    const groupData = {
        id: group.id,
        name: group.name,
        inviteCode: group.inviteCode,
        createdBy: group.createdBy,
        createdAt: group.createdAt.toISOString(),
        members: group.members.map((m) => ({
            ...m.user,
            joinedAt: m.joinedAt.toISOString(),
        })),
        challenges: group.challenges.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            startDate: c.startDate.toISOString(),
            endDate: c.endDate.toISOString(),
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
    };

    return (
        <GroupDashboardClient
            group={groupData}
            sidebarGroups={sidebarGroups}
            currentUserId={userId}
        />
    );
}
