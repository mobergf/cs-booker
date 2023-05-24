import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { SignUpModal } from "components";
import initPocketBase from "components/pocketbase/pocketbase";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const weekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

const Page = ({
  matches,
  userMatches,
}: {
  matches: string;
  userMatches: string;
}) => {
  const { isOpen, onOpen, onClose: discClose } = useDisclosure();
  const [activeSign, setActiveSign] = useState<{
    type: string;
    date: string;
  }>();
  const { replace, asPath } = useRouter();
  const { data: userData } = useSession();

  const data = JSON.parse(matches);
  const parsedUserMatches = JSON.parse(userMatches);
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
    await fetch("/api/deletesign", {
      method: "POST",
      body: JSON.stringify({
        id,
      }),
    }).finally(() => {
      replace(asPath, undefined, { scroll: false });
    });
  };

  const DisplayList = ({
    item,
    type,
  }: {
    item: string;
    type: "day" | "night";
  }) =>
    !!data?.items?.length &&
    data.items.map(
      (item2: any) =>
        new Date(item2.date).getDate() === new Date(item).getDate() &&
        item2.type === type && (
          <OrderedList
            key={item2.date}
            display={{ md: "grid" }}
            gridTemplateRows={{ md: "repeat(5, 1fr)" }}
            gridAutoFlow="column"
            p="4"
          >
            {parsedUserMatches?.items
              ?.filter((x: any) => x.match === item2.id)
              .map((pum: any, ix: number) => (
                <ListItem key={ix} width="max-content">
                  {pum?.expand?.user?.name}
                  {pum.comment && ` (${pum.comment})`}
                </ListItem>
              ))}
          </OrderedList>
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
      !!data?.items?.length &&
      data.items.filter(
        (item2: any) =>
          new Date(item2.date).getDate() === new Date(item).getDate() &&
          item2.type === type
      );

    if (!hasMatchOnDate?.length)
      return (
        <Button
          onClick={() => handleClick(type, item)}
          variant="outline"
          minWidth={{ md: "40" }}
          color="white"
          bg="brand.primary"
          _hover={{ lg: { bg: "brand.primaryDark" } }}
        >
          Signa upp
        </Button>
      );

    return hasMatchOnDate.map((y: any, ix: number) =>
      !!parsedUserMatches?.items?.find(
        (x: any) => x.match === y.id && x.user === userData?.user.id
      ) ? (
        <Button
          key={ix}
          onClick={() =>
            handleRemoveSign(
              parsedUserMatches?.items?.find(
                (x: any) => x.match === y.id && x.user === userData?.user.id
              ).id
            )
          }
          variant="outline"
          minWidth={{ md: "40" }}
          _hover={{ lg: { bg: "gray.100" } }}
        >
          Signa av
        </Button>
      ) : (
        <Button
          key={ix}
          onClick={() => handleClick(type, item)}
          variant="outline"
          minWidth={{ md: "40" }}
          color="white"
          bg="brand.primary"
          _hover={{ lg: { bg: "brand.primaryDark" } }}
        >
          Signa upp
        </Button>
      )
    );
  };
  return (
    <>
      <Flex px={{ base: 4, md: 0 }} direction="row" justify="space-between">
        <Heading>Spela spel</Heading>
        <Button onClick={() => signOut()}>Logga ut</Button>
      </Flex>
      <Accordion defaultIndex={[0]} allowMultiple>
        {dateArray.map((item, ix) => (
          <AccordionItem
            key={ix}
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const pb = await initPocketBase(req, res);

  const csmatch = await pb
    .collection("csmatch")
    .getList(1, 50, {
      filter: `date >= "${new Date().toISOString().slice(0, 10)}"`,
    })
    .then((res) => res);

  const matchIds = csmatch?.items?.map((x) => x.id);

  const usersPerMatch = await pb.collection("user_match").getList(1, 50, {
    filter: `match = "${matchIds.join('" || match = "')}"`,
    expand: "user",
  });

  const matches = JSON.stringify(csmatch);
  const userMatches = JSON.stringify(usersPerMatch);

  return {
    props: {
      matches,
      userMatches,
    },
  };
};

export default Page;
