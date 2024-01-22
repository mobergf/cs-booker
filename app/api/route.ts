import initPocketBase from "components/pocketbase/pocketbase";
import { signUpUserForMatch } from "core/helpers/db.helpers";
import { postFacebook } from "core/helpers/fb.helpers";
import { IMatch } from "core/interfaces/db.interfaces";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { type, date, id, comment } = await req.json();
  const pb = await initPocketBase(cookies().getAll());

  const hasGame = await pb
    .collection("csmatch")
    .getList(1, 50, {
      filter: `date ~ "${date}" && type = "${type}"`,
    })
    .then((res) => !!res?.items?.length && res?.items?.[0]);

  if (hasGame) {
    const totalSignupString = await signUpUserForMatch(
      pb,
      hasGame.id,
      id,
      comment,
    );
    await postFacebook(totalSignupString).finally(() => redirect("/"));
  }

  await pb
    .collection("csmatch")
    .create({ type, date })
    .then(async (res) => {
      const totalSignupString = await signUpUserForMatch(
        pb,
        res.id,
        id,
        comment,
      );

      await postFacebook(totalSignupString).finally(() => redirect("/"));
    });

  redirect("/");
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const pb = await initPocketBase(cookies().getAll());
  const matchId = await pb
    .collection("user_match")
    .getOne(id)
    .then((res) => res.match);
  await pb.collection("user_match").delete(id);

  /* Fetch all signees for the match so we can post them to the messenger channel */
  const signees = await pb
    .collection("user_match")
    .getList<{
      created: Date;
      comment?: string;
      expand: { user: { name: string }; match: IMatch };
    }>(1, 20, {
      filter: `match = "${matchId}"`,
      expand: "user,match",
    })
    .then(
      (res) =>
        res?.items?.sort(
          (a, b) =>
            new Date(a.created).getTime() - new Date(b.created).getTime(),
        ),
    );

  if (!signees?.length) {
    revalidateTag("homepage");
    revalidateTag("homepage-match");
    return redirect("/");
  }

  /* Separated constants for clearer structure instead of large concat */
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
  const totalSignupString = `[HUVUDSKOTT]: ${amounts}, ${type}, ${date} [${names}]`;
  await postFacebook(totalSignupString).finally(() => {
    revalidateTag("homepage");
    revalidateTag("homepage-match");
    redirect("/");
  });
}
