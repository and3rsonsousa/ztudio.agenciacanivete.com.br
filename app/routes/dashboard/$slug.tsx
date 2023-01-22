import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";

import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { CalendarDays, FileCheck2, Folder } from "lucide-react";
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
      <div className="flex items-center justify-between p-4">
        <PageHeader link={`/dashboard/${account.slug}`}>
          {account.name}
        </PageHeader>

        <div className="shrink-0 text-sm font-semibold">
          <Link
            className="button button-link button-icon button-small"
            to={`./${month ? "?month=" + month : ""}`}
          >
            <CalendarDays />
            <div className="hidden md:block">Calendário</div>
          </Link>
          <Link
            className="button button-link button-icon button-small"
            to={`./actions`}
          >
            <FileCheck2 />
            <div className="hidden md:block">Ações</div>
          </Link>
          <Link
            className="button button-link button-icon button-small"
            to={`./campaigns`}
          >
            <Folder />
            <div className="hidden md:block">Campanhas</div>
          </Link>
        </div>
      </div>

      <Outlet context={useOutletContext()} />
    </div>
  );
}
