import { Button } from "components";
import { IMatchElement, getSignedUsersByDate } from "core/helpers/db.helpers";
import { IButtonFilter } from "core/interfaces/component.interfaces";
import { IMatch } from "core/interfaces/db.interfaces";

/**
 * @returns a sign up/remove sign-button based on the user + match status.
 */
export const ButtonFilter = ({
  matchDate,
  type,
  userMatches,
  matches,
  handleClick,
  handleRemoveSign,
  user,
}: IButtonFilter) => {
  const { dayUsers, nightUsers } = getSignedUsersByDate(
    userMatches,
    matches,
    matchDate,
  );

  /* Make sure we can find the user in the corresponding match */
  const hasMatch =
    type === "day"
      ? dayUsers.find(({ name }) => user.name === name)
      : nightUsers.find(({ name }) => user.name === name);

  if (!hasMatch)
    return (
      <Button
        onClick={() => handleClick(type, matchDate)}
        className="min-w-[100px]"
      >
        Signa upp
      </Button>
    );

  /* Find the exact match in order to use its' id */
  const hasMatchOnDate = matches?.items?.find(
    (match: IMatch) =>
      new Date(match.date).getDate() === new Date(matchDate).getDate() &&
      match.type === type,
  );

  /* Verify that the match and user id both exist in the join-table record */
  const signToRemove = userMatches?.items?.find(
    (x) => x.match === hasMatchOnDate?.id && x.user === user.id,
  );

  /* signToRemove should never be falsy, but throw a fragment to avoid button-confusion if it happens */
  if (!signToRemove) return <></>;

  return (
    <Button
      onClick={() => handleRemoveSign(signToRemove?.id)}
      className="min-w-[100px]"
      variant="secondary"
    >
      Signa av
    </Button>
  );
};

export const UserList = ({ matches }: { matches: IMatchElement[] }) => {
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
