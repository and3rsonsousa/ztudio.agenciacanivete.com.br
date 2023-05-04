import type { LinksFunction, V2_MetaFunction } from "@remix-run/cloudflare";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// import styles from "~/tailwind.css";

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
  // { rel: "stylesheet", href: styles },
  {
    rel: "icon",
    href: "/ico.png",
  },
];

export default function App() {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body>
        {/* <div className="app"> */}
        <Outlet />
        {/* </div> */}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
