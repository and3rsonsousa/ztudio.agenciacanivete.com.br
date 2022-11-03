import type { LoaderFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import Layout from "~/components/Layout";
import { getUser } from "~/lib/auth.server";
import {
  getAccounts,
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
  ] = await Promise.all([
    getPerson(userId, request),
    getAccounts(userId, request),
    getTagsStatus(request),
    getCelebrations({ request }),
  ]);

  console.log(celebrations);

  return { person, accounts, tags, status, celebrations };
};

export default function Dashboard() {
  const [openDialogCelebration, setOpenDialogCelebration] = useState(false);
  const [openDialogAction, setOpenDialogAction] = useState(false);
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
