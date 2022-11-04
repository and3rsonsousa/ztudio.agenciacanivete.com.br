import type { LoaderFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import Layout from "~/components/Layout";
import { getUser } from "~/lib/auth.server";
import {
  getAccounts,
  getCampaigns,
  getCelebrations,
  getPerson,
  getTagsStatus,
} from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const { data } = await getUser(request);

  const userId = data.session.user.id;

  const [
    { data: person },
    { data: accounts },
    { tags, status },
    { data: celebrations },
    { data: campaigns },
  ] = await Promise.all([
    getPerson(userId, request),
    getAccounts(userId, request),
    getTagsStatus(request),
    getCelebrations({ request }),
    getCampaigns({ request }),
  ]);

  return { person, accounts, tags, status, celebrations, campaigns };
};

export default function Dashboard() {
  const [openDialogCelebration, setOpenDialogCelebration] = useState(false);
  const [openDialogAction, setOpenDialogAction] = useState(true);
  return (
    <Layout>
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
