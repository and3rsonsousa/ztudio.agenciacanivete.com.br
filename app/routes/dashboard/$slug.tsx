import {
  CalendarDaysIcon,
  CheckCircleIcon,
  FolderIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
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
          className="focus-block overflow-hidden rounded border border-transparent"
        >
          <h2 className="mb-0 overflow-hidden text-ellipsis whitespace-nowrap  dark:text-gray-200">
            {account.name}
          </h2>
        </Link>
        <div className="text-sm font-semibold">
          <Link
            className="button button-link button-icon p-2"
            to={`./${period ? "?period=" + period : ""}`}
          >
            <CalendarDaysIcon />
            <div className="hidden md:block">Calendário</div>
          </Link>
          <Link className="button button-link button-icon p-2" to={`./actions`}>
            <CheckCircleIcon />
            <div className="hidden md:block">Ações</div>
          </Link>
          <Link
            className="button button-link button-icon p-2"
            to={`./?instagram${period ? "&period=" + period : ""}`}
          >
            <HeartIcon />
            <div className="hidden md:block">Instagram</div>
          </Link>
          <Link
            className="button button-link button-icon p-2"
            to={`./campaigns`}
          >
            <FolderIcon />
            <div className="hidden md:block">Campanhas</div>
          </Link>
        </div>
      </div>

      <Outlet context={useOutletContext()} />
    </div>
  );
}
