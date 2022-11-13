import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { getAccount } from "~/lib/data";
import type { AccountModel } from "~/lib/models";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.account.name} / STUDIO`,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: account } = await getAccount(request, params.slug);

  return { account };
};

export default function Slug() {
  const { account } = useLoaderData<{ account: AccountModel }>();
  const [searchParams] = useSearchParams();
  const period = searchParams.get("period");

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
        <Link
          to={`/dashboard/${account.slug}`}
          className="focus-block rounded border border-transparent"
        >
          <h2 className="mb-0 dark:text-gray-200">{account.name}</h2>
        </Link>
        <div className="text-sm font-semibold ">
          <Link
            className="button button-link"
            to={`./${period ? "?period=" + period : ""}`}
          >
            Ações
          </Link>
          <Link className="button button-link" to={`./campaigns`}>
            Campanhas
          </Link>
        </div>
      </div>
      <Outlet context={useOutletContext()} />
    </div>
  );
}
