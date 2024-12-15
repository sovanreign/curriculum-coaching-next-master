import { z } from 'zod';

// Update Schema
export const userUpdateSchema = z.object({
    firstName: z.string().min(1, { message: "First name must not be empty" }).optional(),
    lastName: z.string().min(1, { message: "Last name must not be empty" }).optional(),
    contactNumber: z.string()
        .regex(/^\+?\d{10,15}$/, { message: "Contact number must be a valid phone number" })
        .optional(),
    department: z.string().min(1, { message: "Department must not be empty" }).optional(),
    emailAddress: z.string()
        .email({ message: "Email address must be a valid email" })
        .optional(),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .optional(),
    address: z.string().min(1, { message: "Address must not be empty" }).optional(),
});

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
