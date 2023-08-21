import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ISignUpModal {
  isOpen: boolean;
  onClose: () => void;
  activeSign?: { type: string; date: string };
}

const SignUpModal = ({ isOpen, onClose, activeSign }: ISignUpModal) => {
  const { data } = useSession();
  const { refresh } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [commentValue, setCommentValue] = useState<string>();

  const submitSign = async () => {
    setIsLoading(true);
    await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        id: data?.user.id,
        type: activeSign?.type,
        date: activeSign?.date,
        comment: commentValue,
      }),
    }).then((res) => {
      if (res.ok) {
        setIsLoading(false);
        onClose();
      }
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
        <ModalBody pb="6" pt="0">
          <Text>Kommentar</Text>
          <Input
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            placeholder="T.ex tid eller enbart inhouse"
          />
          <Flex direction="row" gap="4" mt="4">
            <Button isLoading={isLoading} flex="1" onClick={() => submitSign()}>
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
