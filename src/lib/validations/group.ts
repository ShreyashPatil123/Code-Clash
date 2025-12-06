import { z } from 'zod';

export const createGroupSchema = z.object({
    name: z
        .string()
        .min(3, 'Group name must be at least 3 characters')
        .max(50, 'Group name must be less than 50 characters'),
});

export const joinGroupSchema = z.object({
    inviteCode: z
        .string()
        .length(8, 'Invite code must be 8 characters')
        .toUpperCase(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;
