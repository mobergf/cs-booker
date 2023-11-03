import { IMatches, IUserMatch, IMatch } from "core/interfaces/db.interfaces";

export type IMatchElement = {
  name: string;
  comment: string;
};
export const getSignedUsersByDate = (
  userMatches: IMatches<IUserMatch>,
  data: IMatches<IMatch>,
  date: string,
) => {
  const dayUsers: IMatchElement[] = [];
  const nightUsers: IMatchElement[] = [];

  if (!data?.items?.length) {
    return { dayUsers, nightUsers }; // Return empty arrays for both if there are no items
  }
  data.items
    .filter(
      (item2) => new Date(item2.date).getDate() === new Date(date).getDate(),
    )
    .forEach((item2) => {
      const itemList = userMatches?.items
        .filter((x) => x.match === item2.id)
        .map((pum) => ({
          name: pum?.expand?.user?.name,
          comment: pum.comment,
        }));

      if (item2.type === "day") {
        dayUsers.push(...itemList);
      } else if (item2.type === "night") {
        nightUsers.push(...itemList);
      }
    });

  return { dayUsers, nightUsers };
};
