import { z } from "zod";

export const formSchema = z.object({
  patientName: z.string().min(2).max(50),
  dateOfBirth: z.string().datetime(),
  caseNumber: z.string().optional(),
  injuryDescription: z.string().min(10).max(500),
  previousTreatment: z.string().min(5).max(500),
  patientGoals: z.string().min(10).max(500),
  referralSource: z.string().min(5).max(100),
  therapistNotes: z.string().min(5).max(1000),
});
