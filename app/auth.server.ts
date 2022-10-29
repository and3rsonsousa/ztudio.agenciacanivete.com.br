import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { Session, supabaseClient } from "~/supabase";

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;
export const supabaseStrategy = new SupabaseStrategy(
  {
    supabaseClient,
    sessionStorage,
    sessionKey: "sb:session", // if not set, default is sb:session
    sessionErrorKey: "sb:error", // if not set, default is sb:error
  },
  // simple verify example for email/password auth
  async ({ req, supabaseClient }) => {
    const form = await req.formData();
    const email = form?.get("email");
    const password = form?.get("password");

    if (!email) throw new AuthorizationError("Email is required");
    if (typeof email !== "string")
      throw new AuthorizationError("Email must be a string");

    if (!password) throw new AuthorizationError("Password is required");
    if (typeof password !== "string")
      throw new AuthorizationError("Password must be a string");

    return supabaseClient.auth.api
      .signInWithEmail(email, password)
      .then(({ data, error }): Session => {
        if (error || !data) {
          throw new AuthorizationError(
            error?.message ?? "No user session found"
          );
        }

        return data;
      });
  }
);

export const authenticator = new Authenticator()<Session>(sessionStorage, {
  sessionKey: supabaseStrategy.sessionKey, // keep in sync
  sessionErrorKey: supabaseStrategy.sessionErrorKey, // keep in sync
});

authenticator.use(supabaseStrategy);
