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
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import type { ContextType } from "./lib/models";
import styles from "./styles.css";

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "ᴢᴛᴜᴅɪᴏ - ᴘʟαɴ ꜰαzᴛ, ᴡᴏʀᴋ ʟeᴢᴢ",
    },
    {
      name: "description",
      content:
        "sistema de gerenciamento de ações criado e mantido pela αɢêɴᴄɪα ᴄαɴɪᴠeᴛe",
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

export const loader: LoaderFunction = () => ({
  env: {
    SUPABASE_URL: "https://pivlgmzzjgsysyvmsgjy.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdmxnbXp6amdzeXN5dm1zZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMyNTM3NDUsImV4cCI6MTk2ODgyOTc0NX0.sSMLicGE_LCmu1YidlnHFqwNnNj4K2CCfJUiTHc3muA",
  },
});

export function App() {
  const { env } = useLoaderData();
  const [theme] = useTheme();
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
    supabase: supabase,
  };

  const revalidator = useRevalidator();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      revalidator.revalidate();
    });

    return () => subscription.unsubscribe();
  }, [supabase, revalidator]);

  return (
    <html lang="pt-br" className={theme ?? "dark"}>
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

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="grid min-h-screen place-content-center">
          <div className="mx-auto overflow-hidden rounded-lg bg-error-600 p-8 text-2xl font-bold text-white">
            {error.message}
          </div>
          <div className="p-8">
            <pre className="whitespace-pre-line  text-xs">{error.stack}</pre>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
