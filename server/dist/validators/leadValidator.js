import { z } from 'zod';
export const createLeadSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
});
export const updateLeadSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
});
