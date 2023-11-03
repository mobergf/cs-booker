"use client";
import { Button, Modal, SignUpModal } from "components";
import { DayIcon } from "components/icons/DayIcon";
import { CutleryIcon } from "components/icons/CutleryIcon";
import { getSignedUsersByDate, IMatchElement } from "core/helpers/db.helpers";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModeToggle from "./mode-toggle";

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

  const DisplayList = ({ matches }: { matches: IMatchElement[] }) => {
    if (!matches) return null;

    return (
      <ol
        type="1"
        className="list-inside list-decimal grid-flow-col grid-rows-5 py-2 md:grid"
      >
        {matches?.map((pum, key) => (
          <li key={`${pum?.name}${key}`}>
            {pum?.name}
            {pum.comment && ` (${pum.comment})`}
          </li>
        ))}
      </ol>
    );
  };

  //TODO: Use getSigned... method?
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
          className="min-w-[100px]"
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
          className="min-w-[100px]"
          variant="secondary"
        >
          Signa av
        </Button>
      ) : (
        <Button
          key={ix}
          onClick={() => handleClick(type, item)}
          className="min-w-[100px]"
        >
          Signa upp
        </Button>
      ),
    );
  };
  return (
    <div className="mx-auto mt-4 max-w-5xl pb-8 md:px-4">
      <div className="flex flex-row items-center justify-between px-4 md:px-0">
        <h1 className="text-2xl font-bold md:text-4xl">HUVUDSKOTT.SE</h1>
        <ModeToggle />
      </div>
      {dateArray.map((item, ix) => {
        const { dayUsers, nightUsers } = getSignedUsersByDate(
          userMatches,
          matches,
          item,
        );

        return (
          <section
            key={ix + userMatchesState?.totalItems}
            className={`m-2.5 mt-5 rounded-[3px] bg-white dark:bg-[#182535] dark:bg-opacity-50 dark:bg-gradient-to-tl dark:from-[#2F3F5C]/50 dark:via-[#022B31]/50 dark:to-[#214F73]/50 md:m-0 md:mt-6`}
          >
            <button
              className="inline-flex h-16 w-full items-center  px-4 py-4 "
              onClick={() =>
                setOpenAccordion((prev) => (prev === ix ? 50 : ix))
              }
            >
              <span className="flex flex-1 text-left">
                <div className="flex">
                  <h2 className="text-xl md:text-2xl">
                    {`${weekdays[new Date(item).getDay()]} - ${item}`}
                  </h2>
                </div>
              </span>

              <div className="flex items-center  gap-3 md:gap-8">
                <div className="flex gap-2 md:gap-4">
                  <div className="flex h-full  gap-1">
                    <CutleryIcon />
                    {dayUsers?.length}
                  </div>
                  <div className="flex h-full items-center gap-1  ">
                    <DayIcon />
                    {nightUsers?.length}
                  </div>
                </div>

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
              </div>
            </button>
            <div
              className={`${
                openAccordion === ix ? "h-auto" : "invisible h-0"
              } overflow-hidden`}
            >
              <div className="p-4 pt-0">
                <div className="rounded-[3px] bg-zinc-200 p-4 dark:bg-black dark:bg-opacity-30">
                  <div className="flex flex-row items-center justify-between">
                    <h3 className="text-xl md:text-2xl">Lunchpang</h3>
                    <ButtonFilter item={item} type="day" />
                  </div>
                  <DisplayList matches={dayUsers} />
                </div>
              </div>
              <div className="p-4 pt-0">
                <div className="rounded-[3px] bg-zinc-200 p-4 dark:bg-black dark:bg-opacity-30">
                  <div className="flex flex-row items-center justify-between">
                    <h3 className="text-xl md:text-2xl">Kvällspang</h3>
                    <ButtonFilter item={item} type="night" />
                  </div>
                  <DisplayList matches={nightUsers} />
                </div>
              </div>
            </div>
          </section>
        );
      })}
      <Modal isOpened={isOpen} onClose={onClose}>
        <SignUpModal {...{ activeSign, user, onClose }} />
      </Modal>
    </div>
  );
};

export default Page;
