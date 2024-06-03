import { z } from "zod";

export const formSchema = z.object({
  patientName: z.string().min(2).max(50).describe("The patient's full name"),
  dateOfBirth: z
    .string()
    .datetime()
    .describe("The patient's date of birth (yyyy-MM-dd format)"),
  caseNumber: z.string().optional().describe("The patient's case number"),
  injuryDescription: z
    .string()
    .min(10)
    .max(500)
    .describe("Description of the patient's injury"),
  previousTreatment: z
    .string()
    .min(5)
    .max(500)
    .describe(
      "Information about any previous treatment the patient has sought for their injury",
    ),
  patientGoals: z
    .string()
    .min(10)
    .max(500)
    .describe(
      "The goals the patient wants to achieve through this appointment/subsequent appointments",
    ),
  referralSource: z
    .string()
    .min(5)
    .max(100)
    .describe(
      "Name of person/organization that referred the patient to this facility/doctor",
    ),
  therapistNotes: z
    .string()
    .min(5)
    .max(1000)
    .describe(
      "An overall summary of the interaction, including interesting highlights, notes, or suggestions",
    ),
});
