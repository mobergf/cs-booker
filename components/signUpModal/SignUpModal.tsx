import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Button,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ISignUpModal {
  isOpen: boolean;
  onClose: () => void;
  activeSign?: { type: string; date: string };
}

const SignUpModal = ({ isOpen, onClose, activeSign }: ISignUpModal) => {
  const { data } = useSession();
  const [value, setValue] = useState("no");

  console.log(value);

  const submitSign = async () => {
    const bob = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ id: data?.user.id, inhouse: value }),
    }).then((res) => res.json());
    console.log(bob);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {activeSign?.date}: {activeSign?.type === "night" ? "Kväll" : "Lunch"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          <RadioGroup onChange={setValue} value={value} name="inhouse">
            <Stack direction="row">
              <Radio _checked={{ bg: "brand.green" }} size="lg" value="no">
                Nej
              </Radio>
              <Radio _checked={{ bg: "brand.green" }} size="lg" value="yes">
                Ja
              </Radio>
            </Stack>
          </RadioGroup>
          <Flex direction="row" gap="4" mt="4">
            <Button flex="1" variant="secondary" onClick={() => submitSign()}>
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
