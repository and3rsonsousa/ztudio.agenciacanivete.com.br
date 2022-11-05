import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getActions } from "~/lib/data";
export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: actions } = await getActions({ request, account: params.slug });

  return { actions };
};

export default function SlugIndex() {
  const loaderData = useLoaderData();

  return <Calendar actions={loaderData.actions} />;
}
