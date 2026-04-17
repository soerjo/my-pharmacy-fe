import { DispenseOrdersTable } from "@/components/dispense-orders/dispense-orders-table";
import { DispenseOrdersProvider } from "@/hooks/use-dispense-orders";

export default function DispenseOrderPage() {
  return (
    <div className="p-6">
      <DispenseOrdersProvider>
        <DispenseOrdersTable />
      </DispenseOrdersProvider>
    </div>
  );
}
