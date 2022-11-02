import type { LoaderFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import Layout from "~/components/Layout";
import { getUser } from "~/lib/auth.server";
import { getAccounts, getPerson, getTagsStatus } from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const { data } = await getUser(request);

  const userId = data.session.user.id;

  const [{ data: person }, { data: accounts }, { tags, status }] =
    await Promise.all([
      getPerson(userId, request),
      getAccounts(userId, request),
      getTagsStatus(request),
    ]);

  return { person, accounts, tags, status };
};

export default function Dashboard() {
  // const loaderData = useLoaderData();
  const [openDialogCelebration, setOpenDialogCelebration] = useState(false);
  const [openDialogAction, setOpenDialogAction] = useState(false);
  return (
    <Layout>
      {/* <pre>
        <code className="text-xs">
          {JSON.stringify(loaderData, undefined, 2)}
        </code>
      </pre> */}
      <Outlet
        context={{
          celebrations: {
            openDialogCelebration,
            setOpenDialogCelebration,
          },
          actions: {
            openDialogAction,
            setOpenDialogAction,
          },
        }}
      />
    </Layout>
  );
}
