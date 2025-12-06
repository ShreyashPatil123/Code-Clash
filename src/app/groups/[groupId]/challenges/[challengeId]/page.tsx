import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChallengeDetailClient } from './ChallengeDetailClient';

interface ChallengePageProps {
    params: { groupId: string; challengeId: string };
}

export default async function ChallengeDetailPage({ params }: ChallengePageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/signin');
    }

    const userId = (session.user as any).id;
    const { groupId, challengeId } = params;

    // Check membership
    const membership = await prisma.groupMember.findUnique({
        where: { groupId_userId: { groupId, userId } },
    });

    if (!membership) {
        notFound();
    }

    // Fetch challenge with details
    const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
        include: {
            group: {
                select: { id: true, name: true },
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
                orderBy: { createdAt: 'desc' },
            },
            votes: true,
        },
    });

    if (!challenge) {
        notFound();
    }

    // Find user's submission
    const mySubmission = challenge.submissions.find((s) => s.userId === userId);

    // Calculate voting progress
    const totalParticipants = challenge.submissions.length;
    const totalVotesNeeded = totalParticipants > 1 ? totalParticipants * (totalParticipants - 1) : 0;
    const votesCompleted = challenge.votes.length;

    const myVotes = challenge.votes.filter((v) => v.voterId === userId);
    const otherSubmissions = challenge.submissions.filter((s) => s.userId !== userId);

    // Get sidebar groups
    const memberships = await prisma.groupMember.findMany({
        where: { userId },
        include: { group: { select: { id: true, name: true } } },
    });

    const sidebarGroups = memberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
    }));

    const challengeData = {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        startDate: challenge.startDate.toISOString(),
        endDate: challenge.endDate.toISOString(),
        status: challenge.status,
        weights: {
            functionality: challenge.weightFunctionality,
            uiDesign: challenge.weightUiDesign,
            creativity: challenge.weightCreativity,
            codeQuality: challenge.weightCodeQuality,
        },
        createdBy: challenge.createdBy,
        group: challenge.group,
        submissions: challenge.submissions.map((s) => ({
            id: s.id,
            projectTitle: s.projectTitle,
            description: s.description,
            githubUrl: s.githubUrl,
            liveUrl: s.liveUrl,
            techStack: s.techStack,
            status: s.status,
            finalScore: s.finalScore,
            user: s.user,
            createdAt: s.createdAt.toISOString(),
            voteCount: s.votes.length,
            hasVoted: s.votes.some((v) => v.voterId === userId),
        })),
        mySubmission: mySubmission
            ? {
                id: mySubmission.id,
                projectTitle: mySubmission.projectTitle,
                status: mySubmission.status,
            }
            : null,
        votingProgress: {
            totalVotesNeeded,
            votesCompleted,
            myVotesCompleted: myVotes.length,
            myVotesNeeded: otherSubmissions.length,
        },
    };

    return (
        <ChallengeDetailClient
            challenge={challengeData}
            sidebarGroups={sidebarGroups}
            currentUserId={userId}
        />
    );
}
