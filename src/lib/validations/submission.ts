import { z } from 'zod';

export const createSubmissionSchema = z.object({
    projectTitle: z
        .string()
        .min(3, 'Project title must be at least 3 characters')
        .max(100, 'Project title must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    githubUrl: z
        .string()
        .url('Must be a valid URL')
        .regex(
            /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/,
            'Must be a valid GitHub repository URL'
        ),
    liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    techStack: z.array(z.string()).min(1, 'Add at least one technology'),
});

export const updateSubmissionSchema = createSubmissionSchema.partial();

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
