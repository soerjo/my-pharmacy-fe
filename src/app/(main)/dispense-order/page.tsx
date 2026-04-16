import { DispenseOrdersTable } from "@/features/dispense-order/components";
import { DispenseOrdersProvider } from "@/features/dispense-order/hooks";

export default function DispenseOrderPage() {
  return (
    <div className="p-6">
      <DispenseOrdersProvider>
        <DispenseOrdersTable />
      </DispenseOrdersProvider>
    </div>
  );
}
