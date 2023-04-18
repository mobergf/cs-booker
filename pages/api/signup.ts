import initPocketBase from "components/pocketbase/pocketbase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(JSON.parse(req.body));

  const pb = initPocketBase(req, res);

  //   await pb.collection("user_match").create()
  //   if (currExercise?.created)
  //   await newPb.collection("weight").update(currExercise?.id, data);
  // else {
  //   await newPb.collection("weight").create(data);
  //   const hasWorkout = await newPb.collection("workout").getFullList(20, {
  //     filter: `created~"${new Date().toISOString().slice(0, 10)}"`,
  //   });
  //   if (!hasWorkout?.length)
  //     await newPb.collection("workout").create({ field: type });
  // }

  res.status(200).json({ name: "John Doe" });
}
