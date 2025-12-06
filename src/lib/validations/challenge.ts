import { z } from 'zod';

export const weightsSchema = z
    .object({
        functionality: z.number().int().min(0).max(10),
        uiDesign: z.number().int().min(0).max(10),
        creativity: z.number().int().min(0).max(10),
        codeQuality: z.number().int().min(0).max(10),
    })
    .refine(
        (w) => w.functionality + w.uiDesign + w.creativity + w.codeQuality === 10,
        { message: 'Weights must sum to 10' }
    );

export const createChallengeSchema = z
    .object({
        title: z
            .string()
            .min(3, 'Title must be at least 3 characters')
            .max(100, 'Title must be less than 100 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        weights: weightsSchema,
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
        message: 'End date must be after start date',
        path: ['endDate'],
    });

export type Weights = z.infer<typeof weightsSchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
