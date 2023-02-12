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
import { Partytown } from "@builder.io/partytown/react";
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
        <Partytown
          forward={["fbq"]}
          debug={true}
          resolveUrl={function (url) {
            if (url.hostname === "connect.facebook.net") {
              var proxyUrl = new URL("https://ztudio.agenciacanivete.com.br/");
              proxyUrl.searchParams.append("url", url.href);
              return proxyUrl;
            }
            return url;
          }}
        />
        <script
          type="text/partytown"
          async
          dangerouslySetInnerHTML={{
            __html: `setTimeout(function(){!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1017323528864709');
fbq('track', 'PageView');}, 1000)`,
          }}
        ></script>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="app">
          <Outlet context={context} />
        </div>
        <ScrollRestoration />

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1017323528864709&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

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
