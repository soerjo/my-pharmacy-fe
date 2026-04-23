"use client";

import { Button, Spinner, useOverlayState } from "@heroui/react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
} from "@heroui/react";
import { useDispenseOrder } from "@/hooks/use-dispense-orders";
import { DispenseOrderForm } from "./dispense-order-form";
import { DispenseOrderFormDetail } from "./dispense-order-form-detail";
import { useRouter, useSearchParams } from "next/navigation";

interface DispenseOrderFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingOrderId: string | null;
}

// export function DispenseOrderFormModal({ isOpen, onOpenChange, editingOrderId }: DispenseOrderFormModalProps) {
//   const state = useOverlayState({ isOpen, onOpenChange });
//   const { dispenseOrder, isLoading: isLoadingDetail } = useDispenseOrder(editingOrderId ?? "");

//   return (
//     <Modal state={state}>
//       <ModalBackdrop />
//       <ModalContainer size="lg">
//         <ModalDialog>
//           <ModalHeader>
//             <ModalHeading>{editingOrderId ? "Edit Order" : "New Dispense Order"}</ModalHeading>
//             <ModalCloseTrigger />
//           </ModalHeader>
//           <ModalBody>
//             {editingOrderId && isLoadingDetail ? (
//               <div className="flex flex-col items-center justify-center gap-2 py-8">
//                 <Spinner size="lg" />
//                 <p className="text-sm text-zinc-500">Loading order detail...</p>
//               </div>
//             ) : (
//               <DispenseOrderForm
//                 order={editingOrderId ? dispenseOrder ?? undefined : undefined}
//                 onClose={() => state.close()}
//               />
//             )}
//           </ModalBody>
//         </ModalDialog>
//       </ModalContainer>
//     </Modal>
//   );
// }

interface DispenseOrderModalProps {
  id: string;}

export function DispenseOrderModal({id}: DispenseOrderModalProps) {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const id = searchParams.get("id"); // string | null
  // const state = useOverlayState({isOpen: !!id});

  return (
    <Modal>
      <Button variant="secondary" onPress={() => {router.push(`?id=${id}`)}}>
        Detail
      </Button>
      <Modal.Backdrop variant="blur">
        <Modal.Container>
          <Modal.Dialog className="md:max-w-[45vw]">
            <Modal.CloseTrigger />
            <Modal.Header>
              {/* <Modal.Icon className="bg-default text-foreground">
                <Rocket className="size-5" />
              </Modal.Icon> */}
              <Modal.Heading>Detail Dispense Order</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {/* <p>
                A beautiful, fast, and modern React UI library for building accessible and
                customizable web applications with ease.
              </p> */}
              <DispenseOrderFormDetail id={id} />
            </Modal.Body>
            {/* <Modal.Footer>
              <Button className="w-full" slot="close">
                Continue
              </Button>
            </Modal.Footer> */}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

            // {id && (<DispenseOrderFormDetail id={id} />)}
// 