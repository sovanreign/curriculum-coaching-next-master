import { z } from 'zod';

export const RoleEnum = z.enum(["COACH", "ADMIN", "STUDENT"]);

export const signInSchema = z.object({
    role: RoleEnum,
    username: z.string().min(1, { message: "Username must not be empty" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type RoleEnum = z.infer<typeof RoleEnum>;
