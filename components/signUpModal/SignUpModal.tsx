import {
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

interface ISignUpModal {
  isOpen: boolean;
  onClose: () => void;
  activeSign?: { type: string; date: string };
}

const SignUpModal = ({ isOpen, onClose, activeSign }: ISignUpModal) => {
  const { data } = useSession();
  const [value, setValue] = useState<"yes" | "no">("no");
  const { replace, asPath } = useRouter();

  const submitSign = async () => {
    await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        id: data?.user.id,
        inhouse: value === "yes",
        type: activeSign?.type,
        date: activeSign?.date,
      }),
    }).finally(() => {
      replace(asPath, undefined, { scroll: false });
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {activeSign?.date}
          {activeSign?.type === "night" ? " Kväll" : " Lunch"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          <Checkbox
            size="lg"
            value={value}
            checked={value === "yes"}
            onChange={() => setValue((prev) => (prev === "yes" ? "no" : "yes"))}
          >
            Bara inhouse
          </Checkbox>
          <Flex direction="row" gap="4" mt="4">
            <Button flex="1" onClick={() => submitSign()}>
              Svara
            </Button>
            <Button variant="outline" flex="1" onClick={() => onClose()}>
              Avbryt
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
