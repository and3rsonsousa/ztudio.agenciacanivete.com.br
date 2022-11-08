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
  return supabase.from("Person").select("*").eq("id", id).single();
};

export const getPersonByUser = (id: string, request: Request) => {
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

export const getAllAccounts = (request: Request) => {
  const { supabase } = getSupabase(request);
  return supabase.from("Account").select("*").order("name", {
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

export const getCampaigns = async (
  args: {
    request?: Request;
  } = {}
) => {
  let { request } = args;

  if (!request) {
    throw new Error("Request is undefined");
  }

  const { supabase } = getSupabase(request);

  return supabase.from("Campaign").select("*");
};

export const getAction = (request: Request, id: string) => {
  const { supabase } = getSupabase(request);
  return supabase
    .from("Action")
    .select(
      "*, account:Account(*), status(*), tag:Tag(*), creator:Action_creator_fkey(*), responsible:Action_responsible_fkey(*),campaign:Campaign(*)"
    )
    .eq("id", id)
    .single();
};

export async function updateAction(
  request: Request,
  id: string,
  values: {
    name?: string;
    date?: string;
    account?: string;
    description?: string;
    tag?: string;
    status?: string;
    responsible?: string;
    campaign?: string;
    date_end?: string;
  }
) {
  const { supabase } = getSupabase(request);
  const { data, error } = await supabase
    .from("Action")
    .update(values)
    .eq("id", id);

  return { data, error };
}

export async function deleteItem(request: Request, item: string, id: string) {
  const { supabase } = getSupabase(request);
  const { data, error } = await supabase
    .from(item)
    .delete()
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export const handleAction = async (formData: FormData, request: Request) => {
  const action = formData.get("action") as string;
  const { supabase } = getSupabase(request);

  if (action.match(/create-/)) {
    // Celebration
    if (action === "create-celebration") {
      return await createCelebration(formData, request);
    } else if (action === "create-action") {
      const creator = formData.get("creator");
      const name = formData.get("name");
      const account = formData.get("account");
      const campaign = formData.get("campaign");
      const description = formData.get("description");
      const tag = formData.get("tag");
      const status = formData.get("status");
      const date = formData.get("date");

      const values = {
        creator: creator,
        responsible: creator,
        name,
        account,
        campaign: campaign ? campaign : null,
        description,
        tag,
        status,
        date,
      };

      if (name === "") {
        return {
          error: {
            message: "Coloque o nome da ação.",
          },
        };
      }
      if (account === "") {
        return {
          error: {
            message: "Escolha um cliente.",
          },
        };
      }

      const { data, error } = await supabase
        .from("Action")
        .insert(values)
        .select("*")
        .single();

      return { data, error };
    }
  } else if (action.match(/update-/)) {
    const id = formData.get("id") as string;
    let values = {};
    let table = "";
    if (action === "update-tag") {
      values = { tag: formData.get("tag") as string, updated_at: "NOW()" };
      table = "Action";
    } else if (action === "update-status") {
      values = {
        status: formData.get("status") as string,
        updated_at: "NOW()",
      };
      table = "Action";
    } else if (action === "update-date") {
      values = {
        date: format(
          new Date(formData.get("date") as string),
          "y-MM-dd'T'HH:mm:ss"
        ),
        updated_at: "NOW()",
      };
      table = "Action";
    } else if (action === "update-action") {
      values = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        account: formData.get("account") as string,
        tag: formData.get("tag") as string,
        status: formData.get("status") as string,
        date: formData.get("date") as string,
        responsible: formData.get("responsible") as string,
        updated_at: "NOW()",
        campaign: formData.get("campaign") as string,
      };

      table = "Action";
    } else if (action === "update-person") {
      table = "Person";
      values = {
        name: formData.get("name") as string,
      };
    } else if (action === "update-account") {
      table = "Account";
      values = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        users: formData.getAll("users") as string[],
      };
    }
    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq("id", id)
      .select("*")
      .single();

    return { data, error };
  } else if (action.match(/delete-/)) {
    let table = "";
    const id = formData.get("id") as string;
    if (action === "delete-action") {
      table = "Action";
    } else if (action === "delete-celebration") {
      table = "Celebration";
    } else if (action === "delete-account") {
      table = "Account";
    }
    return await deleteItem(request, table, id);
  } else if (action.match(/duplicate-/)) {
    const id = formData.get("id") as string;

    if (action === "duplicate-action") {
      const { data: old_action } = await supabase
        .from("Action")
        .select("*")
        .eq("id", id)
        .single();

      const new_action = {
        name: old_action.name,
        description: old_action.description,
        date: old_action.date,
        tag: old_action.tag,
        status: old_action.status,
        account: old_action.account,
        campaign: old_action.campaign,
        creator: old_action.creator,
        responsible: old_action.responsible,
      };

      const { data, error } = await supabase
        .from("Action")
        .insert(new_action)
        .select("*")
        .single();

      console.log({ data, error });

      return { data, error };
    }
  }

  return {
    error: { message: "No matched action" },
  };
};

async function createCelebration(formData: FormData, request: Request) {
  const { supabase } = getSupabase(request);

  let name = formData.get("name");
  let date = formData.get("date") as string;
  if (name === "" || date === "") {
    return {
      error: {
        message: "Nome ou Data está em branco",
      },
    };
  }

  let dateSplit = date.split("/");

  const { data, error } = await supabase
    .from("Celebration")
    .insert({
      name: name,
      date: `${dateSplit[1]}/${dateSplit[0]}`,
      is_holiday: formData.get("is_holiday"),
    })
    .select()
    .single();

  return {
    data,
    error,
  };
}
