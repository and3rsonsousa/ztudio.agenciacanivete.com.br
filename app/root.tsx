import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/cloudflare";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import styles from "~/tailwind.css";
import type { ContextType } from "./lib/models";
import { createServerClient } from "./lib/supabase";

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "ᴢᴛᴜᴅɪᴏ - ᴘʟaɴ ꜰazᴛ, ᴡᴏʀᴋ ʟezz",
    },
    {
      name: "description",
      content:
        "sistema de gerenciamento de ações criado e mantido pela aɢêɴᴄɪa caɴɪveᴛe",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "icon",
    href: "/ico.png",
  },
];

export const loader: LoaderFunction = async ({ request, context }) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context;
  const response = new Response();
  const supabase = createServerClient({
    SUPABASE_URL: SUPABASE_URL as string,
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY as string,
    request,
    response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    env: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    },
    session,
    headers: response.headers,
  };
};

export default function App() {
  const { env, session } = useLoaderData();

  const [supabase] = useState(() => {
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  });

  const [day, setDay] = useState(dayjs());
  const [filter, setFilter] = useState("all");
  const [arrange, setArrange] = useState("arrange_all");
  const [priority, setPriority] = useState(true);
  const [openDialogAction, setDialogAction] = useState(false);
  const [openDialogCelebration, setDialogCelebration] = useState(false);
  const [openDialogCampaign, setDialogCampaign] = useState(false);
  const [openDialogSearch, setDialogSearch] = useState(false);
  const [openShortcut, setShortcut] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const navigate = useNavigate();

  const context: ContextType = {
    date: {
      day,
      set: setDay,
    },
    filter: {
      option: filter,
      set: setFilter,
    },
    arrange: {
      option: arrange,
      set: setArrange,
    },
    priority: {
      option: priority,
      set: setPriority,
    },
    actions: {
      open: openDialogAction,
      set: setDialogAction,
    },
    celebrations: {
      open: openDialogCelebration,
      set: setDialogCelebration,
    },
    campaigns: {
      open: openDialogCampaign,
      set: setDialogCampaign,
    },
    search: {
      open: openDialogSearch,
      set: setDialogSearch,
    },

    shortcut: {
      open: openShortcut,
      set: setShortcut,
    },
    sidebar: {
      open: sidebar,
      set: setSidebar,
    },
    supabase,
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        navigate("/dashboard");
      }
    });
  }, [supabase, navigate]);

  return (
    <html lang="pt-br" className={"dark"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body>
        <div className="app">
          <Outlet context={context} />
        </div>
        <ScrollRestoration />

        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="grid min-h-screen place-content-center">
        <div className="mx-auto overflow-hidden rounded-lg bg-error-600 p-8 text-2xl font-bold text-white">
          {error.status}
        </div>
        <div className="p-8">
          <pre className="whitespace-pre-line  text-xs">{error.data}</pre>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="grid min-h-screen place-content-center">
        <div className="mx-auto overflow-hidden rounded-lg bg-error-600 p-8 text-2xl font-bold text-white">
          {error.message}
        </div>
        <div className="p-8">
          <pre className="whitespace-pre-line  text-xs">{error.stack}</pre>
        </div>
      </div>
    );
  } else {
    return <h1>Erro desconhecido</h1>;
  }
}
