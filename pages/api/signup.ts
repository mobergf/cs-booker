import initPocketBase from "components/pocketbase/pocketbase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, date, id, comment } = JSON.parse(req.body);
  const pb = await initPocketBase(req, res);

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
    return res.status(200).json({});
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
  return res.status(200).json({});
}
