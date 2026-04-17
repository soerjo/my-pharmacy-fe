"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Input, Button, Spinner, TextArea, ListBox, ListBoxItem } from "@heroui/react";
import { admissionSchema, type AdmissionFormValues, type Admission, type Patient } from "@/types";
import { useAdmissions } from "@/hooks/use-admissions";
import { usePatients } from "@/hooks/use-patients";
import { cn } from "@/utils";

interface AdmissionFormProps {
  admission?: Admission;
  onClose: () => void;
}

const statusOptions = [
  { value: "admitted", label: "Admitted" },
  { value: "discharged", label: "Discharged" },
  { value: "transferred", label: "Transferred" },
] as const;

export function AdmissionForm({ admission, onClose }: AdmissionFormProps) {
  const { createAdmission, updateAdmission, isCreating, isUpdating } = useAdmissions();
  const { patients } = usePatients();
  const isEditing = !!admission;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: admission
      ? {
          patientId: admission.patientId,
          wardId: admission.wardId,
          diagnosis: admission.diagnosis,
          admissionDate: admission.admissionDate?.split("T")[0] ?? "",
          dischargeDate: admission.dischargeDate?.split("T")[0] ?? "",
          status: admission.status,
          notes: admission.notes ?? "",
        }
      : {
          patientId: "",
          wardId: "",
          diagnosis: "",
          admissionDate: "",
          dischargeDate: "",
          status: "admitted",
          notes: "",
        },
  });

  async function onSubmit(data: AdmissionFormValues) {
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
          <label className="text-sm font-medium">
            Patient <span className="text-danger">*</span>
          </label>
           <Controller
             name="patientId"
             control={control}
             render={({ field }) => (
               <Autocomplete
                 items={patients as Iterable<Patient, "single">}
                 selectedKey={field.value || null}
                 onSelectionChange={(key) => field.onChange(key as string)}
               >
                 <Autocomplete.Trigger>
                   <Autocomplete.Value />
                   <Autocomplete.Indicator />
                 </Autocomplete.Trigger>
                 <Autocomplete.Popover>
                   <ListBox items={patients} selectionMode="single">
                     {(patient: Patient) => (
                       <ListBoxItem key={patient.id} textValue={patient.name}>
                         <div className="flex flex-col">
                           <span className="text-sm font-medium">{patient.name}</span>
                           <span className="text-xs text-default-400">{patient.mrn}</span>
                         </div>
                       </ListBoxItem>
                     )}
                   </ListBox>
                 </Autocomplete.Popover>
               </Autocomplete>
             )}
          />
          {errors.patientId && (
            <p className="text-sm text-danger">{errors.patientId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="wardId" className="text-sm font-medium">
            Ward <span className="text-danger">*</span>
          </label>
          <Input
            id="wardId"
            placeholder="Enter ward ID"
            {...register("wardId")}
          />
          {errors.wardId && (
            <p className="text-sm text-danger">{errors.wardId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className={cn(
              "flex h-9 w-full rounded-lg border border-default-300 bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "data-[hover=true]:border-default-400",
              "dark:border-default-200"
            )}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="diagnosis" className="text-sm font-medium">
          Diagnosis <span className="text-danger">*</span>
        </label>
        <TextArea
          id="diagnosis"
          placeholder="Enter diagnosis"
          {...register("diagnosis")}
        />
        {errors.diagnosis && (
          <p className="text-sm text-danger">{errors.diagnosis.message}</p>
        )}
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
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <TextArea
          id="notes"
          placeholder="Enter additional notes"
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
