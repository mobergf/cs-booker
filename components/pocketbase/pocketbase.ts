import { IncomingMessage } from "http";
import PocketBase from "pocketbase";

// you can place this helper in a separate file so that it can be reused
export default async function initPocketBase(
  req:
    | (IncomingMessage & { cookies: Partial<{ [key: string]: string }> })
    | { name: string; value: string }[],
) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  // load the store data from the request cookie string
  pb.authStore.loadFromCookie(
    "headers" in req
      ? req?.headers?.cookie || ""
      : req.find((x) => x.name === "next-auth.session-token")?.value ?? "",
  );

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return pb;
}
