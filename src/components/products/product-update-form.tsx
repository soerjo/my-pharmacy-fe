"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, TextArea, ModalBody, ModalFooter, Button, Spinner, useOverlayState } from "@heroui/react";
import {
  productSchema,
  type ProductFormValues,
  DOSAGE_FORM_VALUES,
} from "@/types";
import { useProducts, useProduct } from "@/hooks/use-products";
import {
  ProductTypeAutocomplete,
  UnitOfMeasureAutocomplete,
  ProductCategoryAutocomplete,
  ManufacturerAutocomplete,
  ChangesConfirmModal,
} from "@/components/ui";
import { cn } from "@/utils";

const UPDATE_FORM_ID = "product-update-form";

interface ProductUpdateFormProps {
  id: string;
  onClose: () => void;
}

export function ProductUpdateForm({ id, onClose }: ProductUpdateFormProps) {
  const { updateProduct } = useProducts();
  const { product, isLoading } = useProduct(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
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

  const changesOverlayState = useOverlayState({ defaultOpen: false });

  const handleClose = useCallback(() => {
    if (isDirty) {
      changesOverlayState.open();
    } else {
      onClose();
    }
  }, [isDirty, changesOverlayState, onClose]);

  useEffect(() => {
    if (product) {
      reset({
        code: product.code ?? "",
        name: product.name,
        description: product.description ?? "",
        productType: product.productType ?? "",
        dosageForm: product.dosageForm ?? "",
        strength: product.strength ?? "",
        casNumber: product.casNumber ?? "",
        categoryId: product.categoryId ?? "",
        manufacturerId: product.manufacturerId ?? "",
        baseUnitId: product.baseUnitId ?? "",
      });
    }
  }, [product, reset]);

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
      await updateProduct(id, payload);
      onClose();
    } catch {
      setSubmitError("Failed to update product. Please try again.");
    }
  }

  const selectClass = cn(
    "flex h-9 w-full rounded-lg border border-default-300 bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors",
    "focus:border-primary focus:ring-1 focus:ring-primary",
    "data-[hover=true]:border-default-400",
    "dark:border-default-200",
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="py-8 text-center text-sm text-zinc-500">Product not found.</div>;
  }

  return (
    <>
      <ModalBody>
        <form id={UPDATE_FORM_ID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
      </ModalBody>
      <ModalFooter className="px-4 pb-4">
        <Button variant="secondary" onPress={handleClose}>
          {isDirty ? "Cancel" : "Close"}
        </Button>
        {isDirty && <Button type="submit" form={UPDATE_FORM_ID}>Save</Button>}
      </ModalFooter>

      <ChangesConfirmModal
        state={changesOverlayState}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? All changes will be lost."
        onConfirm={onClose}
        onDismiss={() => changesOverlayState.close()}
      />
    </>
  );
}

export { UPDATE_FORM_ID };
