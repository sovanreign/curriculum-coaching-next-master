import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  studentId: z.string().min(1, "Student ID is required"),
  yearLevel: z
    .union([
      z.literal("FIRST"),
      z.literal("SECOND"),
      z.literal("THIRD"),
      z.literal("FOURTH"),
      z.literal("FIFTH"),
    ])
    .optional(),
  departmentId: z.number().optional(),
  courseId: z.number().optional(),
});

export type StudentSchema = z.infer<typeof studentSchema>;
