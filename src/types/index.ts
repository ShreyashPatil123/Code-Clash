import { ChallengeStatus, SubmissionStatus } from '@prisma/client';

// Re-export Prisma enums
export { ChallengeStatus, SubmissionStatus };

// User types
export interface User {
    id: string;
    email: string;
    name: string | null;
    githubUsername: string;
    avatarUrl: string | null;
    createdAt: Date;
}

export interface UserWithStats extends User {
    stats: {
        totalChallenges: number;
        wins: number;
        avgScore: number;
        groupCount: number;
    };
}

// Group types
export interface Group {
    id: string;
    name: string;
    inviteCode: string;
    createdById: string;
    createdAt: Date;
    createdBy?: User;
    memberCount?: number;
    activeChallenges?: number;
}

export interface GroupMember {
    id: string;
    groupId: string;
    userId: string;
    joinedAt: Date;
    user: User;
}

// Challenge types
export interface Weights {
    functionality: number;
    uiDesign: number;
    creativity: number;
    codeQuality: number;
}

export interface Challenge {
    id: string;
    groupId: string;
    createdById: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    weightFunctionality: number;
    weightUiDesign: number;
    weightCreativity: number;
    weightCodeQuality: number;
    status: ChallengeStatus;
    createdAt: Date;
    group?: Group;
    createdBy?: User;
    submissionCount?: number;
}

export interface ChallengeWithWeights extends Challenge {
    weights: Weights;
}

// Submission types
export interface Submission {
    id: string;
    challengeId: string;
    userId: string;
    projectTitle: string;
    description: string;
    githubUrl: string;
    liveUrl: string | null;
    techStack: string[];
    status: SubmissionStatus;
    finalScore: number | null;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    challenge?: Challenge;
}

// Vote types
export interface Vote {
    id: string;
    challengeId: string;
    submissionId: string;
    voterId: string;
    scoreFunctionality: number;
    scoreUiDesign: number;
    scoreCreativity: number;
    scoreCodeQuality: number;
    totalScore: number;
    createdAt: Date;
    voter?: User;
}

export interface Scores {
    functionality: number;
    uiDesign: number;
    creativity: number;
    codeQuality: number;
}

// AI Analysis types
export interface AIAnalysis {
    id: string;
    submissionId: string;
    triggeredById: string;
    scoreFunctionality: number;
    scoreUiDesign: number;
    scoreCreativity: number;
    scoreCodeQuality: number;
    feedback: string;
    analyzedAt: Date;
}

// Leaderboard types
export interface LeaderboardEntry {
    rank: number;
    user: User;
    submission?: {
        id: string;
        projectTitle: string;
    };
    score: number;
    wins?: number;
    scores?: Scores;
}

// API Response types
export interface ApiError {
    error: {
        code: string;
        message: string;
        details?: Record<string, string>;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        perPage: number;
        total: number;
        hasMore: boolean;
    };
}
