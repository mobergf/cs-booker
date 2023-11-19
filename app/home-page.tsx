"use client";
import { Modal, SignUpModal } from "components";
import { getSignedUsersByDate } from "core/helpers/db.helpers";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModeToggle from "./mode-toggle";
import { IMatch, IMatches, IUserMatch } from "core/interfaces/db.interfaces";
import { ButtonFilter, UserList } from "./home-page.components";
import { AddIcon, CutleryIcon, DayIcon, MinusIcon } from "components/icons";

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
  matches: IMatches<IMatch>;
  userMatches: IMatches<IUserMatch>;
  user: User;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [activeSign, setActiveSign] = useState<{
    type: string;
    date: string;
  }>();
  const { refresh } = useRouter();

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

  const handleRemoveSign = async (id?: string) => {
    if (!id) throw new Error("User is not signed up for that match");
    await fetch("/api", {
      method: "DELETE",
      body: JSON.stringify({
        id,
      }),
    }).then(() => refresh());
  };

  return (
    <div className="mx-auto max-w-5xl pb-8 pt-4 md:px-4">
      <div className="flex flex-row items-center justify-between px-4 md:px-0">
        <h1 className="text-2xl font-bold md:text-4xl">HUVUDSKOTT.SE</h1>
        <ModeToggle />
      </div>
      {dateArray.map((matchDate, ix) => {
        const { dayUsers, nightUsers } = getSignedUsersByDate(
          userMatches,
          matches,
          matchDate,
        );

        return (
          <section
            key={ix + userMatches?.totalItems}
            className={`m-2.5 mt-5 grid rounded-[3px] bg-white bg-opacity-70 dark:bg-[#182535] dark:bg-opacity-50 dark:bg-gradient-to-tl dark:from-[#2F3F5C]/50 dark:via-[#022B31]/50 dark:to-[#214F73]/50 md:m-0 md:mt-6`}
          >
            <button
              className="inline-flex w-full items-center px-4 py-4 "
              onClick={() =>
                setOpenAccordion((prev) => (prev === ix ? 50 : ix))
              }
            >
              <span className="w-full">
                <h2 className="flex text-xl md:text-2xl">
                  {`${weekdays[new Date(matchDate).getDay()]} - ${matchDate}`}
                </h2>
                <div className="flex gap-4 pt-1 md:pt-2">
                  <div className="flex h-full  gap-1">
                    <CutleryIcon />
                    {dayUsers?.length}
                  </div>
                  <div className="flex h-full items-center gap-1  ">
                    <DayIcon />
                    {nightUsers?.length}
                  </div>
                </div>
              </span>

              <div className="flex items-center  gap-3 md:gap-8">
                {openAccordion === ix ? <MinusIcon /> : <AddIcon />}
              </div>
            </button>
            <div
              className={`grid transition-all ${
                openAccordion === ix
                  ? "opacity-1 grid-rows-[1fr]"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-0">
                  <div className="rounded-[3px] bg-[#B3BDCD25] p-4 dark:bg-black dark:bg-opacity-30">
                    <div className="flex flex-row items-center justify-between">
                      <h3 className="text-xl md:text-2xl">
                        <CutleryIcon className="mr-1 inline-flex h-5 w-5" />
                        Lunchpang
                      </h3>
                      <ButtonFilter
                        {...{
                          matchDate,
                          matches,
                          userMatches,
                          handleClick,
                          handleRemoveSign,
                          user,
                        }}
                        type="day"
                      />
                    </div>
                    <UserList matches={dayUsers} />
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="rounded-[3px] bg-[#B3BDCD25] p-4 dark:bg-black dark:bg-opacity-30">
                    <div className="flex flex-row items-center justify-between">
                      <h3 className="text-xl md:text-2xl">
                        <DayIcon className="mr-1 inline-flex h-5 w-5" />
                        Kvällspang
                      </h3>
                      <ButtonFilter
                        {...{
                          matchDate,
                          matches,
                          userMatches,
                          handleClick,
                          handleRemoveSign,
                          user,
                        }}
                        type="night"
                      />
                    </div>
                    <UserList matches={nightUsers} />
                  </div>
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
