"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Input, Button, Spinner, TextArea, ListBox, ListBoxItem } from "@heroui/react";
import { type Admission } from "@/types";
import { useAdmissions } from "@/hooks/use-admissions";
import { PatientAutocomplete, WardAutocomplete } from "@/components/ui";

interface Ward {
  id: string;
  name: string;
  code: string;
}

const DUMMY_WARDS: Ward[] = [
  { id: "ward-1", name: "General Ward A", code: "GW-A" },
  { id: "ward-2", name: "General Ward B", code: "GW-B" },
  { id: "ward-3", name: "ICU", code: "ICU" },
  { id: "ward-4", name: "Pediatric Ward", code: "PED" },
  { id: "ward-5", name: "Maternity Ward", code: "MAT" },
  { id: "ward-6", name: "Surgical Ward", code: "SURG" },
  { id: "ward-7", name: "Emergency Ward", code: "ER" },
  { id: "ward-8", name: "Private Room 1", code: "PR-1" },
  { id: "ward-9", name: "Private Room 2", code: "PR-2" },
  { id: "ward-10", name: "Isolation Ward", code: "ISO" },
];

function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const formSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  wardId: z.string().min(1, "Ward is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  dischargeDate: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AdmissionFormProps {
  admission?: Admission;
  onClose: () => void;
}

export function AdmissionForm({ admission, onClose }: AdmissionFormProps) {
  const { createAdmission, updateAdmission, isCreating, isUpdating } = useAdmissions();
  const isEditing = !!admission;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: admission
      ? {
          patientId: admission.patientId,
          wardId: admission.wardId,
          diagnosis: admission.diagnosis ?? "",
          admissionDate: admission.admissionDate?.split("T")[0] ?? "",
          dischargeDate: admission.dischargeDate?.split("T")[0] ?? "",
          notes: admission.notes ?? "",
        }
      : {
          patientId: "",
          wardId: "",
          diagnosis: "",
          admissionDate: getTodayDate(),
          dischargeDate: "",
          notes: "",
        },
  });

  async function onSubmit(data: FormValues) {
    if (isEditing && admission) {
      await updateAdmission(admission.id, data);
    } else {
      await createAdmission(data);
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <PatientAutocomplete
                selectedKey={field.value || null}
                onSelectionChange={(key) => field.onChange(key)}
                label="Patient"
                placeholder="Search patients..."
                required
                error={errors.patientId?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Controller
            name="wardId"
            control={control}
            render={({ field }) => (
              <WardAutocomplete
                selectedKey={field.value || null}
                onSelectionChange={(key) => field.onChange(key)}
                label="Ward"
                placeholder="Search wards..."
                required
                error={errors.wardId?.message}
              />
            )}
          />
        </div>
        {/* <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">
            Ward <span className="text-danger">*</span>
          </label>
          <Controller
            name="wardId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                items={DUMMY_WARDS as Iterable<Ward, "single">}
                selectedKey={field.value || null}
                onSelectionChange={(key) => field.onChange(key as string)}
              >
                <Autocomplete.Trigger>
                  <Autocomplete.Value />
                  <Autocomplete.Indicator />
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                  <ListBox items={DUMMY_WARDS} selectionMode="single">
                    {(ward: Ward) => (
                      <ListBoxItem key={ward.id} textValue={ward.name}>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{ward.name}</span>
                          <span className="text-xs text-default-400">{ward.code}</span>
                        </div>
                      </ListBoxItem>
                    )}
                  </ListBox>
                </Autocomplete.Popover>
              </Autocomplete>
            )}
          />
          {errors.wardId && (
            <p className="text-sm text-danger">{errors.wardId.message}</p>
          )}
        </div> */}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="admissionDate" className="text-sm font-medium">
            Admission Date <span className="text-danger">*</span>
          </label>
          <Input
            id="admissionDate"
            type="date"
            {...register("admissionDate")}
          />
          {errors.admissionDate && (
            <p className="text-sm text-danger">{errors.admissionDate.message}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dischargeDate" className="text-sm font-medium">
              Discharge Date
            </label>
            <Input
              id="dischargeDate"
              type="date"
              {...register("dischargeDate")}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="diagnosis" className="text-sm font-medium">
          Diagnosis
        </label>
        <TextArea
          id="diagnosis"
          placeholder="Enter diagnosis (optional)"
          {...register("diagnosis")}
        />
        {errors.diagnosis && (
          <p className="text-sm text-danger">{errors.diagnosis.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <TextArea
          id="notes"
          placeholder="Enter additional notes (optional)"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onPress={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isDisabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : (
            isEditing ? "Update Admission" : "Create Admission"
          )}
        </Button>
      </div>
    </form>
  );
}
