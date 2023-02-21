import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import CalendarHeader from "~/components/CalendarHeader";
import WeekView from "~/components/CalendarWeek";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import { getWeek } from "~/lib/functions";
import type { ActionModel } from "~/lib/models";

export async function loader({ request, params }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request);

  const { date } = params;
  const period = date ?? dayjs().format("YYYY-MM-DD");

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.account,
      user: session?.user.id,
      period: period,
      week: true,
    }),
    getCampaigns({ request, user: session?.user.id }),
  ]);

  return { period, actions, campaigns };
}

export default function WeekPage() {
  const { period, actions } = useLoaderData<typeof loader>();
  const { days } = getWeek({
    period,
  });

  return (
    <div className="h-screen overflow-hidden">
      <CalendarHeader date={dayjs(period)} view="week" />
      <WeekView period={days} actions={actions as ActionModel[]} />
    </div>
  );
}
