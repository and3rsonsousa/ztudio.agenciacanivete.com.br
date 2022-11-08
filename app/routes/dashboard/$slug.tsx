import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { getAccount } from "~/lib/data";
import type { AccountModel } from "~/lib/models";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.account.name} / ꜱᴛᴜᴅɪᴏ`,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: account } = await getAccount(request, params.slug);

  return { account };
};

export default function Slug() {
  const { account } = useLoaderData<{ account: AccountModel }>();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <Link to={`/dashboard/${account.slug}`}>
          <h2 className="mb-0 dark:text-gray-200">{account.name}</h2>
        </Link>
      </div>
      <Outlet context={useOutletContext()} />
    </div>
  );
}
