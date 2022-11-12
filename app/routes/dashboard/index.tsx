import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: {
      session: { user },
    },
  } = await getUser(request);
  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      user: user.id,
    }),
    getCampaigns({ request, user: user.id }),
  ]);

  return { actions, campaigns };
};

const DashboardIndex = () => {
  const { actions } = useLoaderData();
  return (
    <div className="h-screen">
      <Calendar actions={actions} />
    </div>
  );
};

export default DashboardIndex;
