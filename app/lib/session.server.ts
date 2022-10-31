import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

const sessionSecret = "5tud10";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__studio__cookie__",

      httpOnly: true,
      maxAge: 60 * 60 * 24 * 3,
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: false,
    },
  });

export { getSession, commitSession, destroySession };

// export async function logout(request: Request) {
//   let session = await getSession(request.headers.get("Cookie"));

//   return redirect("/dashboard", {
//     headers: {
//       "Set-Cookie": await destroySession(session),
//     },
//   });
// }

// export async function getUserId(request: Request) {
//   let session = await getSession(request.headers.get("Cookie"));
//   if (session.has("userId")) {
//     let userId = session.get("userId");
//     return userId;
//   }
// }
