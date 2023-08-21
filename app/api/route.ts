import initPocketBase from "components/pocketbase/pocketbase";
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
    const postData = {
      match: hasGame.id,
      user: id,
      comment: comment,
    };

    await pb.collection("user_match").create(postData);
    redirect("/");
  }

  await pb
    .collection("csmatch")
    .create({ type, date })
    .then(async (res) => {
      const postData = {
        match: res.id,
        user: id,
        comment: comment,
      };
      await pb.collection("user_match").create(postData);
    });

  redirect("/");
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const pb = await initPocketBase(cookies().getAll());

  await pb.collection("user_match").delete(id);
  revalidateTag("homepage");
  revalidateTag("homepage-match");
  redirect("/");
}
