import type { LoaderArgs, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import { checkDate } from "~/lib/functions";

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderArgs) => {
  let period = new URL(request.url).searchParams.get("date");
  period = checkDate(period);

  const {
    data: { session },
  } = await getUser(request);

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.account,
      user: session?.user.id,
      period,
    }),
    getCampaigns({ request, user: session?.user.id }),
  ]);

  return { actions, campaigns, date: period };
};

const DashboardIndex = () => {
  const { actions, campaigns, date } = useLoaderData();

  return (
    <div className="h-screen">
      <Calendar actions={actions} campaigns={campaigns} date={date} />
    </div>
  );
};

export default DashboardIndex;
