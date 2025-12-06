import { z } from 'zod';
import { Weights } from './challenge';

export function createVoteSchema(weights: Weights) {
    return z.object({
        functionality: z
            .number()
            .int()
            .min(0)
            .max(weights.functionality, `Max is ${weights.functionality}`),
        uiDesign: z
            .number()
            .int()
            .min(0)
            .max(weights.uiDesign, `Max is ${weights.uiDesign}`),
        creativity: z
            .number()
            .int()
            .min(0)
            .max(weights.creativity, `Max is ${weights.creativity}`),
        codeQuality: z
            .number()
            .int()
            .min(0)
            .max(weights.codeQuality, `Max is ${weights.codeQuality}`),
    });
}

export type VoteInput = {
    functionality: number;
    uiDesign: number;
    creativity: number;
    codeQuality: number;
};
