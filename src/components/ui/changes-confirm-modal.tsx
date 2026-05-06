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
  Spinner,
  TextArea,
  useOverlayState,
} from "@heroui/react";

interface ChangesConfirmModalProps {
  state: ReturnType<typeof useOverlayState>;
  title: string;
  message: string;
  isCancelled?: boolean;
  cancelReason?: string;
  onCancelReasonChange?: (value: string) => void;
  onConfirm: () => void;
  onDismiss: () => void;
  isConfirming?: boolean;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
}

export function ChangesConfirmModal({
  state,
  title,
  message,
  isCancelled = false,
  cancelReason = "",
  onCancelReasonChange,
  onConfirm,
  onDismiss,
  isConfirming = false,
  confirmLabel = "Yes, confirm",
  confirmVariant = "primary",
}: ChangesConfirmModalProps) {
  return (
    <Modal state={state}>
      <ModalBackdrop variant="blur">
        <ModalContainer size="sm">
          <ModalDialog>
            <ModalHeader>
              <ModalHeading>{title}</ModalHeading>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-3">
              <p className="text-sm">{message}</p>
              {isCancelled && onCancelReasonChange && (
                <TextArea
                  placeholder="Reason for cancellation (optional)"
                  value={cancelReason}
                  onChange={(e) => onCancelReasonChange(e.target.value)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onPress={onDismiss}>
                No, go back
              </Button>
              <Button
                slot="close"
                variant={confirmVariant}
                onPress={onConfirm}
                isDisabled={isConfirming}
              >
                {isConfirming ? (
                  <Spinner size="sm" />
                ) : (
                  confirmLabel
                )}
              </Button>
            </ModalFooter>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}
