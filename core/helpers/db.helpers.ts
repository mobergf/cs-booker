import { IMatches, IUserMatch, IMatch } from "core/interfaces/db.interfaces";
import Client from "pocketbase";

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

export async function signUpUserForMatch(
  pb: Client,
  matchId: string,
  userId: string,
  comment: string,
) {
  const postData = {
    match: matchId,
    user: userId,
    comment: comment,
  };

  const createdMatchId = await pb
    .collection("user_match")
    .create(postData)
    .then((res) => res.match);

  const signees = await pb
    .collection("user_match")
    .getList<{
      created: Date;
      comment?: string;
      expand: { user: { name: string }; match: IMatch };
    }>(1, 20, {
      filter: `match = "${createdMatchId}"`,
      expand: "user,match",
    })
    .then((res) =>
      res.items.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
      ),
    );

  const match = signees?.[0]?.expand?.match;
  const names = signees
    .map((sign) =>
      sign?.comment
        ? `${sign.expand.user.name} (${sign.comment})`
        : sign.expand.user.name,
    )
    .join(", ");
  const amounts = `+${5 - signees.length}/${10 - signees.length}`;
  const type = match.type === "day" ? "Lunch" : "Kväll";
  const date =
    new Date(match.date).getDate() === new Date().getDate()
      ? "Idag"
      : match.date.slice(0, 10);
  return `${amounts}, ${type}, ${date} [${names}]`;
}
