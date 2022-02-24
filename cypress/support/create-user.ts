// Use this to create a new user and login with that user
// Simply call this with:
// node --require esbuild-register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.

import { parse } from "cookie";
import { installGlobals } from "@remix-run/node/globals";
import { createUserSession } from "../../app/session.server";
import { createUser } from "../../app/models/user.server";

installGlobals();

async function createAndLogin(email: string) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  const user = await createUser(email, "myreallystrongpassword");

  const response = await createUserSession(new Request(""), user.id, "/");

  const cookieValue = response.headers.get("Set-Cookie");
  if (!cookieValue) {
    throw new Error("Cookie missing from createUserSession response");
  }
  const parsedCookie = parse(cookieValue);
  console.log(parsedCookie.__session);
}

createAndLogin(process.argv[2]);