"use client";

import { Button } from "@heroui/react";
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
import { DispenseOrderFormDetail } from "./dispense-order-form-detail";
import { useRouter } from "next/navigation";

interface DispenseOrderModalProps {
  id: string;
}

export function DispenseOrderModal({ id }: DispenseOrderModalProps) {
  const router = useRouter();

  return (
    <Modal>
      <Button variant="secondary" onPress={() => { router.push(`?id=${id}`) }}>
        Detail
      </Button>
      <ModalBackdrop variant="blur">
        <ModalContainer>
          <ModalDialog className="md:max-w-[45vw]">
            <ModalCloseTrigger />
            <ModalHeader>
              <ModalHeading>Detail Dispense Order</ModalHeading>
            </ModalHeader>
            <ModalBody>
              <DispenseOrderFormDetail id={id} />
            </ModalBody>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}
