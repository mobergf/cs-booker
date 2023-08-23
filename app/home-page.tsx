"use client";
import { Button, Modal, SignUpModal } from "components";
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

const Page = ({
  matches,
  userMatches,
  user,
}: {
  matches: any;
  userMatches: any;
  user: User;
}) => {
  const [matchState, setMatchState] = useState(matches);
  const [userMatchesState, setUserMatchesState] = useState(userMatches);
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [activeSign, setActiveSign] = useState<{
    type: string;
    date: string;
  }>();
  const { refresh } = useRouter();

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
    setIsOpen(true);
  };

  const onClose = () => {
    setActiveSign(undefined);
    setIsOpen(false);
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
            type="1"
            className="list-inside list-decimal grid-flow-col grid-rows-5 p-4 md:grid"
          >
            {userMatchesState?.items
              ?.filter((x: any) => x.match === item2.id)
              .map((pum: any) => (
                <li
                  key={pum?.expand?.user?.name + userMatchesState?.totalItems}
                >
                  {pum?.expand?.user?.name}
                  {pum.comment && ` (${pum.comment})`}
                </li>
              ))}
          </ol>
        ),
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
          item2.type === type,
      );

    if (!hasMatchOnDate?.length)
      return (
        <Button
          onClick={() => handleClick(type, item)}
          className="min-w-[150px]"
        >
          Signa upp
        </Button>
      );

    return hasMatchOnDate.map((y: any, ix: number) =>
      userMatchesState?.items?.find(
        (x: any) => x.match === y.id && x.user === user.id,
      ) ? (
        <Button
          key={ix}
          onClick={() =>
            handleRemoveSign(
              userMatchesState?.items?.find(
                (x: any) => x.match === y.id && x.user === user.id,
              ).id,
            )
          }
          className="min-w-[150px]"
          variant="secondary"
        >
          Signa av
        </Button>
      ) : (
        <Button
          key={ix}
          onClick={() => handleClick(type, item)}
          className="min-w-[150px]"
        >
          Signa upp
        </Button>
      ),
    );
  };
  return (
    <div className="mx-auto mt-4 max-w-5xl pb-8 md:px-4">
      <div className="flex flex-row items-center justify-between px-4 md:px-0">
        <h1 className="text-3xl font-bold md:text-4xl">Spela spel</h1>
        <Button onClick={() => signOut()}>Logga ut</Button>
      </div>
      {dateArray.map((item, ix) => (
        <section
          key={ix + userMatchesState?.totalItems}
          className={`mt-8 border-y border-primary shadow-md md:mt-6 md:border `}
        >
          <button
            className="inline-flex h-16 w-full items-center bg-zinc-200 bg-opacity-30 px-4 py-4 transition-colors hover:bg-zinc-200 hover:bg-opacity-60 dark:bg-secondary-dark dark:bg-opacity-70 dark:hover:bg-zinc-500 dark:hover:bg-opacity-30"
            onClick={() => setOpenAccordion((prev) => (prev === ix ? 50 : ix))}
          >
            <span className="flex flex-1 text-left">
              <h2 className="text-xl md:text-2xl">
                {`${weekdays[new Date(item).getDay()]} - ${item}`}
              </h2>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`h-6 w-6 ${
                openAccordion === ix ? "rotate-180" : "rotate-0"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          <div
            className={`${
              openAccordion === ix ? "h-auto" : "invisible h-0"
            } overflow-hidden`}
          >
            <div className="bg-gray dark:bg-secondary-dark dark:bg-opacity-70 md:p-4">
              <div className="flex flex-row items-center justify-between border-b-2 border-green p-4">
                <h3 className="text-xl md:text-2xl">Lunchpang</h3>
                <ButtonFilter item={item} type="day" />
              </div>
              <DisplayList item={item} type="day" />
            </div>
            <div className="bg-gray dark:bg-secondary-dark dark:bg-opacity-70 md:p-4">
              <div className="flex flex-row items-center justify-between p-4">
                <h3 className="text-xl md:text-2xl">Kvällspang</h3>
                <ButtonFilter item={item} type="night" />
              </div>
              <DisplayList item={item} type="night" />
            </div>
          </div>
        </section>
      ))}
      <Modal isOpened={isOpen} onClose={onClose}>
        <SignUpModal {...{ activeSign, user, onClose }} />
      </Modal>
    </div>
  );
};

export default Page;
