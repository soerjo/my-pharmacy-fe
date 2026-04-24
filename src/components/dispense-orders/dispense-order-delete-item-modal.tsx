"use client";

import {
  Button,
  Modal,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  useOverlayState,
} from "@heroui/react";

interface DeleteItemConfirmModalProps {
  state: ReturnType<typeof useOverlayState>;
  itemName: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DeleteItemConfirmModal({
  state,
  itemName,
  onConfirm,
  onDismiss,
}: DeleteItemConfirmModalProps) {
  return (
    <Modal state={state}>
      <ModalBackdrop variant="blur">
        <ModalContainer size="sm">
          <ModalDialog>
            <ModalHeader>
              <ModalHeading>Remove Item</ModalHeading>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm">
                Are you sure you want to remove{" "}
                <span className="font-semibold">{itemName}</span> from the order?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onPress={onDismiss}>
                Cancel
              </Button>
              <Button variant="danger" onPress={onConfirm}>
                Yes, remove
              </Button>
            </ModalFooter>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}
