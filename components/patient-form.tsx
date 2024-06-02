"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { formSchema } from "@/app/page";

export const PatientForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <Form {...form}>
      <form className="grid gap-6">
        <div className="font-semibold">
          Physical Therapy Initial Evaluation Form
        </div>
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormDescription>The patient's full, legal name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Number</FormLabel>
              <FormControl>
                <Input placeholder="2023001234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="injuryDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Injury</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the injury..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="previousTreatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Treatment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detail any previous treatment..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are the patient's rehabilitation goals?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referralSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referral Source</FormLabel>
              <FormControl>
                <Input placeholder="Doctor, Self-referred, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="therapistNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Therapist's Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes from the therapist..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
