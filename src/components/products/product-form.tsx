"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Spinner, TextArea } from "@heroui/react";
import { productSchema, type ProductFormValues, type Product } from "@/types";
import { DOSAGE_FORM_VALUES } from "@/types";
import { useProducts } from "@/hooks/use-products";
import { onServerError } from "@/providers/error-provider";
import { cn } from "@/utils";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const { createProduct, updateProduct, isCreating, isUpdating } =
    useProducts();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!product;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          sku: product.sku,
          name: product.name,
          genericName: product.genericName ?? "",
          manufacturer: product.manufacturer ?? "",
          category: product.category ?? "",
          dosageForm: product.dosageForm ?? "",
          strength: product.strength ?? "",
          unitPrice: product.unitPrice ?? undefined,
          description: product.description ?? "",
        }
      : {
          sku: "",
          name: "",
          genericName: "",
          manufacturer: "",
          category: "",
          dosageForm: "",
          strength: "",
          unitPrice: undefined,
          description: "",
        },
  });

  async function onSubmit(data: ProductFormValues) {
    setSubmitError(null);
    const payload = {
      ...data,
      genericName: data.genericName || undefined,
      manufacturer: data.manufacturer || undefined,
      category: data.category || undefined,
      dosageForm: data.dosageForm || undefined,
      strength: data.strength || undefined,
      unitPrice: data.unitPrice || undefined,
      description: data.description || undefined,
    };

    try {
      if (isEditing && product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onClose();
    } catch (err) {
      onServerError(err);
      setSubmitError(
        isEditing
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sku" className="text-sm font-medium">
            SKU <span className="text-danger">*</span>
          </label>
          <Input id="sku" placeholder="Enter SKU" {...register("sku")} />
          {errors.sku && (
            <p className="text-sm text-danger">{errors.sku.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-danger">*</span>
          </label>
          <Input id="name" placeholder="Enter product name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-danger">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="genericName" className="text-sm font-medium">Generic Name</label>
          <Input id="genericName" placeholder="Enter generic name" {...register("genericName")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer</label>
          <Input id="manufacturer" placeholder="Enter manufacturer" {...register("manufacturer")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <Input id="category" placeholder="Enter category" {...register("category")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dosageForm" className="text-sm font-medium">Dosage Form</label>
          <select
            id="dosageForm"
            {...register("dosageForm")}
            className={cn(
              "flex h-9 w-full rounded-lg border border-default-300 bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "data-[hover=true]:border-default-400",
              "dark:border-default-200",
            )}
          >
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
          <label htmlFor="strength" className="text-sm font-medium">Strength</label>
          <Input id="strength" placeholder="e.g. 500mg" {...register("strength")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="unitPrice" className="text-sm font-medium">Unit Price</label>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("unitPrice", { valueAsNumber: true })}
          />
          {errors.unitPrice && (
            <p className="text-sm text-danger">{errors.unitPrice.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <TextArea id="description" placeholder="Enter description" {...register("description")} />
      </div>

      {submitError && <p className="text-sm text-danger">{submitError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onPress={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" isDisabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
