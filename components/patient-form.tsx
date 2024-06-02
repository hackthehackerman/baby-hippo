import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const PatientForm = () => (
  <form className="grid gap-6">
    <div className="font-semibold">
      Physical Therapy Initial Evaluation Form
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="patient-name">Patient Name</Label>
        <Input id="patient-name" placeholder="Enter patient name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input id="dob" type="date" />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="chief-complaint">Chief Complaint</Label>
      <Textarea
        id="chief-complaint"
        placeholder="Describe the patient's main concern"
        className="min-h-[100px]"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="history">History of Present Illness</Label>
      <Textarea
        id="history"
        placeholder="Provide details on the patient's current condition"
        className="min-h-[150px]"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="past-medical">Past Medical History</Label>
      <Textarea
        id="past-medical"
        placeholder="List the patient's relevant medical history"
        className="min-h-[150px]"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="objective-findings">Objective Findings</Label>
      <Textarea
        id="objective-findings"
        placeholder="Describe your observations and assessments"
        className="min-h-[150px]"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="assessment">Assessment</Label>
      <Textarea
        id="assessment"
        placeholder="Provide your clinical analysis and diagnosis"
        className="min-h-[100px]"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="treatment-plan">Treatment Plan</Label>
      <Textarea
        id="treatment-plan"
        placeholder="Outline the recommended treatment approach"
        className="min-h-[150px]"
      />
    </div>
  </form>
);
