import { createCookieSessionStorage } from "@remix-run/cloudflare";

const sessionSecret = "2tud10";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__ztudio__cookie__",

      httpOnly: true,
      maxAge: 60 * 60 * 24 * 3,
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: false,
    },
  });

export { getSession, commitSession, destroySession };
