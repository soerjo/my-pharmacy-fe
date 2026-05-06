"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, TextArea } from "@heroui/react";
import {
  productSchema,
  type ProductFormValues,
  DOSAGE_FORM_VALUES,
} from "@/types";
import { useProducts } from "@/hooks/use-products";
import {
  ProductTypeAutocomplete,
  UnitOfMeasureAutocomplete,
  ProductCategoryAutocomplete,
  ManufacturerAutocomplete,
} from "@/components/ui";
import { cn } from "@/utils";

interface ProductCreateFormProps {
  onClose: () => void;
  formId: string;
  onDirtyChange?: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

export function ProductCreateForm({
  onClose,
  formId,
  onDirtyChange,
  onSubmittingChange,
}: ProductCreateFormProps) {
  const { createProduct } = useProducts();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      productType: "",
      dosageForm: "",
      strength: "",
      casNumber: "",
      categoryId: "",
      manufacturerId: "",
      baseUnitId: "",
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  async function onSubmit(data: ProductFormValues) {
    setSubmitError(null);
    const payload = {
      ...data,
      description: data.description || undefined,
      dosageForm: data.dosageForm || undefined,
      strength: data.strength || undefined,
      casNumber: data.casNumber || undefined,
    };

    try {
      onSubmittingChange?.(true);
      await createProduct(payload);
      onDirtyChange?.(false);
      onClose();
    } catch {
      onSubmittingChange?.(false);
      setSubmitError("Failed to create product. Please try again.");
    }
  }

  const selectClass = cn(
    "flex h-9 w-full rounded-lg border border-default-300 bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors",
    "focus:border-primary focus:ring-1 focus:ring-primary",
    "data-[hover=true]:border-default-400",
    "dark:border-default-200",
  );

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium">
            Code
          </label>
          <Input
            id="code"
            placeholder="Enter product code"
            {...register("code")}
          />
          {errors.code && (
            <p className="text-sm text-danger">{errors.code.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-danger">*</span>
          </label>
          <Input
            id="name"
            placeholder="Enter product name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-danger">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="productType"
          control={control}
          render={({ field }) => (
            <ProductTypeAutocomplete
              selectedKey={field.value || null}
              onSelectionChange={(key) => field.onChange(key)}
              required
              error={errors.productType?.message}
            />
          )}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dosageForm" className="text-sm font-medium">
            Dosage Form
          </label>
          <select id="dosageForm" {...register("dosageForm")} className={selectClass}>
            <option value="">Select dosage form</option>
            {DOSAGE_FORM_VALUES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="strength" className="text-sm font-medium">
            Strength
          </label>
          <Input
            id="strength"
            placeholder="e.g. 500mg"
            {...register("strength")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="casNumber" className="text-sm font-medium">
            CAS Number
          </label>
          <Input
            id="casNumber"
            placeholder="Enter CAS number"
            {...register("casNumber")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <ProductCategoryAutocomplete
              selectedKey={field.value || null}
              onSelectionChange={(key) => field.onChange(key)}
              required
              error={errors.categoryId?.message}
            />
          )}
        />
        <Controller
          name="manufacturerId"
          control={control}
          render={({ field }) => (
            <ManufacturerAutocomplete
              selectedKey={field.value || null}
              onSelectionChange={(key) => field.onChange(key)}
              required
              error={errors.manufacturerId?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="baseUnitId"
          control={control}
          render={({ field }) => (
            <UnitOfMeasureAutocomplete
              selectedKey={field.value || null}
              onSelectionChange={(key) => field.onChange(key)}
              required
              error={errors.baseUnitId?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <TextArea
          id="description"
          placeholder="Enter description"
          {...register("description")}
        />
      </div>

      {submitError && <p className="text-sm text-danger">{submitError}</p>}
    </form>
  );
}
