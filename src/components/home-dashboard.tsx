"use client";

import { Spinner } from "@heroui/react";
import { usePatients } from "@/hooks/use-patients";
import { useProducts } from "@/hooks/use-products";
import { useRooms } from "@/hooks/use-rooms";
import { useAdmissions } from "@/hooks/use-admissions";
import { useDispenseOrders } from "@/hooks/use-dispense-orders";
import { AppLink } from "@/components/ui";
import { ROUTES, APP_NAME } from "@/constants";
import { formatDate, cn } from "@/utils";
import { Persons, Box, House, HeartPulse, FileCheck } from "@gravity-ui/icons";
import { DISPENSE_ORDER_STATUS_STYLES } from "@/types";
import type { DispenseOrder, Product } from "@/types";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  isLoading: boolean;
}

function StatCard({ title, count, icon, href, isLoading }: StatCardProps) {
  return (
    <AppLink href={href} className="block group">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {isLoading ? "-" : count}
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white dark:bg-primary/20">
            {icon}
          </div>
        </div>
      </div>
    </AppLink>
  );
}

interface RecentListProps<T> {
  title: string;
  href: string;
  items: T[];
  isLoading: boolean;
  emptyMessage: string;
  renderKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}

function RecentList<T>({ title, href, items, isLoading, emptyMessage, renderKey, renderItem }: RecentListProps<T>) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <AppLink href={href} className="text-sm text-primary hover:underline">
          View all
        </AppLink>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-zinc-500">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <div
              key={renderKey(item)}
              className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800"
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HomeDashboard() {
  const { products, paginationMeta: productsMeta, isLoading: isLoadingProducts } = useProducts();
  const { paginationMeta: patientsMeta, isLoading: isLoadingPatients } = usePatients();
  const { paginationMeta: roomsMeta, isLoading: isLoadingRooms } = useRooms();
  const { paginationMeta: admissionsMeta, isLoading: isLoadingAdmissions } = useAdmissions();
  const { dispenseOrders, paginationMeta: ordersMeta, isLoading: isLoadingOrders } = useDispenseOrders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Welcome to {APP_NAME}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Products"
          count={productsMeta?.total ?? 0}
          icon={<Box className="size-6" />}
          href={ROUTES.products}
          isLoading={isLoadingProducts}
        />
        <StatCard
          title="Patients"
          count={patientsMeta?.total ?? 0}
          icon={<Persons className="size-6" />}
          href={ROUTES.patients}
          isLoading={isLoadingPatients}
        />
        <StatCard
          title="Rooms"
          count={roomsMeta?.total ?? 0}
          icon={<House className="size-6" />}
          href={ROUTES.rooms}
          isLoading={isLoadingRooms}
        />
        <StatCard
          title="Admissions"
          count={admissionsMeta?.total ?? 0}
          icon={<HeartPulse className="size-6" />}
          href={ROUTES.admissions}
          isLoading={isLoadingAdmissions}
        />
        <StatCard
          title="Dispense Orders"
          count={ordersMeta?.total ?? 0}
          icon={<FileCheck className="size-6" />}
          href={ROUTES.dispenseOrders}
          isLoading={isLoadingOrders}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentList<Product>
          title="Recent Products"
          href={ROUTES.products}
          items={products}
          isLoading={isLoadingProducts}
          emptyMessage="No products found"
          renderKey={(p) => p.id}
          renderItem={(product) => (
            <>
              <div className="flex flex-col">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{product.name}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{product.code ?? "-"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{product.strength || "-"}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.dosageForm || "-"}</p>
              </div>
            </>
          )}
        />

        <RecentList<DispenseOrder>
          title="Recent Orders"
          href={ROUTES.dispenseOrders}
          items={dispenseOrders}
          isLoading={isLoadingOrders}
          emptyMessage="No orders found"
          renderKey={(o) => o.id ?? o.orderNumber}
          renderItem={(order) => (
            <>
              <div className="flex flex-col">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{order.orderNumber}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{order.patientName ?? "-"}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    DISPENSE_ORDER_STATUS_STYLES[order.status],
                  )}
                >
                  {order.status}
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatDate(order.orderDate)}</p>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}
