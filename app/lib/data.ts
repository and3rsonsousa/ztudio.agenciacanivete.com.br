import {
  add,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { getSupabase } from "./supabase";

export const getPerson = (id: string, request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase.from("Person").select("*").eq("user", id).single();
};

export const getPersons = (request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase.from("Person").select("*").order("name", { ascending: true });
};

export const getAccount = async (
  request: Request,

  slug?: string,
  id?: string
) => {
  const { supabase } = getSupabase(request);
  if (id) {
    return supabase.from("Account").select("*").eq("id", id).single();
  }
  return supabase.from("Account").select("*").eq("slug", slug).single();
};

export const getAccounts = (userId: string, request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase
    .from("Account")
    .select("*")
    .contains("users", [userId])
    .order("name", {
      ascending: true,
    });
};

// export const deleteAccount = async (id: string) => {
//   let { data, error } = await supabase.from("Account").delete().eq("id", id);
//   if (error) {
//     return error;
//   }
//   return { data };
// };

// export const addAccount = async (
//   name: string,
//   slug: string,
//   users: string[]
// ) => {
//   let { data, error } = await supabase.from("Account").insert([
//     {
//       name,
//       slug,
//       users,
//     },
//   ]);

//   if (error) {
//     return { error };
//   }

//   return { data };
// };

// export const updateAccount = async (
//   id: string,
//   name: string,
//   slug: string,
//   users: string[]
// ) => {
//   let { data, error } = await supabase
//     .from("Account")
//     .update({
//       id,
//       name,
//       slug,
//       users,
//     })
//     .eq("id", id);

//   if (error) {
//     return { error };
//   }

//   return { data };
// };

// export const getCampaigns = (account: string) => {
//   return supabase
//     .from("Campaign")
//     .select("*, Account!inner(*)")
//     .eq("Account.slug", account)
//     .order("date");
// };

export const getTagsStatus = async (request: Request) => {
  const { supabase } = getSupabase(request);
  const [{ data: tags }, { data: status }] = await Promise.all([
    supabase.from("Tag").select("*").order("name", { ascending: true }),
    supabase.from("Status").select("*"),
  ]);

  return { tags, status };
};

export const getActions = async (
  args: {
    request?: Request;
    user?: string;
    account?: string;
    period?: Date;
  } = {}
) => {
  let { user, account, period, request } = args;

  if (!request) {
    throw new Error("Request is undefined");
  }

  let _period = period ?? startOfToday();
  let firstDayOfCurrentMonth = parse(
    format(_period, "MMM-yyy"),
    "MMM-yyyy",
    new Date()
  );

  let firstDay = add(startOfWeek(startOfMonth(firstDayOfCurrentMonth)), {
    days: -1,
  });
  let lastDay = add(endOfWeek(endOfMonth(firstDayOfCurrentMonth)), {
    hours: 1,
  });
  const { supabase } = getSupabase(request);

  if (account) {
    return supabase
      .from("Action")
      .select("*, Account!inner(*)")
      .eq("Account.slug", account)
      .gte("date", format(firstDay, "y/M/d"))
      .lte("date", format(lastDay, "y/M/d"))
      .order("date", {
        ascending: true,
      })
      .order("created_at", { ascending: true });
  } else {
    if (!user) {
      throw new Error("User is undefined");
    }

    return supabase
      .from("Action")
      .select("*, Account!inner(*)")
      .contains("Account.users", [user])
      .gte("date", format(firstDay, "y/M/d"))
      .lte("date", format(lastDay, "y/M/d"))
      .filter("account", "not.is", null)
      .order("date", {
        ascending: true,
      })
      .order("created_at", { ascending: true });
  }
};
export const getCelebrations = async (
  args: {
    request?: Request;
  } = {}
) => {
  let { request } = args;

  if (!request) {
    throw new Error("Request is undefined");
  }

  const { supabase } = getSupabase(request);

  return supabase.from("Celebration").select("*").order("is_holiday");
};

// export const getAction = (id?: string) => {
//   return supabase
//     .from("Action")
//     .select(
//       "*, account:Account(*), status(*), tag:Tag(*), creator:Action_creator_fkey(*), responsible:Action_responsible_fkey(*),campaign:Campaign(*), tasks:Task(*)"
//     )
//     .eq("id", id)
//     .single();
// };

// export async function createAction(formData: FormData) {
//   const name = formData.get("name") as string;
//   const date = formData.get("date") as string;
//   const account = formData.get("account") as string;
//   const description = (formData.get("description") as string) || null;
//   const date_end = (formData.get("date_end") as string) || null;
//   const tag = formData.get("tag") as string;
//   const status = formData.get("status") as string;
//   const creator = formData.get("creator") as string;
//   const responsible = formData.get("responsible") as string;
//   const campaign = (formData.get("campaign") as string) || null;

//   if (account) {
//     const { data: action, error } = await supabase.from("Action").insert([
//       {
//         name,
//         description,
//         date,
//         date_end,
//         tag,
//         status,
//         account,
//         creator,
//         responsible,
//         campaign,
//       },
//     ]);

//     if (error) return { error };

//     return action;
//   } else {
//     const { data: action, error } = await supabase.from("Action").insert([
//       {
//         name,
//         date,
//       },
//     ]);

//     if (error) return { error };

//     return action;
//   }
// }

// export async function updateAction(
//   id: string,
//   values: {
//     name?: string;
//     date?: string;
//     account?: string;
//     description?: string;
//     tag?: string;
//     status?: string;
//     responsible?: string;
//     campaign?: string;
//     date_end?: string;
//   }
// ) {
//   const { data, error } = await supabase
//     .from("Action")
//     .update(values)
//     .eq("id", id);

//   return { data, error };
// }

// export async function deleteAction(id: string) {
//   const { data, error } = await supabase.from("Action").delete().eq("id", id);

//   return { data, error };
// }

export const handleAction = async (formData: FormData, request: Request) => {
  const action = formData.get("action") as string;

  if (action === "create-action") {
    // return await createAction(formData);
  } else if (action.match(/update-/)) {
    const id = formData.get("id") as string;
    let values = {};
    if (action === "update-tag") {
      values = { tag: formData.get("tag") as string };
    } else if (action === "update-status") {
      values = { status: formData.get("status") as string };
    } else if (action === "update-date") {
      values = { date: formData.get("date") as string };
    }
    // return await updateAction(id, values);
  } else if (action === "delete-action") {
    const id = formData.get("id") as string;
    // return await deleteAction(id);
  } else if (action === "create-celebration") {
    return await createCelebration(formData, request);
  }

  return {
    error: { message: "No matched action" },
  };
};

async function createCelebration(formData: FormData, request: Request) {
  const { supabase } = getSupabase(request);

  let date = formData.get("date") as string;
  let dateSplit = date.split("/");

  const { data, error } = await supabase.from("Celebration").insert({
    name: formData.get("name"),
    date: `${dateSplit[1]}/${dateSplit[0]}`,
    is_holiday: formData.get("is_holiday"),
  });

  return {
    data,
    error,
  };
}
