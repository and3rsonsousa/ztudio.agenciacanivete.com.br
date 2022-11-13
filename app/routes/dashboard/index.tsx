import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";

export const loader: LoaderFunction = async ({ request, params }) => {
  let period = new URL(request.url).searchParams.get("period");

  const {
    data: {
      session: { user },
    },
  } = await getUser(request);
  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.account,
      user: user.id,
      period,
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
