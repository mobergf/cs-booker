import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Collapse,
  css,
  Flex,
  Heading,
  styled,
  Text,
} from "@chakra-ui/react";
import initPocketBase from "components/pocketbase/pocketbase";
import next, { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/dist/cjs/shared/types";

// const styling = css({
//   ".react-calendar": {
//     border: "2px solid var(--chakra-colors-brand-primary)",
//     background: "var(--chakra-colors-brand-champagneLight)",
//     borderRadius: 8,
//   },
//   ".react-calendar__tile": {
//     borderRadius: 5,
//   },
//   ".react-calendar__tile.workout": {
//     background: "var(--chakra-colors-brand-primary)",
//     color: "white",
//   },
//   ".react-calendar__tile--active": {
//     background: "var(--chakra-colors-brand-secondary)",
//     "&:hover,&:active,&:focus": {
//       background: "var(--chakra-colors-brand-secondaryDark)",
//     },
//   },
//   ".react-calendar__tile--now": {
//     background: "var(--chakra-colors-brand-champagne)",
//     "&:hover": {
//       background: "var(--chakra-colors-brand-champagne)",
//     },
//   },
// });

const Page = ({ records }: { records: string }) => {
  const { data: userData } = useSession();

  const data = JSON.parse(records);
  const dateArray: string[] = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateArray.push(date.toISOString().slice(0, 10));
  }

  console.log(data);

  return (
    <>
      <Heading>Spela spel!?!?</Heading>
      <Accordion defaultIndex={[0]} allowMultiple>
        {dateArray.map((item, ix) => (
          <AccordionItem key={ix} mt="4">
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {item}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {!!data?.items?.length &&
                data.items.map(
                  (item2) =>
                    new Date(item2.date).getDate() ===
                      new Date(item).getDate() && (
                      <p>
                        finns match på
                        <strong>
                          {item2.type === "night" ? " kväll" : " lunch"}
                        </strong>
                      </p>
                    )
                )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const pb = await initPocketBase(req, res);

  const data = await pb
    .collection("csmatch")
    .getList(1, 5, {
      filter: `date >= "${new Date().toISOString().slice(0, 10)}"`,
    })
    .then((res) => res);

  const records = JSON.stringify(data);

  return {
    props: {
      records,
    },
  };
};

export default Page;
