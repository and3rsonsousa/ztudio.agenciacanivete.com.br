import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getAccount, getActions } from "~/lib/data";

export const loader: LoaderFunction = async ({ request, params }) => {
  const [{ data: actions }, { data: account }] = await Promise.all([
    getActions({ request, account: params.slug }),
    getAccount(request, params.slug),
  ]);

  return { actions, account, params };
};

export default function SlugPage() {
  const loaderData = useLoaderData();
  return (
    <div>
      <div className="border-b p-4 dark:border-gray-800">
        {<h2 className="mb-0 text-gray-200">{loaderData.account.name}</h2>}
      </div>
      <Calendar actions={loaderData.actions} />
    </div>
  );
}
