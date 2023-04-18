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
import { useState } from "react";

const Page = ({
  matches,
  userMatches,
}: {
  matches: string;
  userMatches: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSign, setActiveSign] = useState<{
    type: string;
    date: string;
  }>();

  const data = JSON.parse(matches);
  const parsedUserMatches = JSON.parse(userMatches);
  const dateArray: string[] = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateArray.push(date.toISOString().slice(0, 10));
  }

  //Måste skicka in id på match (om det finns) som användaren ska signa upp sig på
  //Om det inte finns så vet vi i APIt att vi ska skapa en match på den dagen och sen skapa en koppling i user_match
  const handleClick = (type: string, date: string) => {
    setActiveSign({ type, date });
    onOpen();
  };

  return (
    <>
      <Heading>Spela spel!?!?</Heading>
      <Accordion defaultIndex={[0]} allowMultiple>
        {dateArray.map((item, ix) => (
          <AccordionItem
            key={ix}
            mt={{ base: 8, md: 6 }}
            boxShadow="lg"
            border="none"
            bg="white"
          >
            <AccordionButton py="4">
              <Box as="span" flex="1" textAlign="left">
                <Heading variant="h2" fontSize="2xl">
                  {item}
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
                  <Button
                    onClick={() => handleClick("day", item)}
                    variant="outline"
                    minWidth={{ md: "40" }}
                    _hover={{ bg: "gray.300" }}
                  >
                    Signa upp
                  </Button>
                </Flex>
                {!!data?.items?.length &&
                  data.items.map(
                    (item2: any) =>
                      new Date(item2.date).getDate() ===
                        new Date(item).getDate() &&
                      item2.type === "day" && (
                        <Box p="4">
                          <OrderedList>
                            {parsedUserMatches?.items
                              ?.filter((x: any) => x.match === item2.id)
                              .map((pum: any) => (
                                <ListItem>
                                  {pum?.expand?.user?.name}
                                  {pum.inhouse && " (bara inhouse)"}
                                </ListItem>
                              ))}
                          </OrderedList>
                        </Box>
                      )
                  )}
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
                  <Button
                    onClick={() => handleClick("night", item)}
                    variant="outline"
                    minWidth={{ md: "40" }}
                    _hover={{ bg: "gray.300" }}
                  >
                    Signa upp
                  </Button>
                </Flex>
                {!!data?.items?.length &&
                  data.items.map(
                    (item2: any) =>
                      new Date(item2.date).getDate() ===
                        new Date(item).getDate() &&
                      item2.type === "night" && (
                        <Box p="4">
                          {parsedUserMatches?.items
                            ?.filter((x: any) => x.match === item2.id)
                            .map((pum: any) => (
                              <p>{pum?.expand?.user?.name}</p>
                            ))}
                        </Box>
                      )
                  )}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <SignUpModal {...{ isOpen, onClose, activeSign }} />
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
    .getList(1, 5, {
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
