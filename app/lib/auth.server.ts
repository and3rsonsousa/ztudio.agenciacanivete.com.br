import { redirect } from "@remix-run/cloudflare";
// import { commitSession, destroySession, getSession } from "./session.server";
import { getSupabase } from "./supabase";

export async function signUP(
  email: string,
  password: string,
  name: string,
  request: Request
) {
  const { supabase, response } = getSupabase(request);
  await supabase.auth.signOut();
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({ email, password });
  if (user && !error) {
    const { error: person_error } = await supabase
      .from("Person")
      .insert([{ name, email, admin: true, user: user.id }]);
    if (!person_error) {
      return redirect("/dashboard", {
        headers: response.headers,
      });
    } else {
      return { error: person_error };
    }
  } else {
    return { user, error };
  }
}

export async function signIN(
  email: string,
  password: string,
  request: Request
) {
  const { supabase, response } = getSupabase(request);

  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  let user = data.user;
  if (!user || error) {
    return {
      error,
    };
  } else {
    return redirect("/dashboard", {
      headers: response.headers,
    });
  }
}

export async function signOUT(request: Request) {
  const { supabase, response } = getSupabase(request);
  await supabase.auth.signOut();

  return redirect("/login", {
    headers: response.headers,
  });
}
export async function getUser(request: Request) {
  const { supabase, response } = getSupabase(request);

  const { data } = await supabase.auth.getSession();

  if (data.session) {
    return { data };
  } else {
    throw redirect(`/login`, { headers: response.headers });
  }
}
