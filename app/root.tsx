import type {
  ActionFunction,
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
import { createServerClient } from "@supabase/auth-helpers-remix";
import styles from "./app.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "STUDIO",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "icon",
    href: "/ico.png",
  },
];

export const loader: LoaderFunction = () => {
  return json({
    env: {
      SUPABASE_URL: "https://prmvfibheijucdazdfzc.supabase.co",
      SUPABASE_ANON_KEY:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY4MzI1MCwiZXhwIjoxOTU5MjU5MjUwfQ.ElgtQJthx_B3DM_zIL2acASAo_J_F9HclpLDv1m_hQ0",
    },
  });
};

export default function App() {
  const { env } = useLoaderData();
  return (
    <html lang="pt-br" className="drk">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
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
