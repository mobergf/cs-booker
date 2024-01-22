import { promises as fs } from "fs";
const login = require("facebook-chat-api");

export const postFacebook = async (signup: string) => {
  /* This file will probably need to be updated every 2 months since the login cookies are saved to a file.
    Perhaps some sort of cronjob with puppeteer or playwright can be used but it has not been explored yet.
    Look at: https://github.com/Schmavery/facebook-chat-api/issues/870#issuecomment-813977403 for more info.
   */
  const file = await fs.readFile(process.cwd() + "/app/fb.json", "utf8");

  const loginFunc = async () =>
    await login(
      { appState: JSON.parse(file) },
      async (err: unknown, api: any) => {
        if (err) return Promise.reject(err);

        /* This ID can be used for testing, will post in a group chat with only Elliot, Fredrik and the bot (ask if you want to be added) */
        // const huvudskottID = "7099277746857051";
        const huvudskottID = "6337705556253711";
        const msg = { body: signup };
        await api.sendMessage(msg, huvudskottID);
        return Promise.resolve();

        // This method returns all available group chats + IDs.
        // If more chats wants this notification, add the bot to the chat then uncomment this line to find its ID.
        // await api.getThreadList(10, null, ["INBOX"], async (err: any, listOfChats: any) => {
        //   console.log(err, listOfChats);
        // });
      },
    );

  return await loginFunc()
    .then((res) => res)
    .catch((err) => {
      throw new Error(err);
    });
};
