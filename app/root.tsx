import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import dayjs from "dayjs";
import { useState } from "react";

import styles from "./styles.css";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import type { ContextType } from "./lib/models";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "STUDIO - Plan fast. Work less.",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  {
    rel: "icon",
    href: "/ico.png",
  },
];

export const loader: LoaderFunction = () => {
  return json({
    env: {
      SUPABASE_URL: "https://pivlgmzzjgsysyvmsgjy.supabase.co",
      SUPABASE_ANON_KEY:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdmxnbXp6amdzeXN5dm1zZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMyNTM3NDUsImV4cCI6MTk2ODgyOTc0NX0.sSMLicGE_LCmu1YidlnHFqwNnNj4K2CCfJUiTHc3muA",
    },
  });
};

export function App() {
  const { env } = useLoaderData();
  const [theme] = useTheme();
  const [day, setDay] = useState(dayjs());
  const [option, setOption] = useState("all");
  const [openDialogAction, setopenDialogAction] = useState(false);
  const [openDialogCelebration, setopenDialogCelebration] = useState(false);
  const [openDialogCampaign, setopenDialogCampaign] = useState(false);
  const [openDialogSearch, setopenDialogSearch] = useState(false);
  const [openShortcut, setopenShortcut] = useState(false);
  const [sidebar, setsidebar] = useState(true);

  const context: ContextType = {
    date: {
      day,
      setDay,
    },
    filter: {
      option,
      setOption,
    },
    actions: {
      open: openDialogAction,
      setOpen: setopenDialogAction,
    },
    celebrations: {
      open: openDialogCelebration,
      setOpen: setopenDialogCelebration,
    },
    campaigns: {
      open: openDialogCampaign,
      setOpen: setopenDialogCampaign,
    },
    search: {
      open: openDialogSearch,
      setOpen: setopenDialogSearch,
    },

    shortcut: {
      open: openShortcut,
      setOpen: setopenShortcut,
    },
    sidebar: {
      open: sidebar,
      setOpen: setsidebar,
    },
  };

  return (
    <html lang="pt-br" className={theme ?? "dark"}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="app">
          <Outlet context={context} />
        </div>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />

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
