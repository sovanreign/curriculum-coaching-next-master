import { z } from "zod";

export const coachSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  coachId: z.string().min(1, "Coach ID is required"),
  yearLevel: z
    .union([
      z.literal("FIRST"),
      z.literal("SECOND"),
      z.literal("THIRD"),
      z.literal("FOURTH"),
      z.literal("FIFTH"),
    ])
    .optional(),
  courseId: z.number().optional(),
  departmentId: z.number().optional(),
});

export type CoachSchema = z.infer<typeof coachSchema>;
