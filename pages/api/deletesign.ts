import initPocketBase from "components/pocketbase/pocketbase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = JSON.parse(req.body);
  const pb = await initPocketBase(req, res);

  await pb.collection("user_match").delete(id);
  return res.status(200).json({});
}
