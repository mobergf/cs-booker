"use client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, SignUpModal } from "components";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const weekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

const Page = ({ matches, userMatches, user }: { matches: any; userMatches: any; user: User }) => {
  const [matchState, setMatchState] = useState(matches);
  const [userMatchesState, setUserMatchesState] = useState(userMatches);
  const { isOpen, onOpen, onClose: discClose } = useDisclosure();
  const [activeSign, setActiveSign] = useState<{
    type: string;
    date: string;
  }>();
  const {  refresh } = useRouter();

  useEffect(() => {
    setMatchState(matches);
  }, [matches]);

  useEffect(() => {
    setUserMatchesState(userMatches);
  }, [userMatches]);

  const dateArray: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateArray.push(date.toISOString().slice(0, 10));
  }

  const handleClick = (type: string, date: string) => {
    setActiveSign({ type, date });
    onOpen();
  };

  const onClose = () => {
    setActiveSign(undefined);
    discClose();
  };

  const handleRemoveSign = async (id: string) => {
    await fetch("/api", {
      method: "DELETE",
      body: JSON.stringify({
        id,
      }),
    }).then(() => refresh());
  };

  const DisplayList = ({
    item,
    type,
  }: {
    item: string;
    type: "day" | "night";
  }) =>
    !!matchState?.items?.length &&
    matchState.items.map(
      (item2: any) =>
        new Date(item2.date).getDate() === new Date(item).getDate() &&
        item2.type === type && (
          <ol
            key={item2.date + userMatchesState?.totalItems}
            className="md:grid grid-row-5 grid-flow-col p-4"
          >
            {userMatchesState?.items
              ?.filter((x: any) => x.match === item2.id)
              .map((pum: any) => (
                <li
                  key={pum?.expand?.user?.name + userMatchesState?.totalItems}
                  className="w-max"
                >
                  {pum?.expand?.user?.name}
                  {pum.comment && ` (${pum.comment})`}
                </li>
              ))}
          </ol>
        )
    );

  const ButtonFilter = ({
    item,
    type,
  }: {
    item: string;
    type: "day" | "night";
  }) => {
    const hasMatchOnDate =
      !!matchState?.items?.length &&
      matchState.items.filter(
        (item2: any) =>
          new Date(item2.date).getDate() === new Date(item).getDate() &&
          item2.type === type
      );

    if (!hasMatchOnDate?.length)
      return (
        <Button
          onClick={() => handleClick(type, item)}
          className="md:min-w-40"
          >
          Signa upp
        </Button>
      );

    return hasMatchOnDate.map((y: any, ix: number) =>
      userMatchesState?.items?.find(
        (x: any) => x.match === y.id && x.user === user.id
      ) ? (
        <Button
          key={ix}
          onClick={() =>
            handleRemoveSign(
              userMatchesState?.items?.find(
                (x: any) => x.match === y.id && x.user === user.id
              ).id
            )
          }
          className="md:min-w-40"
          variant="secondary"
        >
          Signa av
        </Button>
      ) : (
        <Button
          key={ix}
          onClick={() => handleClick(type, item)}
          className="md:min-w-40"

        >
          Signa upp
        </Button>
      )
    );
  };
  return (
    <div className="mx-auto mt-4 max-w-5xl px-4">
      <div className="px-4 md:px-0 flex flex-row justify-between">
        <h1 className="text-4xl font-bold">Spela spel</h1>
        <Button onClick={() => signOut()}>Logga ut</Button>
      </div>
      <Accordion defaultIndex={[0]} allowMultiple>
        {dateArray.map((item, ix) => (
          <AccordionItem
            key={ix + userMatchesState?.totalItems}
            mt={{ base: 8, md: 6 }}
            boxShadow="lg"
            border="none"
            bg="white"
          >
            <AccordionButton
              py="4"
              _hover={{ lg: { bgColor: "blackAlpha.50" } }}
            >
              <Box as="span" flex="1" textAlign="left">
                <Heading variant="h2" fontSize="2xl">
                  {`${weekdays[new Date(item).getDay()]} - ${item}`}
                </Heading>
              </Box>
              <AccordionIcon fontSize="4xl" />
            </AccordionButton>
            <AccordionPanel p={{ base: 0, md: 8 }}>
              <Box p={{ md: 4 }} bg="brand.gray">
                <Flex
                  direction="row"
                  borderBottom="2px solid"
                  borderColor="brand.green"
                  justify="space-between"
                  align="center"
                  p="4"
                >
                  <Heading as="h3" fontSize="2xl">
                    Lunchpang
                  </Heading>
                  <ButtonFilter item={item} type="day" />
                </Flex>
                <DisplayList item={item} type="day" />
              </Box>
              <Box p={{ md: 4 }} bg="brand.gray" mt={{ base: 4, md: 8 }}>
                <Flex
                  direction="row"
                  borderBottom="2px solid"
                  borderColor="brand.green"
                  justify="space-between"
                  align="center"
                  p="4"
                >
                  <Heading as="h3" fontSize="2xl">
                    Kvällspang
                  </Heading>
                  <ButtonFilter item={item} type="night" />
                </Flex>
                <DisplayList item={item} type="night" />
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {isOpen && <SignUpModal {...{ isOpen, onClose, activeSign }} />}
    </div>
  );
};

export default Page;
