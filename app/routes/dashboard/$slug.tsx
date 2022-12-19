import {
  CalendarDaysIcon,
  DocumentCheckIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";

import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import PageHeader from "~/components/PageHeader";
import { getAccount } from "~/lib/data";
import type { AccountModel } from "~/lib/models";

export const meta: MetaFunction = ({ data }) => ({
  title: `${data.account.name} - STUDIO`,
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data: account } = await getAccount(request, params.slug);

  return { account };
};

export default function Slug() {
  const { account } = useLoaderData<{ account: AccountModel }>();
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
        <PageHeader link={`/dashboard/${account.slug}`}>
          {account.name}
        </PageHeader>

        <div className="text-sm font-semibold">
          <Link
            className="button button-link button-icon p-2"
            to={`./${month ? "?month=" + month : ""}`}
          >
            <CalendarDaysIcon />
            <div className="hidden md:block">Calendário</div>
          </Link>
          <Link className="button button-link button-icon p-2" to={`./actions`}>
            <DocumentCheckIcon />
            <div className="hidden md:block">Ações</div>
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
